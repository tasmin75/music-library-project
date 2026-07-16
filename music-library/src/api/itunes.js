const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";

/**
 * The iTunes Search API doesn't return the field names our UI wants
 * (trackName, artistName, collectionName, releaseDate, ...). We map
 * everything to a flat shape once, right here at the fetch boundary,
 * so the rest of the app never has to think about iTunes' JSON at all.
 */
function toSong(raw) {
  return {
    id: String(raw.trackId ?? `${raw.artistId}-${raw.collectionId}-${raw.trackName}`),
    title: raw.trackName ?? "Untitled",
    artist: raw.artistName ?? "Unknown artist",
    album: raw.collectionName ?? "Unknown album",
    year: raw.releaseDate ? new Date(raw.releaseDate).getFullYear() : null,
    artwork: raw.artworkUrl100 ?? null,
    genre: raw.primaryGenreName ?? "Unclassified",
    durationMs: raw.trackTimeMillis ?? null,
    previewUrl: raw.previewUrl ?? null,
    source: "itunes",
  };
}

/**
 * Fetches songs from the iTunes Search API for a given term.
 * Throws on non-2xx responses so React Query's error state has
 * something real to catch, rather than us swallowing failures here.
 */
export async function fetchSongs(term) {
  const url = `${ITUNES_SEARCH_URL}?term=${encodeURIComponent(term)}&entity=song&limit=50`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`iTunes search failed with status ${response.status}`);
  }

  const data = await response.json();
  return (data.results ?? []).map(toSong);
}
