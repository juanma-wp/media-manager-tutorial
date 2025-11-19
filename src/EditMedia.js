import { useState, useMemo } from "@wordpress/element";
import { DataForm } from "@wordpress/dataviews/wp";
import { Button, Notice } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
// Import the shared field definitions
import { editableFields } from "./fields";

const Edit = ({ item: media, closeModal }) => {
  const [editedData, setEditedData] = useState(() => ({
    title: media.title?.rendered || "",
    alt_text: media.alt_text || "",
    caption: media.caption?.rendered || "",
    description: media.description?.rendered || "",
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get the saveEntityRecord action from the Redux store
  const { saveEntityRecord } = useDispatch(coreDataStore);

  // Use the enhanced field definitions from media-fields.js
  // These same fields work for both DataViews (display) and DataForm (editing)!
  const formFields = useMemo(() => editableFields, []);

  // Define form layout - simplify to just list all fields
  const form = {
    fields: ["title.rendered", "alt_text", "caption", "description.rendered"],
  };

  // Handle save using Redux store
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Save using the Redux store's saveEntityRecord
      await saveEntityRecord(
        "postType",
        "attachment",
        {
          id: media.id,
          title: editedData.title,
          alt_text: editedData.alt_text,
          caption: editedData.caption,
          description: editedData.description,
        }
      );

      setSuccess(true);

      // Close modal after a brief success message
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setError(err.message || __("Failed to save changes"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Display the media preview */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <img
          src={
            media.media_details?.sizes?.medium?.source_url || media.source_url
          }
          alt={media.alt_text}
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "200px",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Show any errors */}
      {error && (
        <Notice
          status="error"
          isDismissible={true}
          onRemove={() => setError(null)}
        >
          {error}
        </Notice>
      )}

      {/* Show success message */}
      {success && (
        <Notice status="success" isDismissible={false}>
          {__("Changes saved successfully!")}
        </Notice>
      )}

      {/* The DataForm component */}
      <DataForm
        data={editedData}
        fields={formFields}
        form={form}
        onChange={setEditedData}
      />

      {/* Action buttons */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button variant="tertiary" onClick={closeModal} disabled={isSaving}>
          {__("Cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          isBusy={isSaving}
          disabled={isSaving}
        >
          {isSaving ? __("Saving...") : __("Save Changes")}
        </Button>
      </div>
    </div>
  );
};

export default Edit;