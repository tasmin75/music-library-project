import PropTypes from "prop-types";
import SongRow from "./SongRow";

export default function SongList({ groups, canManage, onEdit, onDelete, pendingDeleteId }) {
  const totalSongs = groups.reduce((count, group) => count + group.songs.length, 0);

  if (totalSongs === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-lg text-deck-cream">No tracks match this filter.</p>
        <p className="text-sm text-deck-muted mt-1">Try a different search, or clear the filter.</p>
      </div>
    );
  }

  let runningIndex = 0;

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => {
        const startIndex = runningIndex;
        runningIndex += group.songs.length;

        return (
          <section key={group.key}>
            {group.key !== "__all__" && (
              <h3 className="font-display text-sm text-deck-amber uppercase tracking-widest2 mb-2">
                {group.key}
                <span className="ml-2 text-deck-muted normal-case tracking-normal font-body">
                  {group.songs.length} {group.songs.length === 1 ? "track" : "tracks"}
                </span>
              </h3>
            )}
            <ul>
              {group.songs.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  trackNumber={startIndex + index + 1}
                  canManage={canManage}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={pendingDeleteId === song.id}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

SongList.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      songs: PropTypes.array.isRequired,
    })
  ).isRequired,
  canManage: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  pendingDeleteId: PropTypes.string,
};
