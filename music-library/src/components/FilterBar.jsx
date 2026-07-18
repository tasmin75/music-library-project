import PropTypes from "prop-types";

const FIELDS = [
  { value: "title", label: "Title" },
  { value: "artist", label: "Artist" },
  { value: "album", label: "Album" },
];

export default function FilterBar({
  searchText,
  onSearchTextChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onToggleSortDirection,
  groupField,
  onGroupFieldChange,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-deck-line pb-5 mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex-1 max-w-sm">
        <label htmlFor="song-filter" className="block text-xs uppercase tracking-widest2 text-deck-muted mb-1.5">
          Filter
        </label>
        <input
          id="song-filter"
          type="text"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          placeholder="Filter by title, artist, or album"
          className="w-full rounded-sm border border-deck-line bg-deck-panel px-3 py-2 text-sm text-deck-cream placeholder:text-deck-muted/60 focus:border-deck-amber outline-none"
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label htmlFor="song-sort" className="block text-xs uppercase tracking-widest2 text-deck-muted mb-1.5">
            Sort by
          </label>
          <div className="flex gap-1.5">
            <select
              id="song-sort"
              value={sortField}
              onChange={(event) => onSortFieldChange(event.target.value)}
              className="rounded-sm border border-deck-line bg-deck-panel px-2 py-2 text-sm text-deck-cream focus:border-deck-amber outline-none"
            >
              {FIELDS.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onToggleSortDirection}
              aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
              className="rounded-sm border border-deck-line px-2.5 text-deck-amber hover:border-deck-amber transition-colors"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="song-group" className="block text-xs uppercase tracking-widest2 text-deck-muted mb-1.5">
            Group by
          </label>
          <select
            id="song-group"
            value={groupField ?? ""}
            onChange={(event) => onGroupFieldChange(event.target.value || null)}
            className="rounded-sm border border-deck-line bg-deck-panel px-2 py-2 text-sm text-deck-cream focus:border-deck-amber outline-none"
          >
            <option value="">None</option>
            {FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  searchText: PropTypes.string.isRequired,
  onSearchTextChange: PropTypes.func.isRequired,
  sortField: PropTypes.oneOf(["title", "artist", "album"]).isRequired,
  onSortFieldChange: PropTypes.func.isRequired,
  sortDirection: PropTypes.oneOf(["asc", "desc"]).isRequired,
  onToggleSortDirection: PropTypes.func.isRequired,
  groupField: PropTypes.oneOf(["title", "artist", "album", null]),
  onGroupFieldChange: PropTypes.func.isRequired,
};
