import { useQuery } from "@tanstack/react-query";
import { fetchSongs } from "../api/itunes";

/**
 * Everything components need to know about "give me the song list" lives
 * here. Components ask for songs; they don't know or care that it's a
 * React Query useQuery under the hood, or that the source is iTunes.
 */
export function useSongsQuery(term) {
  return useQuery({
    queryKey: ["songs", term],
    queryFn: () => fetchSongs(term),
    enabled: term.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
