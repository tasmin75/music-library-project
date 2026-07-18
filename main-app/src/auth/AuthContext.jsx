import { createContext, useContext, useState } from "react";
import { issueMockToken, decodeMockToken } from "./mockJwt";

/**
 * Two demo accounts, per the brief: one admin, one plain user. These are
 * intentionally hardcoded — there's no real backend to check credentials
 * against, and the README documents both for the reviewer.
 */
const DEMO_ACCOUNTS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "listener", password: "listener123", role: "user" },
];

const STORAGE_KEY = "music-library-session-token";
const AuthContext = createContext(null);

function readStoredSession() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return null;

  const payload = decodeMockToken(token);
  if (!payload) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return { token, username: payload.sub, role: payload.role };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const login = ({ username, password }) => {
    const account = DEMO_ACCOUNTS.find(
      (candidate) => candidate.username === username && candidate.password === password
    );

    if (!account) {
      return { ok: false, message: "That username and password don't match a demo account." };
    }

    const token = issueMockToken({ username: account.username, role: account.role });
    localStorage.setItem(STORAGE_KEY, token);
    setSession({ token, username: account.username, role: account.role });
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be called within an AuthProvider");
  }
  return context;
}
