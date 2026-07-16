import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// This app plays two roles:
// 1. Standalone SPA — `npm run dev` / `npm run build` here serves it on
//    its own, which is what "Live Demo Link: Music Library" points to.
// 2. Federated remote — main-app loads the built remoteEntry.js and
//    pulls in "./MusicLibrary" at runtime, on demand.
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "music_library",
      filename: "remoteEntry.js",
      exposes: {
        "./MusicLibrary": "./src/MusicLibrary.jsx",
      },
      shared: ["react", "react-dom", "@tanstack/react-query"],
    }),
  ],
  build: {
    target: "esnext",
    // Federation needs a predictable, unhashed remoteEntry.js — vite's
    // default build already does this. We additionally disable CSS code
    // splitting and pin the stylesheet filename so the host can link to
    // it directly (Module Federation shares JS modules, not CSS
    // injection, so the host has to load the remote's stylesheet itself).
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === "style.css" ? "style.css" : "assets/[name]-[hash][extname]",
      },
    },
  },
  server: {
    port: 5175,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5175,
    strictPort: true,
    cors: true,
  },
});
