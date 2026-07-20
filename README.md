# Music Library

A micro-frontend music library: browse the iTunes Search catalog, filter/sort/group it client-side, and add, edit, or remove your own tracks on top of it — all gated behind a simple role-based login.

Two apps live in this repo:

- **`main-app`** — the host/container. Owns login and session state, and loads the library UI at runtime.
- **`music-library`** — the actual music library UI. Built and deployed independently, then pulled into `main-app` at runtime via Webpack Module Federation (via Vite's federation plugin).

## Live demos

- Main app: https://agent-6a5dc1c1add1946--music-library-application.netlify.app
- Music Library (standalone): https://agent-6a5dc1c1add1946--music-library-application.netlify.app

## Demo credentials

| Username   | Password      | Role  | Can do                                  |
|------------|---------------|-------|------------------------------------------|
| `admin`    | `admin123`    | admin | View, filter/sort/group, add, edit, and remove tracks added this session |
| `listener` | `listener123` | user  | View, filter/sort/group only            |


## Running locally

Requires Node 18+ (tested on 20.17 and 22). You need both apps running, in this order (the host needs the remote's build to exist before it can load it).

**1. Build and serve the remote first:**

```bash
cd music-library
npm install
npm run build
npm run preview  
```

Leave that running. `npm run dev` alone is *not* enough here — Module Federation with this plugin resolves the remote's built `remoteEntry.js`, not its dev server, so the remote needs an actual build.

**2. In a second terminal, run the host:**

```bash
cd main-app
npm install
cp .env.example .env  
npm run dev            # http://localhost:5173
```

Open `http://localhost:5173`, sign in with either demo account above, and the library loads from the remote you started in step 1.

**Want to see the music library on its own**, with no login at all? `cd music-library && npm run dev` runs it standalone with a small admin/user toggle in place of a real host — that's what `src/App.jsx` in that folder is for.

## Tests

Both apps have a `test` script (`npm test` in either folder, powered by Vitest):

- `music-library`: `songUtils.test.js` covers the filter/sort/group-by logic; `songsStore.test.js` covers the mock backend's create/update/delete behavior directly, including the 404-on-an-id-it-doesn't-own case.
- `main-app`: `mockJwt.test.js` covers token issuing, decoding, and expiry.
