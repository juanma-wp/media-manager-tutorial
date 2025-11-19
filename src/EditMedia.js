import { useMemo, useState } from "@wordpress/element";
import { DataForm } from "@wordpress/dataviews/wp";
import { Button, Notice } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
// Import the shared field definitions
import { editableFields } from "./fields";

const Edit = ({ item: media, closeModal }) => {
  const [success, setSuccess] = useState(false);

  // Get the edited entity record and related state from the store
  const { editedMedia, isSaving, hasEdits, lastError } = useSelect(
    (select) => ({
      editedMedia: select(coreDataStore).getEditedEntityRecord(
        "postType",
        "attachment",
        media.id
      ),
      lastError: select(coreDataStore).getLastEntitySaveError(
        "postType",
        "attachment",
        media.id
      ),
      isSaving: select(coreDataStore).isSavingEntityRecord(
        "postType",
        "attachment",
        media.id
      ),
      hasEdits: select(coreDataStore).hasEditsForEntityRecord(
        "postType",
        "attachment",
        media.id
      ),
    }),
    [media.id]
  );

  // Get dispatch actions
  const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreDataStore);

  // Define form layout - use the actual field IDs from fields.js
  const form = {
    fields: ["title.raw", "alt_text", "caption", "description.raw"],
  };

  const [editMedia, setEditMedia] = useState(media);

  // Handle changes using editEntityRecord
  const handleChange = (newData) => {
    setEditMedia({ ...editMedia, ...newData });
  };

  // Handle save using saveEditedEntityRecord
  const handleSave = async () => {
    setSuccess(false);

    editEntityRecord("postType", "attachment", media.id, editMedia);
    
    const updatedRecord = await saveEditedEntityRecord(
      "postType",
      "attachment",
      media.id
    );

    if (updatedRecord) {
      setSuccess(true);
      // Close modal after a brief success message
      setTimeout(() => {
        closeModal();
      }, 1500);
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
      {lastError && (
        <Notice status="error" isDismissible={false}>
          {lastError.message || __("Failed to save changes")}
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
        data={editMedia}
        fields={editableFields}
        form={form}
        onChange={handleChange}
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
          disabled={!hasEdits || isSaving}
        >
          {isSaving ? __("Saving...") : __("Save Changes")}
        </Button>
      </div>
    </div>
  );
};

export default Edit;