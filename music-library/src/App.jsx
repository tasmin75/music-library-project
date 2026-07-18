import { useState } from "react";
import MusicLibrary from "./MusicLibrary";

/**
 * When this app is opened directly (its own deployed URL, or `npm run dev`
 * inside this folder) there's no host app around to hand it a role, so we
 * stand in with a lightweight switcher. When it's loaded through Module
 * Federation inside main-app instead, this file is never used — the host
 * imports MusicLibrary.jsx directly and passes the real role down.
 */
export default function App() {
  const [role, setRole] = useState("admin");

  return (
    <div className="min-h-screen">
      <div className="border-b border-deck-line bg-deck-panel/60">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest2 text-deck-muted">
            Standalone remote preview
          </p>
          <div className="flex gap-1 text-xs">
            {["admin", "user"].map((option) => (
              <button
                key={option}
                onClick={() => setRole(option)}
                className={`px-2 py-1 rounded-sm uppercase tracking-widest2 text-[10px] transition-colors ${
                  role === option
                    ? "bg-deck-amber text-deck-bg"
                    : "text-deck-muted hover:text-deck-cream"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      <MusicLibrary role={role} />
    </div>
  );
}
