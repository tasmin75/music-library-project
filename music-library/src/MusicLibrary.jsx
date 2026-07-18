import { useEffect, useMemo, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { queryClient } from "./queryClient";
import { enableMocking } from "./mocks/enableMocking";
import { RoleProvider, useCanManageSongs } from "./context/RoleContext";
import { useSongsQuery } from "./hooks/useSongsQuery";
import { useAddSongMutation, useUpdateSongMutation, useDeleteSongMutation } from "./hooks/useSongMutations";
import { filterSongs, sortSongs, groupSongs, countBySource } from "./utils/songUtils";
import CatalogSearch from "./components/CatalogSearch";
import FilterBar from "./components/FilterBar";
import SongList from "./components/SongList";
import SongForm from "./components/SongForm";
import VuMeter from "./components/VuMeter";
import ErrorState from "./components/ErrorState";

const DEFAULT_TERM = "Coldplay";

function LibraryContent() {
  const canManage = useCanManageSongs();

  const [term, setTerm] = useState(DEFAULT_TERM);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [groupField, setGroupField] = useState(null);

  // Only one form is ever open at a time: null (closed), "add", or the
  // song object currently being edited. A song object doubles as "edit
  // mode is on, and here's what to pre-fill" rather than tracking an id
  // and looking the song back up.
  const [activeForm, setActiveForm] = useState(null);

  const { data: songs, isPending, isError, error, refetch } = useSongsQuery(term);
  const addSongMutation = useAddSongMutation();
  const updateSongMutation = useUpdateSongMutation();
  const deleteSongMutation = useDeleteSongMutation();

  const visibleSongs = useMemo(() => {
    if (!songs) return [];
    const filtered = filterSongs(songs, searchText);
    return sortSongs(filtered, sortField, sortDirection);
  }, [songs, searchText, sortField, sortDirection]);

  const groups = useMemo(() => {
    const grouped = groupSongs(visibleSongs, groupField);
    return grouped ?? [{ key: "__all__", songs: visibleSongs }];
  }, [visibleSongs, groupField]);

  const sourceCounts = useMemo(() => countBySource(songs ?? []), [songs]);

  const handleAddSong = async (values) => {
    try {
      return await addSongMutation.mutateAsync(values);
    } catch {
      return null;
    }
  };

  const handleUpdateSong = async (values) => {
    try {
      const saved = await updateSongMutation.mutateAsync({ id: activeForm.id, values });
      setActiveForm(null);
      return saved;
    } catch {
      return null;
    }
  };

  const handleDeleteSong = (id) => {
    deleteSongMutation.mutate(id);
  };

  const isEditing = activeForm && activeForm !== "add";
  const isAdding = activeForm === "add";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest2 text-deck-amber mb-1">
            Side A · {term}
          </p>
          <h2 className="font-display text-2xl text-deck-cream">Music Library</h2>
          {songs && (
            <p className="text-xs text-deck-muted mt-1">
              {songs.length} tracks · {sourceCounts.local} added this session
            </p>
          )}
        </div>

        {canManage && !activeForm && (
          <button
            type="button"
            onClick={() => setActiveForm("add")}
            className="shrink-0 rounded-sm bg-deck-amber px-3 py-2 text-xs uppercase tracking-widest2 text-deck-bg font-medium hover:bg-deck-amber/90 transition-colors"
          >
            + Add track
          </button>
        )}
      </header>

      <CatalogSearch term={term} onSearch={setTerm} />

      {canManage && isAdding && (
        <SongForm
          mode="add"
          onSubmit={handleAddSong}
          isSubmitting={addSongMutation.isPending}
          submitError={addSongMutation.isError ? addSongMutation.error.message : null}
          onClose={() => setActiveForm(null)}
        />
      )}

      {canManage && isEditing && (
        <SongForm
          mode="edit"
          initialValues={{
            title: activeForm.title,
            artist: activeForm.artist,
            album: activeForm.album,
            year: activeForm.year ?? "",
            genre: activeForm.genre,
          }}
          onSubmit={handleUpdateSong}
          isSubmitting={updateSongMutation.isPending}
          submitError={updateSongMutation.isError ? updateSongMutation.error.message : null}
          onClose={() => setActiveForm(null)}
        />
      )}

      {isPending && <VuMeter label="Cueing up the catalog" />}

      {isError && <ErrorState message={error?.message} onRetry={refetch} />}

      {!isPending && !isError && (
        <>
          <FilterBar
            searchText={searchText}
            onSearchTextChange={setSearchText}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortDirection={sortDirection}
            onToggleSortDirection={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
            groupField={groupField}
            onGroupFieldChange={setGroupField}
          />
          <SongList
            groups={groups}
            canManage={canManage}
            onEdit={(song) => setActiveForm(song)}
            onDelete={handleDeleteSong}
            pendingDeleteId={deleteSongMutation.isPending ? deleteSongMutation.variables : null}
          />
        </>
      )}
    </div>
  );
}

/**
 * The exposed component. `role` comes from the host app's auth state —
 * see src/context/RoleContext.jsx for why it's a prop and not something
 * fancier. Defaults to "user" so the remote still renders sensibly if
 * it's ever mounted without a host wrapping it (e.g. Storybook, a demo).
 */
export default function MusicLibrary({ role = "user" }) {
  useEffect(() => {
    enableMocking();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider role={role}>
        <LibraryContent />
      </RoleProvider>
    </QueryClientProvider>
  );
}

MusicLibrary.propTypes = {
  role: PropTypes.oneOf(["admin", "user"]),
};
