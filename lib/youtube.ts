export type YouTubeTrack={id:string;title:string;artist:string;channel:string;thumbnail:string;duration?:string};

export function extractYouTubeId(value:string){
 const raw=value.trim();
 if(/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
 try{
  const url=new URL(raw);
  const host=url.hostname.toLowerCase().replace(/^www\./,'');
  if(host==='youtu.be') return url.pathname.split('/').filter(Boolean)[0]?.slice(0,11)||null;
  if(host==='youtube.com'||host==='m.youtube.com'||host==='music.youtube.com'||host==='youtube-nocookie.com'){
   const v=url.searchParams.get('v');
   if(v) return v.slice(0,11);
   const parts=url.pathname.split('/').filter(Boolean);
   if(['shorts','embed','live','v'].includes(parts[0])) return parts[1]?.slice(0,11)||null;
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
