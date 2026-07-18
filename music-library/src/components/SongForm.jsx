import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

const currentYear = new Date().getFullYear();

/**
 * Handles both adding a new track and editing one already added this
 * session. Same fields, same validation, same layout either way — the
 * only difference is what it's pre-filled with and which mutation the
 * parent wires up to onSubmit. Editing is only ever offered for
 * source: "local" rows (see SongRow.jsx) since that's the only data the
 * mock backend actually owns; iTunes results are read-only reference data.
 */
export default function SongForm({
  mode = "add",
  initialValues,
  onSubmit,
  isSubmitting,
  submitError,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues ?? { title: "", artist: "", album: "", year: "", genre: "" },
  });

  const isEdit = mode === "edit";

  const submit = handleSubmit(async (values) => {
    const saved = await onSubmit(values);
    if (saved && !isEdit) reset();
  });

  return (
    <form onSubmit={submit} className="border border-deck-line rounded-sm bg-deck-panel p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base text-deck-cream">
          {isEdit ? "Edit track" : "Add a track"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-deck-muted hover:text-deck-cream text-sm"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title" error={errors.title}>
          <input
            {...register("title", { required: "Title is required" })}
            className="field-input"
            placeholder="Midnight City"
          />
        </Field>

        <Field label="Artist" error={errors.artist}>
          <input
            {...register("artist", { required: "Artist is required" })}
            className="field-input"
            placeholder="M83"
          />
        </Field>

        <Field label="Album">
          <input {...register("album")} className="field-input" placeholder="Hurry Up, We're Dreaming" />
        </Field>

        <Field label="Year" error={errors.year}>
          <input
            type="number"
            {...register("year", {
              valueAsNumber: true,
              min: { value: 1900, message: "Enter a real year" },
              max: { value: currentYear, message: `Year can't be in the future` },
            })}
            className="field-input"
            placeholder={String(currentYear)}
          />
        </Field>

        <Field label="Genre">
          <input {...register("genre")} className="field-input" placeholder="Electronic" />
        </Field>
      </div>

      {submitError && <p className="text-xs text-deck-rec mt-3">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-sm bg-deck-amber px-4 py-2 text-xs uppercase tracking-widest2 text-deck-bg font-medium hover:bg-deck-amber/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (isEdit ? "Saving…" : "Adding…") : isEdit ? "Save changes" : "Add track"}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest2 text-deck-muted mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-deck-rec mt-1">{error.message}</span>}
    </label>
  );
}

SongForm.propTypes = {
  mode: PropTypes.oneOf(["add", "edit"]),
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    genre: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submitError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.shape({ message: PropTypes.string }),
  children: PropTypes.node.isRequired,
};
