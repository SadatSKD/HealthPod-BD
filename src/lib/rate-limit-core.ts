import type { Collection, Document } from 'mongodb';

export const WINDOW_MS = 60_000;
export async function incrementBucket(collection: Collection<Document>, identity: string, limit: number, now: Date = new Date()) {
  const window = Math.floor(now.getTime()/WINDOW_MS);
  const key = `${identity}:${window}`;
  const expiresAt = new Date((window+2)*WINDOW_MS);
  try {
    const result = await collection.findOneAndUpdate({key},{$inc:{count:1},$setOnInsert:{expiresAt}}, {upsert:true,returnDocument:'after'});
    return {allowed:(result?.count ?? limit+1) <= limit, retryAfter: Math.max(1,Math.ceil(((window+1)*WINDOW_MS-now.getTime())/1000))};
  } catch (error) {
    if ((error as {code?:number}).code === 11000) {
      const result = await collection.findOneAndUpdate({key},{$inc:{count:1}}, {returnDocument:'after'});
      return {allowed:(result?.count ?? limit+1) <= limit,retryAfter:Math.max(1,Math.ceil(((window+1)*WINDOW_MS-now.getTime())/1000))};
    }
    throw error;
  }
}
