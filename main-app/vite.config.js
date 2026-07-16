import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// VITE_REMOTE_URL points at wherever the music-library remote is served
// from — http://localhost:5175 while developing locally (see that app's
// README for how to run it), or its deployed Netlify/Vercel URL in
// production. It's read at build time, so a change to it means rebuilding
// the host, not just editing a runtime config file.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const remoteUrl = env.VITE_REMOTE_URL || "http://localhost:5175";

  return {
    plugins: [
      react(),
      federation({
        name: "main_app",
        remotes: {
          music_library: `${remoteUrl}/assets/remoteEntry.js`,
        },
        shared: ["react", "react-dom", "@tanstack/react-query"],
      }),
    ],
    build: {
      target: "esnext",
    },
    server: {
      port: 5173,
    },
    preview: {
      port: 5173,
    },
  };
});
