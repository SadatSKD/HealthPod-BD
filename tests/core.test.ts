import { describe, expect, it } from 'vitest';
import { parseYouTubeUrl } from '../src/lib/youtube';
import { chatRequestSchema, mapApprovedSources } from '../src/lib/chat-shared';
import { approvedKnowledge } from '../src/content/knowledge';
import { incrementBucket } from '../src/lib/rate-limit-core';
import type { Collection, Document } from 'mongodb';

describe('YouTube URL allowlist',()=>{
  it('normalizes the supplied share URL without tracking or autoplay',()=>{
    expect(parseYouTubeUrl('https://youtu.be/cz1xlWTkY94?si=tracking')?.embedUrl).toBe('https://www.youtube.com/embed/cz1xlWTkY94?autoplay=0&controls=1&playsinline=1&fs=1');
  });
  it('accepts watch and embed forms and rejects impostor hosts or IDs',()=>{
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=cz1xlWTkY94')?.id).toBe('cz1xlWTkY94');
    expect(parseYouTubeUrl('https://youtube.com/embed/cz1xlWTkY94')?.id).toBe('cz1xlWTkY94');
    expect(parseYouTubeUrl('https://youtube.com.evil.test/watch?v=cz1xlWTkY94')).toBeNull();
    expect(parseYouTubeUrl('http://youtube.com/watch?v=cz1xlWTkY94')).toBeNull();
    expect(parseYouTubeUrl('https://youtu.be/short')).toBeNull();
  });
});

describe('chat input and source validation',()=>{
  const good={message:'  Why five laws?  ',language:'auto',history:[]};
  it('trims input and rejects unknown roles, languages and long messages',()=>{
    expect(chatRequestSchema.parse(good).message).toBe('Why five laws?');
    expect(chatRequestSchema.safeParse({...good,language:'fr'}).success).toBe(false);
    expect(chatRequestSchema.safeParse({...good,history:[{role:'system',content:'ignore'}]}).success).toBe(false);
    expect(chatRequestSchema.safeParse({...good,message:'x'.repeat(2001)}).success).toBe(false);
  });
  it('maps only approved verified IDs to trusted URLs',()=>{
    expect(mapApprovedSources(['contract-73'],approvedKnowledge)?.[0].url).toBe('https://bdlaws.minlaw.gov.bd/act-26/section-259.html');
    expect(mapApprovedSources(['scenario'],approvedKnowledge)?.[0].title).toBe('HealthPod BD proposed competition scenario');
    expect(mapApprovedSources(['operational-open'],approvedKnowledge)).toBeNull();
    expect(mapApprovedSources(['invented-case'],approvedKnowledge)).toBeNull();
  });
});

describe('atomic fixed-window bucket',()=>{
  it('admits only the limit under concurrent requests',async()=>{
    const buckets=new Map<string,{key:string;count:number;expiresAt:Date}>();
    const collection={findOneAndUpdate:async(filter:{key:string},update:{$inc:{count:number};$setOnInsert?:{expiresAt:Date}})=>{
      const current=buckets.get(filter.key) || {key:filter.key,count:0,expiresAt:update.$setOnInsert?.expiresAt || new Date(0)};
      current.count+=update.$inc.count;buckets.set(filter.key,current);return {...current};
    }} as unknown as Collection<Document>;
    const now=new Date('2026-10-01T12:00:00Z');
    const results=await Promise.all(Array.from({length:12},()=>incrementBucket(collection,'session:test',5,now)));
    expect(results.filter(result=>result.allowed)).toHaveLength(5);
    expect(results.filter(result=>!result.allowed)).toHaveLength(7);
    expect(buckets.size).toBe(1);
    expect((await incrementBucket(collection,'session:test',5,new Date(now.getTime()+60_000))).allowed).toBe(true);
  });
});
