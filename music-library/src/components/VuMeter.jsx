import PropTypes from "prop-types";

const BAR_DELAYS = [0, 0.12, 0.24, 0.08, 0.2];

/**
 * A small equalizer/VU-meter animation — the one deliberately playful
 * touch in an otherwise disciplined UI, standing in for a generic
 * spinner and tying the "loading" moment back to the subject matter.
 */
export default function VuMeter({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16" role="status" aria-live="polite">
      <div className="flex items-end gap-1 h-10">
        {BAR_DELAYS.map((delay, index) => (
          <span
            key={index}
            className="w-1.5 rounded-sm bg-deck-amber animate-vu"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <p className="font-mono text-xs tracking-widest2 uppercase text-deck-muted">{label}</p>
    </div>
  );
}

VuMeter.propTypes = {
  label: PropTypes.string,
};
