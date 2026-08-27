const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';

export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-read-recently-played',
].join(' ');

const clientId = () => process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? '';
const redirectUri = () => process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || `${window.location.origin}/`;

function randomString(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, value => chars[value % chars.length]).join('');
}

async function sha256(value: string) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
}

function base64Url(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function isSpotifyConfigured() {
  return Boolean(clientId());
}

export async function beginSpotifyLogin() {
  if (!clientId()) throw new Error('Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID');
  const verifier = randomString();
  const state = randomString(32);
  const challenge = base64Url(await sha256(verifier));
  localStorage.setItem('spotify_code_verifier', verifier);
  localStorage.setItem('spotify_auth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId(),
    scope: SPOTIFY_SCOPES,
    redirect_uri: redirectUri(),
    state,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });
  window.location.assign(`${AUTH_URL}?${params.toString()}`);
}

export async function finishSpotifyLogin(code: string, state: string) {
  const savedState = localStorage.getItem('spotify_auth_state');
  const verifier = localStorage.getItem('spotify_code_verifier');
  if (!savedState || savedState !== state) throw new Error('Spotify authentication state mismatch. Please try again.');
  if (!verifier) throw new Error('Missing PKCE verifier. Please start Spotify login again.');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId(), grant_type: 'authorization_code', code,
      redirect_uri: redirectUri(), code_verifier: verifier,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Spotify token exchange failed.');
  storeTokens(data);
  localStorage.removeItem('spotify_code_verifier');
  localStorage.removeItem('spotify_auth_state');
  return data;
}

function storeTokens(data: { access_token: string; refresh_token?: string; expires_in: number }) {
  localStorage.setItem('spotify_access_token', data.access_token);
  if (data.refresh_token) localStorage.setItem('spotify_refresh_token', data.refresh_token);
  localStorage.setItem('spotify_expires_at', String(Date.now() + data.expires_in * 1000));
}

export function getAccessToken() { return localStorage.getItem('spotify_access_token'); }
export function logoutSpotify() {
  ['spotify_access_token','spotify_refresh_token','spotify_expires_at','spotify_code_verifier','spotify_auth_state'].forEach(k => localStorage.removeItem(k));
}

async function refreshToken() {
  const refresh = localStorage.getItem('spotify_refresh_token');
  if (!refresh) return null;
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh, client_id: clientId() }),
  });
  const data = await response.json();
  if (!response.ok) { logoutSpotify(); return null; }
  storeTokens(data);
  return data.access_token as string;
}

export async function spotifyFetch<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  let token = getAccessToken();
  const expiresAt = Number(localStorage.getItem('spotify_expires_at') || 0);
  if (!token || expiresAt < Date.now() + 30000) token = await refreshToken();
  if (!token) throw new Error('Spotify login required.');

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  if (response.status === 401 && retry) {
    token = await refreshToken();
    if (token) return spotifyFetch<T>(path, init, false);
  }
  if (!response.ok) {
    let message = `Spotify API error (${response.status})`;
    try { const data = await response.json(); message = data?.error?.message || message; } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function playSpotifyUri(uri: string, deviceId: string) {
  return spotifyFetch<void>('/me/player/play', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_ids: [deviceId], uris: [uri] }) });
}
export async function pauseSpotify() { return spotifyFetch<void>('/me/player/pause', { method: 'PUT' }); }
export async function resumeSpotify() { return spotifyFetch<void>('/me/player/play', { method: 'PUT' }); }
export async function nextSpotify() { return spotifyFetch<void>('/me/player/next', { method: 'POST' }); }
export async function previousSpotify() { return spotifyFetch<void>('/me/player/previous', { method: 'POST' }); }
export async function setSpotifyVolume(value: number, deviceId: string) { return spotifyFetch<void>(`/me/player/volume?volume_percent=${Math.round(value)}&device_id=${encodeURIComponent(deviceId)}`, { method: 'PUT' }); }
