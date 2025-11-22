import { DataForm, useFormValidity } from "@wordpress/dataviews/wp";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * MediaEditForm component
 * Handles the edit form with validation for media items
 * This is a separate component to ensure hooks are called conditionally
 */
const MediaEditForm = ({
  displayItem,
  fields,
  form,
  onChange,
  saveChanges,
  isSaving,
  hasLocalChanges,
  onClose
}) => {
  const { validity, isValid } = useFormValidity(displayItem, fields, form);

  return (
    <>
      {/* Edit Form */}
      <DataForm
        data={displayItem}
        fields={fields}
        form={form}
        validity={validity}
        onChange={onChange}
      />

      {/* Save Button */}
      <div className="sidebar-panel__actions" style={{ display: "flex", gap: "10px" }}>
        <Button variant="secondary" onClick={onClose}>
          {__("Cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={saveChanges}
          isBusy={isSaving}
          disabled={!hasLocalChanges || isSaving || !isValid}
        >
          {isSaving ? __("Saving...") : __("Save Changes")}
        </Button>
      </div>
    </>
  );
};

export default MediaEditForm;