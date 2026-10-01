import 'server-only';
import { createHmac, randomUUID } from 'node:crypto';
import type { Db } from 'mongodb';
import { serverConfig } from './env';
import { incrementBucket } from '@/lib/rate-limit-core';

export function newSessionId() { return randomUUID(); }
export function validSessionId(id?: string) { return !!id && /^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(id); }
export function hashIdentity(value: string) {
  if (!serverConfig.rateLimitSecret) throw new Error('limiter_unconfigured');
  return createHmac('sha256',serverConfig.rateLimitSecret).update(value).digest('hex');
}

const memoryStore = new Map<string, { count: number; expiresAt: number }>();
const WINDOW_MS = 60_000;

function incrementMemoryBucket(identity: string, limit: number, now: Date = new Date()) {
  const windowIndex = Math.floor(now.getTime() / WINDOW_MS);
  const key = `${identity}:${windowIndex}`;
  const nowMs = now.getTime();

  if (memoryStore.size > 500) {
    for (const [k, v] of memoryStore.entries()) {
      if (v.expiresAt < nowMs) memoryStore.delete(k);
    }
  }

  const current = memoryStore.get(key) || { count: 0, expiresAt: (windowIndex + 2) * WINDOW_MS };
  current.count += 1;
  memoryStore.set(key, current);

  const retryAfter = Math.max(1, Math.ceil(((windowIndex + 1) * WINDOW_MS - nowMs) / 1000));
  return { allowed: current.count <= limit, retryAfter };
}

export async function checkRateLimits(db?: Db | null, sessionId: string = newSessionId(), trustedClient?: string) {
  if (db) {
    try {
      const collection = db.collection('rate_limits');
      const global = await incrementBucket(collection, 'global', serverConfig.globalLimit);
      if (!global.allowed) return global;
      const session = await incrementBucket(collection, `session:${hashIdentity(sessionId)}`, serverConfig.sessionLimit);
      if (!session.allowed) return session;
      if (trustedClient) return incrementBucket(collection, `client:${hashIdentity(trustedClient)}`, serverConfig.sessionLimit);
      return { allowed: true, retryAfter: 0 };
    } catch {
      // Fall through to in-memory rate limiting if database is unavailable
    }
  }

  const global = incrementMemoryBucket('global', serverConfig.globalLimit);
  if (!global.allowed) return global;
  const session = incrementMemoryBucket(`session:${hashIdentity(sessionId)}`, serverConfig.sessionLimit);
  if (!session.allowed) return session;
  if (trustedClient) return incrementMemoryBucket(`client:${hashIdentity(trustedClient)}`, serverConfig.sessionLimit);
  return { allowed: true, retryAfter: 0 };
}
