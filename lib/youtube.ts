export type YouTubeTrack={id:string;title:string;artist:string;channel:string;thumbnail:string;duration?:string};

export function extractYouTubeId(value:string){
 try{
  const url=new URL(value.trim());
  if(url.hostname==='youtu.be') return url.pathname.slice(1).split('/')[0]||null;
  if(url.hostname.includes('youtube.com')){
   if(url.searchParams.get('v')) return url.searchParams.get('v');
   const parts=url.pathname.split('/').filter(Boolean);
   if(['shorts','embed','live'].includes(parts[0])) return parts[1]||null;
  }
 }catch{}
 return null;
}

export async function searchYouTube(query:string):Promise<YouTubeTrack[]>{
 const res=await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
 const data=await res.json();
 if(!res.ok) throw new Error(data?.error||`YouTube search failed (${res.status})`);
 return data;
}
