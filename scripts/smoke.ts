import { MongoClient } from 'mongodb';
import { GoogleGenAI } from '@google/genai';
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;
const key = process.env.GEMINI_API_KEY;
if (uri && !/REPLACE_|PLACEHOLDER/i.test(uri)) {
  const client = new MongoClient(uri,{serverSelectionTimeoutMS:5000,connectTimeoutMS:5000});
  try {
    await client.connect();
    const count = await client.db(process.env.MONGODB_DB || 'healthpod_bd').collection('knowledge').countDocuments({namespace:'healthpod-bd',active:true});
    if(!count) throw new Error('knowledge_unseeded');
    console.log(`MongoDB live connection succeeded; ${count} active project entries.`);
  } catch {
    console.error('MongoDB live check failed. Check credentials, project permissions, Atlas network access, and seeding.');
    process.exitCode = 1;
  } finally { await client.close(); }
} else {
  console.log('MongoDB live check skipped: configure MONGODB_URI in .env.');
}
if (key && !/REPLACE_|PLACEHOLDER/i.test(key)) {
  try {
    const ai = new GoogleGenAI({apiKey:key});
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: 'Reply with only OK.',
      config: { maxOutputTokens: 200, httpOptions: { timeout: 25000 } }
    });
    if (!response.text?.trim()) throw new Error('empty_response');
    console.log('Gemini live model call succeeded.');
  } catch (error) {
    console.error('Gemini live check failed. Error:', error);
    process.exitCode = 1;
  }
} else {
  console.log('Gemini live check skipped: configure GEMINI_API_KEY in .env.');
}
