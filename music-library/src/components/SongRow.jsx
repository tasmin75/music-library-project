import PropTypes from "prop-types";

function formatDuration(ms) {
  if (!ms) return "—:—";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function SongRow({ song, trackNumber, canManage, onEdit, onDelete, isDeleting }) {
  // Edit/delete only make sense for tracks this session actually added —
  // the mock backend has no record of iTunes catalog entries to mutate.
  const canMutateThisRow = canManage && song.source === "local";

  return (
    <li className="group flex items-center gap-4 py-3 border-b border-deck-line/60 last:border-b-0">
      <span className="w-7 shrink-0 font-mono text-sm text-deck-muted text-right">
        {String(trackNumber).padStart(2, "0")}
      </span>

      {song.artwork ? (
        <img
          src={song.artwork}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-sm object-cover border border-deck-line"
        />
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-sm border border-deck-line bg-deck-panel flex items-center justify-center text-deck-muted text-xs font-mono">
          ♪
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-deck-cream font-medium">{song.title}</p>
        <p className="truncate text-xs text-deck-muted">
          {song.artist} <span aria-hidden="true">·</span> {song.album}
        </p>
      </div>

      {song.source === "local" && (
        <span className="hidden sm:inline-block shrink-0 rounded-sm border border-deck-tape/60 px-1.5 py-0.5 text-[10px] uppercase tracking-widest2 text-deck-tape">
          Added
        </span>
      )}

      <span className="hidden sm:block shrink-0 w-10 text-right font-mono text-xs text-deck-muted">
        {song.year ?? "—"}
      </span>

      <span className="hidden md:block shrink-0 w-14 text-right font-mono text-xs text-deck-muted">
        {formatDuration(song.durationMs)}
      </span>

      {canMutateThisRow && (
        <span className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(song)}
            aria-label={`Edit ${song.title}`}
            className="text-deck-muted hover:text-deck-amber transition-colors text-sm leading-none px-1"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => onDelete(song.id)}
            disabled={isDeleting}
            aria-label={`Remove ${song.title}`}
            className="text-deck-muted hover:text-deck-rec transition-colors disabled:opacity-40 text-lg leading-none px-1"
          >
            {isDeleting ? "…" : "×"}
          </button>
        </span>
      )}
    </li>
  );
}

SongRow.propTypes = {
  song: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    year: PropTypes.number,
    artwork: PropTypes.string,
    durationMs: PropTypes.number,
    source: PropTypes.oneOf(["itunes", "local"]).isRequired,
  }).isRequired,
  trackNumber: PropTypes.number.isRequired,
  canManage: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};
