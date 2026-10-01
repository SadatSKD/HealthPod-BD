import type { Metadata } from 'next';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/noto-sans-bengali/400.css';
import '@fontsource/noto-sans-bengali/500.css';
import '@fontsource/noto-sans-bengali/600.css';
import './globals.css';

const siteUrl = process.env.SITE_URL && /^https?:\/\//.test(process.env.SITE_URL)
  ? process.env.SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:'HealthPod BD — Next Venture',
  description:'Explore HealthPod BD, the proposed self-service health check concept, connected business-law scenario, AI Legal Advisor and concept video.',
  alternates:{canonical:'/'},
  openGraph:{title:'HealthPod BD — Next Venture',description:'A UIU Business Law competition concept and AI legal advisor.',images:['/brand/healthpod-logo.jpeg']}
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
