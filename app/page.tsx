'use client';

import { useEffect, useState } from 'react';

const tracks = [
  ['01', 'Toxic', 'Britney Spears', '03:19'],
  ['02', 'Promiscuous', 'Nelly Furtado', '04:02'],
  ['03', 'Hollaback Girl', 'Gwen Stefani', '03:19'],
  ['04', 'Maneater', 'Nelly Furtado', '04:18'],
  ['05', 'Yeah!', 'Usher', '04:10'],
];

export default function Home() {
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(134);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((t) => (t >= 242 ? 0 : t + 1)), 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const clock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const fmt = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <main className="shell">
      <div className="window">
        <header className="topbar">
          <div className="logo">Y2K <span>PLAYER</span></div>
          <div className="status"><span><i className="status-dot" /> SPOTIFY ONLINE</span><span className="clock">{clock}</span></div>
        </header>

        <section className="body">
          <aside className="sidebar">
            <div className="side-label">LIBRARY</div>
            <nav className="nav">
              {['HOME', 'LIKED SONGS', 'PLAYLISTS', 'ALBUMS', 'ARTISTS'].map((item, i) => <button className={i === 0 ? 'active' : ''} key={item}>{i === 0 ? '▸ ' : '□ '}{item}</button>)}
            </nav>
            <div className="side-label">DISCOVER</div>
            <nav className="nav">
              <button>⌕ SEARCH</button><button>✦ BROWSE</button>
            </nav>
            <div className="system"><p>Y2KP-03 // REV 2.0</p><p>HI-FI DIGITAL AUDIO</p><p>● SYSTEM READY</p></div>
          </aside>

          <section className="center">
            <div className="center-head"><div><div className="kicker">DIGITAL AUDIO / DECK 01</div><h1>MY MUSIC</h1></div><div className="badge">PLAYING</div></div>
            <div className="turntable">
              <div className="vinyl" style={{ animationPlayState: playing ? 'running' : 'paused' }}>
                <div className="label"><div className="label-inner"><strong>Y2K</strong><small>PLAYER // 2003</small></div></div>
                <div className="spindle" />
              </div>
            </div>
          </section>

          <aside className="now">
            <div className="panel-title"><span>NOW PLAYING</span><span>● 01</span></div>
            <div className="cover"><div className="cover-art">Y2K<br/>MIX</div></div>
            <div className="track-name">Promiscuous</div>
            <div className="artist">NELLY FURTADO / LOOSE</div>
            <div className="progress"><div className="progress-line"><div className="progress-fill" style={{ width: `${(time / 242) * 100}%` }} /></div><div className="times"><span>{fmt(time)}</span><span>04:02</span></div></div>
            <div className="controls"><button className="control">◀</button><button className="control main" onClick={() => setPlaying((p) => !p)}>{playing ? 'Ⅱ' : '▶'}</button><button className="control">▶</button></div>
            <div className="eq">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
          </aside>
        </section>

        <footer className="footer">
          {tracks.map(([n, title, artist, duration], i) => <div className={`track-card ${i === 1 ? 'active' : ''}`} key={n}><div className="mini" /><div><b>{n} / {title}</b><span>{artist} · {duration}</span></div></div>)}
        </footer>
      </div>
    </main>
  );
}
