import { useState, useEffect } from "@wordpress/element";
import { DataForm } from "@wordpress/dataviews/wp";
import { Button, Notice } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
// Import the enhanced field definitions
import { fields } from "./fields";
import { form } from "./form";

const MediaEditModal = ({ media, onClose, onSave }) => {
  // Initialize state with proper mapping from media object
  const [editedData, setEditedData] = useState(() => ({
    title: media.title?.rendered || media.title?.raw || "",
    alt_text: media.alt_text || "",
    caption: media.caption?.rendered || media.caption?.raw || "",
    description: media.description?.rendered || media.description?.raw || ""
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Get the saveEntityRecord action from the Redux store
  const { saveEntityRecord } = useDispatch(coreDataStore);

  // Validate all fields when data changes
  useEffect(() => {
    const errors = {};
    fields.forEach((field) => {
      if (field.isValid) {
        const value = editedData[field.id];

        // Check required fields
        if (field.isValid.required && (!value || value === '')) {
          errors[field.id] = __('This field is required');
          return;
        }

        // Run custom validation
        if (field.isValid.custom) {
          const validationResult = field.isValid.custom(value);
          if (validationResult !== true) {
            errors[field.id] = validationResult;
          }
        }
      }
    });
    setValidationErrors(errors);
  }, [editedData]);


  // Handle save using Redux store
  const handleSave = async () => {
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError(__('Please fix the validation errors before saving'));
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare data for saving
      const dataToSave = {
        id: media.id,
        title: editedData.title,
        alt_text: editedData.alt_text,
        caption: editedData.caption,
        description: editedData.description,
        comment_status: editedData.comment_status,
        ping_status: editedData.ping_status,
        meta: {
          ...media.meta,
          media_categories: editedData.media_categories,
          featured: editedData.featured,
          photographer: editedData.photographer,
          license: editedData.license,
          tags: editedData.tags,
          expiration_date: editedData.expiration_date,
        },
      };

      // Save using the Redux store's saveEntityRecord
      const updatedMedia = await saveEntityRecord(
        "postType",
        "attachment",
        dataToSave
      );

      setSuccess(true);

      // Call the parent's onSave callback if provided
      if (onSave) {
        onSave(updatedMedia);
      }

      // Close modal after a brief success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || __("Failed to save changes"));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field changes with validation feedback
  const handleFieldChange = (newData) => {
    setEditedData(newData);
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

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
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        />
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          {media.media_details?.width && media.media_details?.height && (
            <span>
              {media.media_details.width} × {media.media_details.height} px
            </span>
          )}
          {media.mime_type && (
            <span style={{ marginLeft: "10px" }}>
              • {media.mime_type.split("/")[1].toUpperCase()}
            </span>
          )}
          {media.media_details?.filesize && (
            <span style={{ marginLeft: "10px" }}>
              • {(media.media_details.filesize / 1024 / 1024).toFixed(2)} MB
            </span>
          )}
        </div>
      </div>

      {/* Show any errors */}
      {error && (
        <Notice
          status="error"
          isDismissible={true}
          onRemove={() => setError(null)}
          style={{ marginBottom: "20px" }}
        >
          {error}
        </Notice>
      )}

      {/* Show success message */}
      {success && (
        <Notice
          status="success"
          isDismissible={false}
          style={{ marginBottom: "20px" }}
        >
          {__("Changes saved successfully!")}
        </Notice>
      )}

      {/* Show validation summary if there are errors */}
      {hasErrors && !success && (
        <Notice
          status="warning"
          isDismissible={false}
          style={{ marginBottom: "20px" }}
        >
          {__("Please fix the following fields:")}
          <ul style={{ marginTop: "5px", marginBottom: 0 }}>
            {Object.entries(validationErrors).map(([fieldId, errorMsg]) => {
              const field = editableFields.find((f) => f.id === fieldId);
              return (
                <li key={fieldId}>
                  <strong>{field?.label}:</strong> {errorMsg}
                </li>
              );
            })}
          </ul>
        </Notice>
      )}

      <DataForm
        data={editedData}
        fields={fields}
        form={form}
        onChange={handleFieldChange}
      />

      {/* Action buttons */}
      <div
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "13px", color: "#666" }}>
          {hasErrors && (
            <span style={{ color: "#d94f4f" }}>
              ⚠️ {__("Fix validation errors before saving")}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="tertiary" onClick={onClose} disabled={isSaving}>
            {__("Cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isBusy={isSaving}
            disabled={isSaving || hasErrors}
          >
            {isSaving ? __("Saving...") : __("Save Changes")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaEditModal;