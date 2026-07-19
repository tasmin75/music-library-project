import { QueryClient } from "@tanstack/react-query";

// Separate cache from the remote's own QueryClient — the host has
// nothing to query itself right now, but wraps the tree in a provider
// anyway so any host-level data needs (user profile, notifications,
// whatever comes next) have somewhere to live without re-plumbing.
export const queryClient = new QueryClient();
