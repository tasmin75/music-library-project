/**
 * All of this runs client-side, on top of whatever React Query already
 * fetched and cached — it's a view over the data, not a replacement for
 * fetching it. Deliberately built with map/filter/reduce rather than a
 * table/grid library, per the assignment brief.
 */

const FIELD_ACCESSORS = {
  title: (song) => song.title,
  artist: (song) => song.artist,
  album: (song) => song.album,
};

export function filterSongs(songs, searchText) {
  const needle = searchText.trim().toLowerCase();
  if (!needle) return songs;

  return songs.filter((song) =>
    [song.title, song.artist, song.album]
      .join(" ")
      .toLowerCase()
      .includes(needle)
  );
}

export function sortSongs(songs, field, direction) {
  const accessor = FIELD_ACCESSORS[field];
  if (!accessor) return songs;

  // .sort() mutates in place, so we work on a copy — the cache the hook
  // handed us should stay untouched.
  const sorted = [...songs].sort((a, b) =>
    accessor(a).localeCompare(accessor(b), undefined, { sensitivity: "base" })
  );

  return direction === "desc" ? sorted.reverse() : sorted;
}

/**
 * Buckets songs by the chosen field into an ordered array of
 * { key, songs } groups, alphabetised by group key. Using reduce to
 * build the lookup, then map to shape it for rendering.
 */
export function groupSongs(songs, field) {
  if (!field) return null;
  const accessor = FIELD_ACCESSORS[field];

  const buckets = songs.reduce((acc, song) => {
    const key = accessor(song) || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(song);
    return acc;
  }, {});

  return Object.keys(buckets)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((key) => ({ key, songs: buckets[key] }));
}

export function countBySource(songs) {
  return songs.reduce(
    (acc, song) => {
      acc[song.source] = (acc[song.source] || 0) + 1;
      return acc;
    },
    { itunes: 0, local: 0 }
  );
}
