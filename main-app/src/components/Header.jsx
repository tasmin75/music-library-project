import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { session, logout } = useAuth();

  return (
    <header className="border-b border-deck-line">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="font-display text-sm text-deck-cream">Music Library</p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-deck-muted">
            {session.username}
            <span
              className={`ml-2 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-widest2 ${
                session.role === "admin"
                  ? "border border-deck-amber/60 text-deck-amber"
                  : "border border-deck-line text-deck-muted"
              }`}
            >
              {session.role}
            </span>
          </span>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-widest2 text-deck-muted hover:text-deck-rec transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
