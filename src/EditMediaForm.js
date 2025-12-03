import { DataForm, useFormValidity } from "@wordpress/dataviews/wp";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { fields } from "./fields";
import { form } from "./form";
import { useUsersData } from "./hooks/useUsersData";

// Fields that support bulk editing
const BULK_EDIT_FIELDS = ['author', 'date'];

/**
 * MediaEditForm component
 * Handles the edit form with validation for media items
 * This is a separate component to ensure hooks are called conditionally
 * Supports bulk editing with filtered fields
 */
const EditMediaForm = ({
  displayItem,
  onChange,
  saveChanges,
  isSaving,
  hasLocalChanges,
  onClose,
  isBulkEdit,
  selectedCount
}) => {
  // Fetch users for the author field
  const { usersElements } = useUsersData();

  // Filter fields for bulk editing and populate author elements
  const filteredFields = useMemo(() => {
    const fieldsToUse = isBulkEdit
      ? fields.filter(field => BULK_EDIT_FIELDS.includes(field.id))
      : fields;

    // Add users to author field elements and handle bulk edit placeholders
    return fieldsToUse.map(field => {
      if (field.id === 'author') {
        return {
          ...field,
          elements: usersElements,
          setValue: ({ value }) => ({
            author: value ? Number(value) : null
          }),
          // Add placeholder text for bulk edit
          ...(isBulkEdit && displayItem?.author === null ? {
            placeholder: __("— Mixed values —")
          } : {})
        };
      }
      if (field.id === 'date' && isBulkEdit) {
        return {
          ...field,
          // Show placeholder for mixed values or existing value
          ...(displayItem?.date === '-' ? {
            placeholder: __("— Mixed values —"),
            getValue: ({ item }) => ''  // Return empty string for placeholder
          } : {}),
          setValue: ({ value }) => ({
            date: value || null
          })
        };
      }
      return field;
    });
  }, [isBulkEdit, usersElements, displayItem]);

  // Filter form for bulk editing
  const filteredForm = useMemo(() => {
    if (!isBulkEdit) return form;
    return {
      ...form,
      type: 'regular',
      fields: BULK_EDIT_FIELDS.filter(id => form.fields?.includes(id) || !form.fields)
    };
  }, [isBulkEdit]);

  const { validity, isValid } = useFormValidity(displayItem, filteredFields, filteredForm);

  return (
    <>
      {/* Bulk edit notice */}
      {isBulkEdit && (
        <div style={{
          padding: "12px",
          background: "#f0f0f1",
          borderRadius: "4px",
          marginBottom: "16px"
        }}>
          <p style={{ margin: 0, fontSize: "13px" }}>
            {__(`Editing ${selectedCount} items. Fields with the same value are shown; mixed values display "— Mixed values —".`)}
          </p>
        </div>
      )}

      {/* Edit Form */}
      <DataForm
        data={displayItem}
        fields={filteredFields}
        form={filteredForm}
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
          disabled={!hasLocalChanges || isSaving || (!isBulkEdit && !isValid)}
        >
          {isSaving
            ? __("Saving...")
            : isBulkEdit
              ? __(`Update ${selectedCount} Items`)
              : __("Save Changes")}
        </Button>
      </div>
    </>
  );
};

export default EditMediaForm;