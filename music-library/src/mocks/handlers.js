import { http, HttpResponse } from "msw";
import { createSong, updateSong, deleteSong } from "./songsStore";

/**
 * Thin HTTP layer: parse the request, hand off to songsStore, translate
 * the result back into an HTTP response. All the actual behavior (what
 * counts as valid, what happens on a duplicate edit, what 404s) lives in
 * songsStore.js and is unit-tested there directly — this file has nothing
 * left to test that isn't already covered by that.
 */
export const handlers = [
  http.post("/songs", async ({ request }) => {
    const body = await request.json();
    const { status, body: responseBody } = createSong(body);
    return HttpResponse.json(responseBody, { status });
  }),

  http.put("/songs/:id", async ({ params, request }) => {
    const body = await request.json();
    const { status, body: responseBody } = updateSong(params.id, body);
    return HttpResponse.json(responseBody, { status });
  }),

  http.delete("/songs/:id", ({ params }) => {
    const { status, body: responseBody } = deleteSong(params.id);
    return HttpResponse.json(responseBody, { status });
  }),
];
