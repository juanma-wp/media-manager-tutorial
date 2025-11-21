import { useState, useEffect } from "@wordpress/element";
import { DataForm } from "@wordpress/dataviews/wp";
import { Button, Notice } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { fields } from "./fields";
import { form } from "./form";

const Edit = ({ item: media, closeModal }) => {
  
  const [editMedia, setEditMedia] = useState(media);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreDataStore);

  useEffect(() => {
    setEditMedia(media);
  }, [media]);

  const handleChange = (newData) => {
    setEditMedia({ ...editMedia, ...newData });
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    setError(null);

    try {
      editEntityRecord("postType", "attachment", media.id, editMedia);

      const updatedRecord = await saveEditedEntityRecord(
        "postType",
        "attachment",
        media.id
      );

      if (updatedRecord) {
        setSuccess(true);
        setTimeout(() => {
          closeModal();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || __("Failed to save changes"));
    } finally {
      setIsSaving(false);
    }
  };
  const hasChanges = JSON.stringify(editMedia) !== JSON.stringify(media);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <img
          src={media.media_details?.sizes?.medium?.source_url || media.source_url}
          alt={media.alt_text}
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "200px",
            borderRadius: "4px",
          }}
        />
      </div>

      {error && (
        <Notice status="error" isDismissible={false}>
          {error}
        </Notice>
      )}

      {success && (
        <Notice status="success" isDismissible={false}>
          {__("Changes saved successfully!")}
        </Notice>
      )}

      <DataForm
        data={editMedia}
        fields={fields}
        form={form}
        onChange={handleChange}
      />

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
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? __("Saving...") : __("Save Changes")}
        </Button>
      </div>
    </div>
  );
};

export default Edit;