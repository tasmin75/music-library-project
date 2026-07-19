import { lazy, Suspense, useEffect } from "react";
import PropTypes from "prop-types";
import RemoteErrorBoundary from "./RemoteErrorBoundary";

const REMOTE_ORIGIN = import.meta.env.VITE_REMOTE_URL || "http://localhost:5175";

// Module Federation shares JS modules across the boundary, but it doesn't
// share CSS injection — the remote's Tailwind build only exists in the
// remote's own bundle. So the host fetches the remote's stylesheet
// directly, the same way it would link any third-party CSS.
function useRemoteStylesheet() {
  useEffect(() => {
    const existing = document.querySelector('link[data-remote="music-library"]');
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${REMOTE_ORIGIN}/style.css`;
    link.dataset.remote = "music-library";
    document.head.appendChild(link);
  }, []);
}

const RemoteMusicLibrary = lazy(() => import("music_library/MusicLibrary"));

export default function RemoteLibrary({ role }) {
  useRemoteStylesheet();

  return (
    <RemoteErrorBoundary>
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-deck-muted font-mono uppercase tracking-widest2">
            Loading music library…
          </div>
        }
      >
        <RemoteMusicLibrary role={role} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}

RemoteLibrary.propTypes = {
  role: PropTypes.oneOf(["admin", "user"]).isRequired,
};
