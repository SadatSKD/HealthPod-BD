import { NextRequest, NextResponse } from 'next/server';
import { chatRequestSchema, errorInLanguage, inferErrorLanguage, mapApprovedSources, type Language } from '@/lib/chat-shared';
import { serverConfig } from '@/lib/server/env';
import { getDb } from '@/lib/server/mongodb';
import { loadKnowledge } from '@/lib/server/knowledge';
import { checkRateLimits, newSessionId, validSessionId } from '@/lib/server/rate-limit';
import { askGemini } from '@/lib/server/gemini';

export const runtime = 'nodejs';
export const maxDuration = 40;

async function boundedText(request: Request, maxBytes: number) {
  const length = Number(request.headers.get('content-length'));
  if (Number.isFinite(length) && length > maxBytes) throw new Error('body_too_large');
  if (!request.body) throw new Error('empty_body');
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0; let text = '';
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) throw new Error('body_too_large');
      text += decoder.decode(value,{stream:true});
    }
    return text + decoder.decode();
  } finally { reader.releaseLock(); }
}

function jsonResponse(body: object, status: number, sessionId: string, retryAfter?: number) {
  const response = NextResponse.json(body,{status,headers:retryAfter?{'Retry-After':String(retryAfter)}:undefined});
  response.cookies.set('hp_session',sessionId,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV === 'production',path:'/',maxAge:60*60*24});
  return response;
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('hp_session')?.value;
  const sessionId = validSessionId(cookie) ? cookie! : newSessionId();
  let language: Language = 'auto';
  let parsed;
  try {
    const raw = await boundedText(request,32*1024);
    parsed = chatRequestSchema.parse(JSON.parse(raw));
    language = parsed.language === 'auto' ? inferErrorLanguage(parsed.message) : parsed.language;
    parsed.history = parsed.history.slice(-8);
  } catch {
    return jsonResponse({error:errorInLanguage(language,'invalid')},400,sessionId);
  }
  if (!serverConfig.geminiKey) {
    console.error('[Chat API] GEMINI_API_KEY is not configured or still contains "REPLACE_" in .env. Current value:', process.env.GEMINI_API_KEY ? `"${process.env.GEMINI_API_KEY.slice(0, 10)}..."` : 'undefined');
    return jsonResponse({error:errorInLanguage(language,'unavailable')},503,sessionId);
  }
  try {
    let db = null;
    if (serverConfig.mongoUri) {
      try {
        db = await getDb();
      } catch {
        db = null;
      }
    }
    const trustedClient = serverConfig.trustProxyHeaders ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() : undefined;
    const limit = await checkRateLimits(db,sessionId,trustedClient);
    if (!limit.allowed) return jsonResponse({error:errorInLanguage(language,'limit')},429,sessionId,limit.retryAfter);
    const knowledge = await loadKnowledge(db);
    const result = await askGemini(parsed,knowledge);
    const sources = mapApprovedSources(result.sourceIds,knowledge);
    return jsonResponse({answer:result.answer,sources},200,sessionId);
  } catch (error) {
    console.error('[Chat API] Internal error processing chat:', error);
    const status = (error as {status?:number}).status;
    if (status === 429) return jsonResponse({error:errorInLanguage(language,'limit')},429,sessionId,60);
    const timeout = /timeout|deadline|abort/i.test(String((error as Error)?.message || ''));
    return jsonResponse({error:errorInLanguage(language,timeout?'timeout':'unavailable')},timeout?504:503,sessionId);
  }
}
