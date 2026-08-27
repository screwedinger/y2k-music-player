'use client';

import { useEffect } from 'react';
import { getAccessToken, isSpotifyConfigured, transferSpotifyPlayback } from '@/lib/spotify';

export default function SpotifyPlayback(){
 useEffect(()=>{
  if(!isSpotifyConfigured()) return;
  let cancelled=false; let player:any=null; let script:HTMLScriptElement|null=null;
  const start=()=>{
   if(cancelled||player||!getAccessToken()) return;
   const setup=()=>{
    if(cancelled||player||!(window as any).Spotify||!getAccessToken())return;
    player=new (window as any).Spotify.Player({name:'Y2K PLAYER',volume:.72,getOAuthToken:(cb:(token:string)=>void)=>{const token=getAccessToken();if(token)cb(token)}});
    player.addListener('ready',async({device_id}:{device_id:string})=>{try{await transferSpotifyPlayback(device_id)}catch{}});
    player.addListener('authentication_error',({message}:{message:string})=>console.warn('Spotify playback authentication:',message));
    player.addListener('initialization_error',({message}:{message:string})=>console.warn('Spotify playback initialization:',message));
    player.connect();
   };
   if((window as any).Spotify){setup();return;}
   script=document.createElement('script');script.src='https://sdk.scdn.co/spotify-player.js';script.async=true;script.onload=setup;document.body.appendChild(script);
  };
  const interval=window.setInterval(start,1000);start();
  return()=>{cancelled=true;window.clearInterval(interval);player?.disconnect();if(script?.parentNode)script.parentNode.removeChild(script)};
 },[]);
 return null;
}
