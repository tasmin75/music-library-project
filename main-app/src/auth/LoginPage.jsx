import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login({ username, password });
    if (!result.ok) setError(result.message);
  };

  const fillDemo = (role) => {
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("listener");
      setPassword("listener123");
    }
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-xs uppercase tracking-widest2 text-deck-amber mb-2">
            Now Playing
          </p>
          <h1 className="font-display text-3xl text-deck-cream">Music Library</h1>
          <p className="text-sm text-deck-muted mt-1">Sign in to spin the catalog</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-deck-line bg-deck-panel rounded-sm p-6">
          <label className="block mb-4">
            <span className="block text-xs uppercase tracking-widest2 text-deck-muted mb-1.5">
              Username
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="field-input"
              autoComplete="username"
            />
          </label>

          <label className="block mb-2">
            <span className="block text-xs uppercase tracking-widest2 text-deck-muted mb-1.5">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field-input"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="text-xs text-deck-rec mt-2">{error}</p>}

          <button
            type="submit"
            className="mt-5 w-full rounded-sm bg-deck-amber px-4 py-2 text-xs uppercase tracking-widest2 text-deck-bg font-medium hover:bg-deck-amber/90 transition-colors"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <span className="text-deck-muted">Demo accounts:</span>
          <button
            type="button"
            onClick={() => fillDemo("admin")}
            className="text-deck-amber hover:underline"
          >
            admin
          </button>
          <span className="text-deck-muted">/</span>
          <button
            type="button"
            onClick={() => fillDemo("user")}
            className="text-deck-amber hover:underline"
          >
            listener
          </button>
        </div>
      </div>
    </div>
  );
}
