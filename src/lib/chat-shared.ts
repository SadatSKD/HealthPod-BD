import { z } from 'zod';
import type { KnowledgeEntry } from '@/content/knowledge';
import { approvedSource } from '@/content/knowledge';

export const languageSchema = z.enum(['auto','en','bn','banglish']);
export type Language = z.infer<typeof languageSchema>;
export const chatRequestSchema = z.strictObject({
  message: z.string().trim().min(1).max(2000),
  language: languageSchema,
  history: z.array(z.strictObject({role:z.enum(['user','assistant']),content:z.string().trim().min(1).max(2000)})).max(32)
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = {answer:string;sources:Array<{id:string;title:string;url?:string;section?:string}>};
export const modelOutputSchema = z.strictObject({ answer:z.string().trim().min(1).max(5000), sourceIds:z.array(z.string()).max(12) });

export function mapApprovedSources(ids: string[] | undefined, entries: KnowledgeEntry[]) {
  if (!ids || !Array.isArray(ids)) return [];
  const lookup = new Map(entries.filter(e=>e.active && e.status !== 'needs_verification').map(e=>[e.id,e]));
  const validIds = [...new Set(ids)].filter(id=>lookup.has(id));
  return validIds.map(id=>approvedSource(lookup.get(id)!));
}

export function inferErrorLanguage(message: string): Language {
  if (/[\u0980-\u09ff]/.test(message)) return 'bn';
  if (/\b(ki|korle|hobe|keno|ache|kemon|bhat|kheyech|parbe|jabe|bolen)\b/i.test(message)) return 'banglish';
  return 'en';
}

export function errorInLanguage(language: Language, kind: 'invalid'|'limit'|'unavailable'|'timeout') {
  const messages = {
    en: {invalid:'Please enter a shorter, valid question.',limit:'Too many requests. Please wait a minute and try again.',unavailable:'The AI advisor is temporarily unavailable. Please try again later.',timeout:'The advisor took too long to respond. Please try again.'},
    bn: {invalid:'অনুগ্রহ করে সংক্ষিপ্ত ও সঠিক প্রশ্ন লিখুন।',limit:'অনেক অনুরোধ এসেছে। এক মিনিট পরে আবার চেষ্টা করুন।',unavailable:'এআই উপদেষ্টা সাময়িকভাবে পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।',timeout:'উত্তর পেতে বেশি সময় লাগছে। আবার চেষ্টা করুন।'},
    banglish: {invalid:'Doya kore chhoto o thik proshno likhun.',limit:'Onek request esheche. Ek minute pore abar cheshta korun.',unavailable:'AI advisor ekhon pawa jacche na. Pore abar cheshta korun.',timeout:'Uttor dite beshi shomoy lagchhe. Abar cheshta korun.'}
  };
  return messages[language === 'auto' ? 'en' : language][kind];
}
