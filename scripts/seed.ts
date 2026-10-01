import { MongoClient } from 'mongodb';
import nextEnv from '@next/env';
import { approvedKnowledge } from '../src/content/knowledge';
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;
if (!uri || /REPLACE_|PLACEHOLDER/i.test(uri)) {
  console.error('MONGODB_URI is missing or still a placeholder. Update the ignored .env file.');
  process.exit(1);
}
const client = new MongoClient(uri,{serverSelectionTimeoutMS:5000,connectTimeoutMS:5000,maxPoolSize:3});
try {
  const db = client.db(process.env.MONGODB_DB || 'healthpod_bd');
  const knowledge = db.collection('knowledge');
  const limits = db.collection('rate_limits');
  await client.connect();
  await knowledge.createIndex({namespace:1,id:1},{unique:true});
  await limits.createIndex({key:1},{unique:true});
  await limits.createIndex({expiresAt:1},{expireAfterSeconds:0});
  const ids = approvedKnowledge.map(entry=>entry.id);
  for (const entry of approvedKnowledge) await knowledge.updateOne({namespace:'healthpod-bd',id:entry.id},{$set:entry},{upsert:true});
  await knowledge.updateMany({namespace:'healthpod-bd',id:{$nin:ids}},{$set:{active:false}});
  console.log(`Seeded ${ids.length} HealthPod knowledge entries and indexes. Superseded project entries deactivated.`);
} catch {
  console.error('Database seeding failed. Check credentials, project database permissions, and Atlas network access.');
  process.exitCode = 1;
} finally { await client.close(); }
