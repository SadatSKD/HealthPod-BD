import 'server-only';
import { MongoClient, type Db } from 'mongodb';
import { serverConfig } from './env';

let clientPromise: Promise<MongoClient> | null = null;

export async function getDb(): Promise<Db> {
  if (!serverConfig.mongoUri) throw new Error('mongo_unconfigured');
  if (!clientPromise) {
    const client = new MongoClient(serverConfig.mongoUri, {serverSelectionTimeoutMS:5000,connectTimeoutMS:5000,maxPoolSize:10});
    clientPromise = client.connect().catch(error=>{ clientPromise = null; void client.close(); throw error; });
  }
  const client = await clientPromise;
  return client.db(serverConfig.mongoDb);
}
