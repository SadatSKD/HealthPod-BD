const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function parseYouTubeUrl(value?: string): {id: string; embedUrl: string; watchUrl: string} | null {
  if (!value) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.toLowerCase();
  let id: string | null = null;
  if (host === 'youtu.be' && /^\/[A-Za-z0-9_-]{11}\/?$/.test(url.pathname)) id = url.pathname.split('/')[1];
  else if (host === 'youtube.com' || host === 'www.youtube.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else if (/^\/embed\/[A-Za-z0-9_-]{11}\/?$/.test(url.pathname)) id = url.pathname.split('/')[2];
  }
  if (!id || !VIDEO_ID.test(id)) return null;
  return {id,embedUrl:`https://www.youtube.com/embed/${id}?autoplay=0&controls=1&playsinline=1&fs=1`,watchUrl:`https://www.youtube.com/watch?v=${id}`};
}
