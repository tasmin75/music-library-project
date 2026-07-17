/**
 * These calls hit /songs and /songs/:id, which don't exist as real
 * infrastructure anywhere — MSW intercepts them in the browser and
 * treats them as a small in-memory table (see src/mocks/handlers.js).
 * The point isn't the backend, it's that the app talks to it the same
 * way it would talk to a real one: real fetch, real status codes,
 * real JSON bodies, real async round-trip.
 */

export async function createSong(song) {
  const response = await fetch("/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Could not add this song. Try again.");
  }

  return response.json();
}

export async function updateSong(id, song) {
  const response = await fetch(`/songs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Could not save these changes. Try again.");
  }

  return response.json();
}

export async function deleteSong(id) {
  const response = await fetch(`/songs/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Could not remove this song. Try again.");
  }

  return response.json();
}
