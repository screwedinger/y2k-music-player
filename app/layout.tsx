import type { Metadata } from 'next';
import './globals.css';
import './spotify.css';

export const metadata: Metadata = {
  title: 'Y2K PLAYER',
  description: 'A futuristic music player from an alternate 2003.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
