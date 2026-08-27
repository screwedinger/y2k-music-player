import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!query) return NextResponse.json({ error: 'Missing search query.' }, { status: 400 });
  if (!apiKey) return NextResponse.json({ error: 'YouTube API is not configured on this deployment.' }, { status: 500 });

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('videoCategoryId', '10');
  url.searchParams.set('maxResults', '20');
  url.searchParams.set('q', query);
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 30 } });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || 'YouTube search failed.' }, { status: response.status });
    const results = (data.items || []).map((item: any) => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      artist: item.snippet?.channelTitle,
      channel: item.snippet?.channelTitle,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
    })).filter((item: any) => item.id);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: 'Could not reach YouTube.' }, { status: 502 });
  }
}
