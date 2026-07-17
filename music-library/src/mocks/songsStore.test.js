import { describe, it, expect, beforeEach } from "vitest";
import { resetStore, createSong, updateSong, deleteSong } from "./songsStore";

beforeEach(() => {
  resetStore();
});

describe("createSong", () => {
  it("rejects a song with no title", () => {
    const result = createSong({ artist: "Sia" });
    expect(result.status).toBe(400);
  });

  it("rejects a song with no artist", () => {
    const result = createSong({ title: "Alive" });
    expect(result.status).toBe(400);
  });

  it("creates a song with a generated local id", () => {
    const result = createSong({ title: "Alive", artist: "Sia", year: "2016" });
    expect(result.status).toBe(201);
    expect(result.body.id).toMatch(/^local-/);
    expect(result.body.source).toBe("local");
    expect(result.body.year).toBe(2016); // coerced to a number, not left as the string "2016"
  });

  it("falls back to sensible defaults for optional fields", () => {
    const result = createSong({ title: "Untitled Track", artist: "Unknown" });
    expect(result.body.album).toBe("Unreleased");
    expect(result.body.genre).toBe("Unclassified");
    expect(result.body.year).toBeNull();
  });

  it("generates a new id for every song, even with the same title", () => {
    const first = createSong({ title: "Repeat", artist: "Artist" });
    const second = createSong({ title: "Repeat", artist: "Artist" });
    expect(first.body.id).not.toBe(second.body.id);
  });
});

describe("updateSong", () => {
  it("returns 404 for an id the store never created (e.g. an iTunes track id)", () => {
    const result = updateSong("2513412563", { title: "Renamed", artist: "Someone" });
    expect(result.status).toBe(404);
  });

  it("rejects an edit with no artist, same as creation would", () => {
    const created = createSong({ title: "Original", artist: "Artist" }).body;
    const result = updateSong(created.id, { title: "New Title" });
    expect(result.status).toBe(400);
  });

  it("updates a song it previously created, leaving its id unchanged", () => {
    const created = createSong({ title: "Original", artist: "Artist" }).body;
    const result = updateSong(created.id, { title: "Updated Title", artist: "Artist" });
    expect(result.status).toBe(200);
    expect(result.body.title).toBe("Updated Title");
    expect(result.body.id).toBe(created.id);
  });
});

describe("deleteSong", () => {
  it("returns 404 for an id the store doesn't own", () => {
    const result = deleteSong("2513412563");
    expect(result.status).toBe(404);
  });

  it("deletes a song it previously created", () => {
    const created = createSong({ title: "Temp", artist: "Temp Artist" }).body;
    const result = deleteSong(created.id);
    expect(result.status).toBe(200);
  });

  it("404s on a second delete of the same id, since it's actually gone", () => {
    const created = createSong({ title: "Temp", artist: "Temp Artist" }).body;
    deleteSong(created.id);
    const secondAttempt = deleteSong(created.id);
    expect(secondAttempt.status).toBe(404);
  });
});
