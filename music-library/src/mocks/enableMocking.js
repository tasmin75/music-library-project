let startPromise = null;

/**
 * Starts the MSW service worker exactly once, regardless of whether this
 * module is loaded standalone (npm run dev in this folder) or pulled in
 * remotely by the host through Module Federation. onUnhandledRequest is
 * "bypass" so the real iTunes network calls sail straight through — MSW
 * only ever intercepts /songs and /songs/:id.
 */
export function enableMocking() {
  if (!startPromise) {
    startPromise = import("./browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass", quiet: true })
    );
  }
  return startPromise;
}
