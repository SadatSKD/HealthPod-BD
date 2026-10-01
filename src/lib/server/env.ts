import 'server-only';

const configured = (value?: string) => !!value?.trim() && !/REPLACE_|YOUR_|PLACEHOLDER/i.test(value);
export const serverConfig = {
  geminiKey: configured(process.env.GEMINI_API_KEY) ? process.env.GEMINI_API_KEY! : null,
  geminiModel: process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash',
  mongoUri: configured(process.env.MONGODB_URI) ? process.env.MONGODB_URI! : null,
  mongoDb: process.env.MONGODB_DB?.trim() || 'healthpod_bd',
  rateLimitSecret: configured(process.env.RATE_LIMIT_SECRET) ? process.env.RATE_LIMIT_SECRET! : 'healthpod-bd-local-secret',
  sessionLimit: positiveInt(process.env.CHAT_REQUESTS_PER_MINUTE,5),
  globalLimit: positiveInt(process.env.CHAT_GLOBAL_REQUESTS_PER_MINUTE,5),
  trustProxyHeaders: process.env.TRUST_PROXY_HEADERS === 'true'
};

function positiveInt(raw: string | undefined, fallback: number) {
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}
