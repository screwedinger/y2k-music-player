export type YouTubeTrack={id:string;title:string;artist:string;channel:string;thumbnail:string;duration?:string};
export async function searchYouTube(query:string,apiKey:string):Promise<YouTubeTrack[]>{
 if(!apiKey) throw new Error('Missing NEXT_PUBLIC_YOUTUBE_API_KEY');
 const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=20&q=${encodeURIComponent(query)}&key=${encodeURIComponent(apiKey)}`;
 const res=await fetch(url); const data=await res.json();
 if(!res.ok) throw new Error(data?.error?.message||`YouTube API error (${res.status})`);
 return (data.items||[]).map((x:any)=>({id:x.id.videoId,title:x.snippet.title,artist:x.snippet.channelTitle,channel:x.snippet.channelTitle,thumbnail:x.snippet.thumbnails?.high?.url||x.snippet.thumbnails?.default?.url})).filter((x:YouTubeTrack)=>x.id);
}
