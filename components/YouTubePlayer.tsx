'use client';
import {useEffect,useRef} from 'react';

declare global{interface Window{YT:any;onYouTubeIframeAPIReady?:()=>void}}
export default function YouTubePlayer({videoId,playing,volume,onStateChange,onReady}:{videoId:string;playing:boolean;volume:number;onStateChange:(playing:boolean)=>void;onReady?:()=>void}){
 const ref=useRef<any>(null),player=useRef<any>(null);
 useEffect(()=>{if(!videoId)return;const make=()=>{player.current=new window.YT.Player(ref.current,{videoId,playerVars:{autoplay:0,controls:0,rel:0,modestbranding:1,playsinline:1},events:{onReady:(e:any)=>{e.target.setVolume(volume);onReady?.()},onStateChange:(e:any)=>onStateChange(e.data===window.YT.PlayerState.PLAYING)}})};if(window.YT?.Player)make();else{const old=document.querySelector('script[data-youtube-api]');if(!old){const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.dataset.youtubeApi='true';document.body.appendChild(s)}window.onYouTubeIframeAPIReady=make}return()=>{player.current?.destroy();player.current=null}},[videoId]);
 useEffect(()=>{if(!player.current?.playVideo)return;playing?player.current.playVideo():player.current.pauseVideo()},[playing]);
 useEffect(()=>{player.current?.setVolume?.(volume)},[volume]);
 return <div className="youtube-player"><div ref={ref}/></div>;
}
