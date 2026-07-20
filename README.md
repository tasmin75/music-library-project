# Music Library

A micro-frontend music library: browse the iTunes Search catalog, filter/sort/group it client-side, and add, edit, or remove your own tracks on top of it — all gated behind a simple role-based login.

Two apps live in this repo:

- **`main-app`** — the host/container. Owns login and session state, and loads the library UI at runtime.
- **`music-library`** — the actual music library UI. Built and deployed independently, then pulled into `main-app` at runtime via Webpack Module Federation (via Vite's federation plugin).

## Live demos

- Main app: _add your deployed URL here_
- Music Library (standalone): _add your deployed URL here_

## Demo credentials

| Username   | Password      | Role  | Can do                                  |
|------------|---------------|-------|------------------------------------------|
| `admin`    | `admin123`    | admin | View, filter/sort/group, add, edit, and remove tracks added this session |
| `listener` | `listener123` | user  | View, filter/sort/group only            |

These are hardcoded in `main-app/src/auth/AuthContext.jsx` — there's no real backend behind them, per the brief.

## Running locally

Requires Node 18+ (tested on 20.17 and 22). You need both apps running, in this order (the host needs the remote's build to exist before it can load it).

**1. Build and serve the remote first:**

```bash
cd music-library
npm install
npm run build
npm run preview   # serves dist/ on http://localhost:5175
```

Leave that running. `npm run dev` alone is *not* enough here — Module Federation with this plugin resolves the remote's built `remoteEntry.js`, not its dev server, so the remote needs an actual build.

**2. In a second terminal, run the host:**

```bash
cd main-app
npm install
cp .env.example .env   # already points at http://localhost:5175, the default
npm run dev            # http://localhost:5173
```

Open `http://localhost:5173`, sign in with either demo account above, and the library loads from the remote you started in step 1.

**Want to see the music library on its own**, with no login at all? `cd music-library && npm run dev` runs it standalone with a small admin/user toggle in place of a real host — that's what `src/App.jsx` in that folder is for.

## Tests

Both apps have a `test` script (`npm test` in either folder, powered by Vitest):

- `music-library`: `songUtils.test.js` covers the filter/sort/group-by logic; `songsStore.test.js` covers the mock backend's create/update/delete behavior directly, including the 404-on-an-id-it-doesn't-own case.
- `main-app`: `mockJwt.test.js` covers token issuing, decoding, and expiry.

These aren't exhaustive (no component-level or end-to-end tests), but they cover the parts of the logic that are easiest to get subtly wrong and hardest to catch just by clicking through the UI.

## Troubleshooting

**`Cannot find native binding` / `@rolldown/binding-*` error on `npm install` or `npm run build`.**
This is an upstream npm bug ([npm/cli#4828](https://github.com/npm/cli/issues/4828)) with optional platform-specific dependencies, most common on Windows. Both apps pin Vite to the 5.x line specifically to avoid it — if you still hit it, you're likely on a stale install from before that pin. Fix:
```bash
rm -rf node_modules package-lock.json
npm install
```
in whichever folder it happens in.

## Deployment

Both apps deploy as static sites (Netlify, Vercel, or GitHub Pages all work — `netlify.toml` is included in both folders).

1. Deploy `music-library` first. Note its origin (e.g. `https://music-library-xyz.netlify.app`).
2. Set `VITE_REMOTE_URL` to that origin in `main-app`'s build environment variables, then deploy `main-app`.

`VITE_REMOTE_URL` is read at **build time**, not runtime — if the remote's URL changes, the host needs a rebuild, not just a config edit. That's a deliberate simplification over a fully dynamic remote-loading setup (see Tradeoffs below).

Both `netlify.toml` files add `Access-Control-Allow-Origin: *` on `remoteEntry.js` and `style.css` — Module Federation across two different domains needs both to be fetchable cross-origin.

## How the micro frontend works

`music-library` exposes one component, `./MusicLibrary`, from `src/MusicLibrary.jsx`, via `@originjs/vite-plugin-federation`. `main-app` lazy-loads it:

```js
const RemoteMusicLibrary = lazy(() => import("music_library/MusicLibrary"));
```

wrapped in a `Suspense` boundary (loading state) and a class-based error boundary (in case the remote is unreachable — down, redeploying, or a stale/wrong URL). `react` and `react-dom` are marked as shared singletons in both Vite configs so the host and remote don't ship or run two separate React copies.

The exposed component carries its own `QueryClientProvider` and starts its own MSW worker on mount, so it works correctly whether it's mounted inside the host or run completely standalone — it doesn't assume the host has set either of those up for it.

**CSS is the one thing Module Federation doesn't share.** It shares JS modules; it has no equivalent for "also inject this stylesheet." So `music-library`'s Vite config disables CSS code-splitting and pins the output filename to `style.css`, and the host fetches `${VITE_REMOTE_URL}/style.css` directly and appends it as a `<link>` tag the first time the remote mounts (`main-app/src/components/RemoteLibrary.jsx`).

## How the role-based auth works

Login lives entirely in `main-app`. On sign-in, it issues an unsigned, base64url-encoded, JWT-*shaped* token (header.payload.signature — no real cryptographic signature, since the brief explicitly asks for an in-memory approach rather than a real backend) with `sub`, `role`, and an 8-hour `exp`. It's stored in `localStorage` and decoded back into a session on reload; an expired or malformed token is treated as no session.

The decoded `role` is passed straight into the remote as a prop: `<RemoteMusicLibrary role={session.role} />`. Inside `music-library`, `RoleContext` picks that prop up so components deeper in the tree (the "Add track" button, and the edit/delete controls on each row) can call `useCanManageSongs()` instead of drilling `role` through every layer by hand.

Passing `role` as a prop, rather than trying to share `localStorage` or a React context across the federation boundary, is intentional: once the two apps are deployed to different domains, `localStorage` isn't shared between them anyway, and Module Federation doesn't share React context across separately-mounted component trees. A prop is the one channel that's guaranteed to work regardless of where each app ends up deployed.

## Reads vs. writes

- **Reads** go straight to the real iTunes Search API (`https://itunes.apple.com/search`), through `useSongsQuery` (wraps `useQuery`, never called directly in a component). The raw iTunes fields (`trackName`, `artistName`, `collectionName`, `releaseDate`, …) are mapped to a flat `{ title, artist, album, year, … }` shape in `src/api/itunes.js`, right at the fetch boundary, so nothing downstream has to know or care what iTunes' JSON actually looks like.
- **Writes** (`POST /songs`, `PUT /songs/:id`, `DELETE /songs/:id`) are intercepted by MSW in the browser. The actual logic lives in `src/mocks/songsStore.js` — a small in-memory table plus create/update/delete functions — and `src/mocks/handlers.js` is a thin layer translating HTTP requests into calls to that store. They're kept separate deliberately: `songsStore.js` is unit-tested directly (`src/mocks/songsStore.test.js`), with no HTTP mocking involved in the test itself.

  Edit and delete only ever apply to tracks added this session (`source: "local"` — see the "Added" badge on each row). That's intentional, not a missing feature: iTunes is a read-only reference catalog, so there's no real notion of "editing" or "deleting" a track from it, and the mock store only ever held records for what it created. Trying to edit or delete an iTunes-sourced id returns a 404 from the store, same as it would from a real backend that never owned that row.

  `useAddSongMutation`, `useUpdateSongMutation`, and `useDeleteSongMutation` all wrap `useMutation` and, on success, write the server's response straight into every matching `["songs", term]` cache entry rather than invalidating and refetching. Refetching would re-hit iTunes for a change that has nothing to do with iTunes, and would briefly drop the just-changed song mid-refetch — writing the result into the cache directly is both faster and avoids that flash.

Filtering, sorting, and grouping (`src/utils/songUtils.js`) all run client-side on top of whatever's already in the cache, using `filter`/`sort`/`reduce`/`map` — no table library.

## Tradeoffs, and what I'd improve with more time

- **Build-time remote URL.** `VITE_REMOTE_URL` gets baked into the host at build time. A fully dynamic setup (resolving the remote's URL from a runtime-injected global, so the host never needs a rebuild when the remote moves) is possible with this federation plugin but adds a layer of indirection that felt like the wrong tradeoff for a project this size — I'd revisit it if this were a real multi-team setup where the host and remote deploy on independent schedules.
- **CSS delivery via a manually-linked stylesheet** works but is more fragile than true style isolation (e.g. Shadow DOM, or CSS Modules with a scoped prefix) would be. For a single micro-frontend it's a reasonable tradeoff; with two or more remotes sharing a host, I'd want a naming convention or scoping strategy to avoid class collisions.
- **In-memory writes reset on refresh.** Songs you add don't survive a page reload, since MSW's "table" lives in a JS variable, not real storage. Swapping the mock for a tiny real backend (or persisting the mock's state to `localStorage`) would be the natural next step and wouldn't require touching any component — only `src/api/songsApi.js` and the mock handlers.
- **Two independent `QueryClient` instances** (host and remote each own one). They never need to share cached data today, but if the host ever needs to read song data itself, that'd need to change to a shared client passed down, or a different data-sharing approach across the federation boundary.
- **Test coverage is logic-level, not component- or end-to-end-level.** The filter/sort/group utilities and the mock backend's create/update/delete behavior are unit-tested directly, which is where the subtlest bugs tend to hide. There's no React Testing Library or Playwright coverage of the actual rendered UI yet — with more time, that's the next layer I'd add, particularly around the role-gating (does an admin really see the edit/delete controls a listener doesn't?).
