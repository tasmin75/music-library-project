import PropTypes from "prop-types";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
      <span className="h-2 w-2 rounded-full bg-deck-rec" aria-hidden="true" />
      <p className="font-display text-lg text-deck-cream">Playback interrupted.</p>
      <p className="text-sm text-deck-muted max-w-sm">
        {message || "The iTunes catalog didn't respond. Check your connection and try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-sm border border-deck-amber/60 px-4 py-1.5 text-xs uppercase tracking-widest2 text-deck-amber hover:bg-deck-amber hover:text-deck-bg transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};
