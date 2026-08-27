'use client';
import {useEffect,useRef} from 'react';
declare global{interface Window{YT:any;onYouTubeIframeAPIReady?:()=>void}}
type Props={videoId:string;playing:boolean;volume:number;onStateChange:(playing:boolean)=>void;onTime:(current:number,duration:number)=>void;onEnded:()=>void};
export default function YouTubePlayer({videoId,playing,volume,onStateChange,onTime,onEnded}:Props){
 const mount=useRef<HTMLDivElement>(null),player=useRef<any>(null),desiredPlaying=useRef(false),timer=useRef<ReturnType<typeof setInterval>|null>(null);
 useEffect(()=>{desiredPlaying.current=playing},[playing]);
 useEffect(()=>{if(!videoId)return;let cancelled=false;const make=()=>{if(cancelled||!window.YT?.Player||!mount.current)return;player.current=new window.YT.Player(mount.current,{videoId,origin:window.location.origin,playerVars:{autoplay:0,controls:0,rel:0,modestbranding:1,playsinline:1,origin:window.location.origin},events:{onReady:(e:any)=>{e.target.setVolume(volume);if(desiredPlaying.current)e.target.playVideo()},onStateChange:(e:any)=>{const state=e.data;const p=state===window.YT.PlayerState.PLAYING;onStateChange(p);if(state===window.YT.PlayerState.ENDED)onEnded()}}})};if(window.YT?.Player)make();else{const old=document.querySelector('script[data-youtube-api]');if(!old){const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.dataset.youtubeApi='true';document.body.appendChild(s)}window.onYouTubeIframeAPIReady=make}return()=>{cancelled=true;if(timer.current)clearInterval(timer.current);player.current?.destroy?.();player.current=null}},[videoId]);
 useEffect(()=>{desiredPlaying.current=playing;const p=player.current;if(!p||typeof p.playVideo!=='function')return;playing?p.playVideo():p.pauseVideo()},[playing]);
 useEffect(()=>{player.current?.setVolume?.(volume)},[volume]);
 useEffect(()=>{if(timer.current)clearInterval(timer.current);timer.current=setInterval(()=>{const p=player.current;if(p&&typeof p.getCurrentTime==='function')onTime(p.getCurrentTime()||0,p.getDuration?.()||0)},500);return()=>{if(timer.current)clearInterval(timer.current)}},[onTime]);
 const seek=(seconds:number)=>{const p=player.current;if(p&&typeof p.seekTo==='function')p.seekTo(seconds,true)};
 useEffect(()=>{(window as any).__y2kSeek=seek;return()=>{if((window as any).__y2kSeek===seek)delete (window as any).__y2kSeek}},[videoId]);
 return <div className="youtube-hidden-player"><div ref={mount}/></div>;
}
