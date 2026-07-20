import { describe, it, expect } from "vitest";
import { filterSongs, sortSongs, groupSongs, countBySource } from "./songUtils";

const songs = [
  { id: "1", title: "Clocks", artist: "Coldplay", album: "A Rush of Blood to the Head", source: "itunes" },
  { id: "2", title: "Yellow", artist: "Coldplay", album: "Parachutes", source: "itunes" },
  { id: "3", title: "Fix You", artist: "Coldplay", album: "X&Y", source: "local" },
  { id: "4", title: "Alive", artist: "Sia", album: "This Is Acting", source: "itunes" },
];

describe("filterSongs", () => {
  it("returns everything when the search text is empty", () => {
    expect(filterSongs(songs, "")).toHaveLength(4);
  });

  it("matches on artist", () => {
    expect(filterSongs(songs, "sia")).toHaveLength(1);
  });

  it("matches on album, case-insensitively", () => {
    expect(filterSongs(songs, "PARACHUTES")).toHaveLength(1);
  });

  it("matches on title", () => {
    expect(filterSongs(songs, "fix you")).toHaveLength(1);
  });

  it("returns nothing for a term that matches no field", () => {
    expect(filterSongs(songs, "nonexistent artist xyz")).toHaveLength(0);
  });
});

describe("sortSongs", () => {
  it("sorts ascending by title", () => {
    const result = sortSongs(songs, "title", "asc");
    expect(result.map((s) => s.title)).toEqual(["Alive", "Clocks", "Fix You", "Yellow"]);
  });

  it("sorts descending by title", () => {
    const result = sortSongs(songs, "title", "desc");
    expect(result.map((s) => s.title)).toEqual(["Yellow", "Fix You", "Clocks", "Alive"]);
  });

  it("does not mutate the original array", () => {
    const original = [...songs];
    sortSongs(songs, "title", "asc");
    expect(songs).toEqual(original);
  });

  it("returns the same list unchanged for an unknown field", () => {
    expect(sortSongs(songs, "not-a-real-field", "asc")).toEqual(songs);
  });
});

describe("groupSongs", () => {
  it("returns null when no group field is given", () => {
    expect(groupSongs(songs, null)).toBeNull();
  });

  it("groups by artist and alphabetises the group keys", () => {
    const grouped = groupSongs(songs, "artist");
    expect(grouped.map((g) => g.key)).toEqual(["Coldplay", "Sia"]);
  });

  it("keeps every song from a group together under that group's key", () => {
    const grouped = groupSongs(songs, "artist");
    const coldplayGroup = grouped.find((g) => g.key === "Coldplay");
    expect(coldplayGroup.songs).toHaveLength(3);
  });
});

describe("countBySource", () => {
  it("tallies itunes vs. local tracks correctly", () => {
    expect(countBySource(songs)).toEqual({ itunes: 3, local: 1 });
  });

  it("returns zero counts for an empty list", () => {
    expect(countBySource([])).toEqual({ itunes: 0, local: 0 });
  });
});
