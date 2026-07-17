/**
 * The actual "database" logic, kept separate from handlers.js on purpose:
 * handlers.js's only job is translating HTTP requests/responses into calls
 * to this module. Keeping them apart means this logic can be unit tested
 * directly — call a function, check a return value — with no HTTP mocking
 * layer in the way at all.
 */

let addedSongs = [];
let nextId = 1;

// Exists only for tests, so each test file starts from a known-empty state
// instead of depending on the order other tests ran in.
export function resetStore() {
  addedSongs = [];
  nextId = 1;
}

function validateSongInput(input) {
  if (!input?.title || !input?.artist) {
    return "Title and artist are required.";
  }
  return null;
}

export function createSong(input) {
  const error = validateSongInput(input);
  if (error) return { status: 400, body: { message: error } };

  const song = {
    id: `local-${nextId++}`,
    title: input.title,
    artist: input.artist,
    album: input.album || "Unreleased",
    year: input.year ? Number(input.year) : null,
    artwork: null,
    genre: input.genre || "Unclassified",
    durationMs: null,
    previewUrl: null,
    source: "local",
  };

  addedSongs = [song, ...addedSongs];
  return { status: 201, body: song };
}

export function updateSong(id, input) {
  const error = validateSongInput(input);
  if (error) return { status: 400, body: { message: error } };

  const existingIndex = addedSongs.findIndex((song) => song.id === id);
  if (existingIndex === -1) {
    return {
      status: 404,
      body: { message: "This track isn't one this session added, so there's nothing to edit." },
    };
  }

  const updated = {
    ...addedSongs[existingIndex],
    title: input.title,
    artist: input.artist,
    album: input.album || "Unreleased",
    year: input.year ? Number(input.year) : null,
    genre: input.genre || "Unclassified",
  };

  addedSongs = addedSongs.map((song, index) => (index === existingIndex ? updated : song));
  return { status: 200, body: updated };
}

export function deleteSong(id) {
  const existed = addedSongs.some((song) => song.id === id);
  if (!existed) {
    return {
      status: 404,
      body: { message: "This track isn't one this session added, so there's nothing to delete." },
    };
  }

  addedSongs = addedSongs.filter((song) => song.id !== id);
  return { status: 200, body: { id, deleted: true } };
}
