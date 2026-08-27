'use client';

import { useEffect, useState } from 'react';
import { Disc3, Heart, ListMusic, Album, Mic2, Search, Sparkles, Settings2, Moon, Sun, SkipBack, SkipForward, Play, Pause, Volume2, Shuffle, Repeat2 } from 'lucide-react';

const tracks = [
  ['01', 'Toxic', 'Britney Spears', '03:19', 'TOXIC'],
  ['02', 'Promiscuous', 'Nelly Furtado', '04:02', 'LOOSE'],
  ['03', 'Hollaback Girl', 'Gwen Stefani', '03:19', 'LOVE.ANGEL.MUSIC.BABY.'],
  ['04', 'Maneater', 'Nelly Furtado', '04:18', 'LOOSE'],
  ['05', 'Yeah!', 'Usher', '04:10', 'CONFESSIONS'],
];

const palettes = [
  ['#ff2fb3','#ffd400','#0066ff'], ['#ff5a00','#ffdf00','#9d4edd'], ['#b7ff00','#ff3cac','#00d4ff'], ['#ff7b00','#ff2d55','#6930c3'], ['#00e5ff','#ffea00','#ff3cac']
];

export default function Home() {
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(134);
  const [selected, setSelected] = useState(1);
  const [dark, setDark] = useState(true);
  const [volume, setVolume] = useState(72);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((t) => t >= 242 ? 0 : t + 1), 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const clock = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
  const fmt = (seconds:number) => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  const track = tracks[selected];
  const palette = palettes[selected];

  const selectTrack = (i:number) => { setSelected(i); setTime(0); setPlaying(true); };
  const stepTrack = (dir:number) => selectTrack((selected + dir + tracks.length) % tracks.length);

  return (
    <main className={`shell ${dark ? 'dark' : 'light'}`} style={{ '--a':palette[0], '--b':palette[1], '--c':palette[2] } as React.CSSProperties}>
      <div className="window">
        <header className="topbar">
          <div className="logo"><Disc3 size={24} strokeWidth={3}/> Y2K <span>PLAYER</span></div>
          <div className="top-actions">
            <div className="status"><i className="status-dot"/> SPOTIFY ONLINE</div>
            <div className="clock">{clock}</div>
            <button className="icon-btn" onClick={()=>setDark(d=>!d)} aria-label="Toggle theme">{dark ? <Sun size={17}/> : <Moon size={17}/>}</button>
          </div>
        </header>

        <section className="body">
          <aside className="sidebar">
            <div className="side-label">LIBRARY / 05</div>
            <nav className="nav">
              {[[Disc3,'HOME'],[Heart,'LIKED SONGS'],[ListMusic,'PLAYLISTS'],[Album,'ALBUMS'],[Mic2,'ARTISTS']].map(([Icon,item],i) => <button className={i===0?'active':''} key={item as string}><Icon size={15}/>{item as string}</button>)}
            </nav>
            <div className="side-label">DISCOVER</div>
            <nav className="nav"><button><Search size={15}/>SEARCH</button><button><Sparkles size={15}/>BROWSE</button></nav>
            <div className="system"><div className="sys-title">SYSTEM / ONLINE</div><p>Y2KP-03 // REV 2.0</p><p>HI-FI DIGITAL AUDIO</p><p>44.1 KHZ / STEREO</p><div className="sys-bars"><b/><b/><b/><b/><b/></div></div>
            <button className="settings"><Settings2 size={14}/> SYSTEM SETTINGS</button>
          </aside>

          <section className="center">
            <div className="center-head"><div><div className="kicker">DIGITAL AUDIO / DECK 01</div><h1>MY MUSIC</h1></div><div className="badge">{playing?'● PLAYING':'Ⅱ PAUSED'}</div></div>
            <div className="sticker s1">HI-FI<br/><small>2003</small></div><div className="sticker s2">DIGITAL<br/>LOVE</div>
            <div className="turntable">
              <div className="orbit orbit1"/><div className="orbit orbit2"/>
              <div className="vinyl" style={{animationPlayState:playing?'running':'paused'}}>
                <div className="record-shine"/><div className="label" style={{background:`linear-gradient(145deg,${palette[0]},${palette[2]})`}}><div className="label-inner"><strong>{track[4]}</strong><small>Y2K PLAYER / SIDE A</small></div></div><div className="spindle"/>
              </div>
              <div className="deck-caption"><span>◉ 12" DIGITAL VINYL</span><span>RPM 33⅓</span></div>
            </div>
            <div className="deck-controls"><button className={shuffle?'lit':''} onClick={()=>setShuffle(!shuffle)}><Shuffle size={15}/></button><button onClick={()=>stepTrack(-1)}><SkipBack size={18}/></button><button className="deck-play" onClick={()=>setPlaying(!playing)}>{playing?<Pause size={22}/>:<Play size={22}/>}</button><button onClick={()=>stepTrack(1)}><SkipForward size={18}/></button><button className={repeat?'lit':''} onClick={()=>setRepeat(!repeat)}><Repeat2 size={15}/></button></div>
          </section>

          <aside className="now">
            <div className="panel-title"><span>NOW PLAYING</span><span>● {track[0]}</span></div>
            <div className="cover" style={{background:`linear-gradient(135deg,${palette[0]},${palette[1]} 48%,${palette[2]})`}}><div className="cover-grid"/><div className="cover-art">{track[4]}<small>2003 / Y2KP</small></div><div className="cover-star">★</div></div>
            <div className="track-name">{track[1]}</div><div className="artist">{track[2].toUpperCase()} / {track[4]}</div>
            <div className="progress"><input aria-label="Track progress" type="range" min="0" max="242" value={time} onChange={e=>setTime(Number(e.target.value))}/><div className="times"><span>{fmt(time)}</span><span>04:02</span></div></div>
            <div className="controls"><button className="control" onClick={()=>stepTrack(-1)}><SkipBack/></button><button className="control main" onClick={()=>setPlaying(!playing)}>{playing?<Pause/>:<Play/>}</button><button className="control" onClick={()=>stepTrack(1)}><SkipForward/></button></div>
            <div className="volume"><Volume2 size={14}/><input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><span>{volume}%</span></div>
            <div className="eq">{Array.from({length:12},(_,i)=><i key={i}/>)}</div>
          </aside>
        </section>

        <footer className="footer"><div className="footer-label">UP NEXT</div>{tracks.map(([n,title,artist,duration],i)=><button className={`track-card ${i===selected?'active':''}`} onClick={()=>selectTrack(i)} key={n}><div className="mini" style={{background:`linear-gradient(135deg,${palettes[i][0]},${palettes[i][1]})`}}/><div><b>{n} / {title}</b><span>{artist} · {duration}</span></div></button>)}</footer>
      </div>
    </main>
  );
}
