import 'server-only';
import type { Db } from 'mongodb';
import { approvedKnowledge, type KnowledgeEntry } from '@/content/knowledge';

const MAX_CONTEXT = 30000;
export async function loadKnowledge(db?: Db | null): Promise<KnowledgeEntry[]> {
  if (db) {
    try {
      const entries = await db.collection<KnowledgeEntry>('knowledge').find({namespace:'healthpod-bd',active:true}).sort({id:1}).toArray();
      if (entries.length) {
        const context = knowledgeContext(entries);
        if (context.length <= MAX_CONTEXT) return entries;
      }
    } catch {
      // Fallback to static approvedKnowledge if database query fails
    }
  }
  return approvedKnowledge.filter(entry => entry.active);
}

export function knowledgeContext(entries: KnowledgeEntry[]) {
  return JSON.stringify(entries.map(({id,title,body,status,sections,sourceTitle,sourceUrl})=>({id,title,body,status,sections,sourceTitle,sourceUrl})));
}
