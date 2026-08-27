import type { Metadata } from 'next';
import './globals.css';
import './spotify.css';
import SpotifyPlayback from '@/components/SpotifyPlayback';

export const metadata: Metadata = {
  title: 'Y2K PLAYER',
  description: 'A futuristic music player from an alternate 2003.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SpotifyPlayback />{children}</body></html>;
}
