import { createContext, useContext } from "react";

/**
 * Module Federation shares nothing between host and remote except the
 * modules explicitly exposed/consumed — there's no shared React context
 * across the boundary, and localStorage isn't reliable either once the
 * two apps are deployed to different origins (Netlify/Vercel give each
 * its own domain). So auth state crosses the boundary the one way that
 * always works: as a plain prop on the exposed component. This context
 * just saves us from threading that prop through every child.
 */
const RoleContext = createContext("user");

export function RoleProvider({ role, children }) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export function useCanManageSongs() {
  const role = useRole();
  return role === "admin";
}
