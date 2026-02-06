/**
 * Vercel Edge Function — proxies Google Translate TTS.
 *
 * The browser can't call Google TTS directly (referrer / CORS).
 * This function runs server-side on Vercel's edge network, adds
 * the right headers, and streams the audio back to the client.
 *
 * GET /api/tts?tl=ko&q=안녕하세요  →  audio/mpeg
 */
export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const tl = searchParams.get('tl');
  const q = searchParams.get('q');

  if (!tl || !q) {
    return new Response('Missing tl or q parameter', { status: 400 });
  }

  const googleUrl =
    `https://translate.google.com/translate_tts?ie=UTF-8` +
    `&tl=${encodeURIComponent(tl)}&client=tw-ob` +
    `&q=${encodeURIComponent(q)}` +
    `&total=1&idx=0&textlen=${q.length}&prev=input&ttsspeed=1`;

  try {
    const upstream = await fetch(googleUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });

    if (!upstream.ok) {
      return new Response('Upstream TTS error', { status: 502 });
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new Response('TTS proxy error', { status: 502 });
  }
}
