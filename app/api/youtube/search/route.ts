import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!query) return NextResponse.json({ error: 'Missing search query.' }, { status: 400 });
  if (!apiKey) return NextResponse.json({ error: 'YouTube API key is missing on Vercel. Add YOUTUBE_API_KEY to the deployment environment.' }, { status: 500 });

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '20');
  url.searchParams.set('q', query);
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) {
      const reason = data?.error?.errors?.[0]?.reason;
      const message = data?.error?.message || 'YouTube search failed.';
      if (reason === 'quotaExceeded') return NextResponse.json({ error: 'YouTube API quota has been exceeded. Try again later.' }, { status: 429 });
      if (reason === 'keyInvalid') return NextResponse.json({ error: 'The YouTube API key is invalid.' }, { status: 401 });
      if (reason === 'accessNotConfigured') return NextResponse.json({ error: 'YouTube Data API v3 is not enabled for this Google Cloud project.' }, { status: 403 });
      return NextResponse.json({ error: message }, { status: response.status });
    }
    const results = (data.items || []).map((item: any) => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      artist: item.snippet?.channelTitle,
      channel: item.snippet?.channelTitle,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    })).filter((item: any) => item.id && item.title);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: 'Could not reach YouTube. Check the deployment/network and try again.' }, { status: 502 });
  }
}
