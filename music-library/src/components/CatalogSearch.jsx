import { useState } from "react";
import PropTypes from "prop-types";

/**
 * This is the one input that actually triggers a network request (via
 * useSongsQuery -> React Query -> iTunes). The FilterBar further down
 * the tree works client-side on whatever this fetch already returned —
 * two different jobs, kept as two different controls on purpose.
 */
export default function CatalogSearch({ term, onSearch }) {
  const [draft, setDraft] = useState(term);

  const submit = (event) => {
    event.preventDefault();
    if (draft.trim()) onSearch(draft.trim());
  };

  return (
    <form onSubmit={submit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search an artist or album on iTunes…"
        className="field-input flex-1"
        aria-label="Search iTunes catalog"
      />
      <button
        type="submit"
        className="rounded-sm border border-deck-amber px-4 text-xs uppercase tracking-widest2 text-deck-amber hover:bg-deck-amber hover:text-deck-bg transition-colors"
      >
        Search
      </button>
    </form>
  );
}

CatalogSearch.propTypes = {
  term: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};
