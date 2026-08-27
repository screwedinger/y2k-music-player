# Spotify setup

The player uses Spotify's Authorization Code with PKCE flow, which is the recommended browser flow because no client secret is stored in the app.

## 1. Create a Spotify app

Open the Spotify Developer Dashboard and create an app. Copy its **Client ID**.

## 2. Configure the redirect URI

For local development, add:

`http://127.0.0.1:3000/`

The redirect URI in the Spotify dashboard must exactly match the URI used by the app.

For production, use your HTTPS deployment URL, for example:

`https://your-domain.example/`

Then set `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` to that exact value.

## 3. Add environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/
```

Never put a Spotify client secret in a `NEXT_PUBLIC_*` variable.

## 4. Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000/` and press **CONNECT SPOTIFY**.

The current Phase 3 integration requests access for:

- profile information
- private/collaborative playlists
- liked/saved tracks
- recently played tracks
- playback state and controls
- streaming/Web Playback permissions

The interface falls back to the built-in Y2K demo library when Spotify is not configured.
