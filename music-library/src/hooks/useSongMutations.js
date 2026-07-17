import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSong, updateSong, deleteSong } from "../api/songsApi";

/**
 * Why cache-write instead of invalidate-and-refetch: refetching would
 * re-hit the iTunes API for a change that has nothing to do with iTunes,
 * and it would briefly lose the local song the user just added while the
 * network round-trips. Writing the server's response straight into every
 * matching ["songs", term] cache entry is instant and still correct,
 * since the server (MSW) is the source of truth for the shape of the row.
 */
export function useAddSongMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSong,
    onSuccess: (savedSong) => {
      const cache = queryClient.getQueryCache();
      cache.findAll({ queryKey: ["songs"] }).forEach((query) => {
        queryClient.setQueryData(query.queryKey, (existing) =>
          existing ? [savedSong, ...existing] : [savedSong]
        );
      });
    },
  });
}

export function useUpdateSongMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }) => updateSong(id, values),
    onSuccess: (savedSong) => {
      const cache = queryClient.getQueryCache();
      cache.findAll({ queryKey: ["songs"] }).forEach((query) => {
        queryClient.setQueryData(query.queryKey, (existing) =>
          existing
            ? existing.map((song) => (song.id === savedSong.id ? savedSong : song))
            : existing
        );
      });
    },
  });
}

export function useDeleteSongMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSong,
    onSuccess: (_result, deletedId) => {
      const cache = queryClient.getQueryCache();
      cache.findAll({ queryKey: ["songs"] }).forEach((query) => {
        queryClient.setQueryData(query.queryKey, (existing) =>
          existing ? existing.filter((song) => song.id !== deletedId) : existing
        );
      });
    },
  });
}
