import { useState } from "@wordpress/element";
import { DataForm } from "@wordpress/dataviews/wp";
import { Button, Notice } from "@wordpress/components";
import { close } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { fields } from "./fields";
import { form } from "./form";

const SidebarPanel = ({ isOpen, onClose, selectedItem, onChange }) => {
  const [changes, setChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreDataStore);

  // Combine original item with changes for display
  const editedItem = selectedItem ? { ...selectedItem, ...changes } : null;

  const handleChange = (newData) => {
    // Track only the changes
    const updatedItem = { ...selectedItem, ...newData };
    setChanges(updatedItem);
    onChange(updatedItem);
  };

  const handleSave = async () => {
    if (!selectedItem || Object.keys(changes).length === 0) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // Update the entity record with changes
      editEntityRecord("postType", "attachment", selectedItem.id, changes);

      // Save the changes
      const updatedRecord = await saveEditedEntityRecord(
        "postType",
        "attachment",
        selectedItem.id
      );

      if (updatedRecord) {
        setMessage({ type: 'success', text: __("Changes saved successfully!") });
        setChanges({}); // Clear changes after successful save
      }
    } catch (error) {
      setMessage({ type: 'error', text: __("Failed to save changes") });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(changes).length > 0;

  if (!isOpen) return null;

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel__header">
        <h2 className="sidebar-panel__title">
          {selectedItem ? __("Edit Media") : __("Select an item")}
        </h2>
        <Button
          icon={close}
          label={__("Close sidebar")}
          onClick={onClose}
          size="small"
        />
      </div>

      <div className="sidebar-panel__content">
        {!selectedItem ? (
          <p>{__("Select a media item from the grid to edit its details.")}</p>
        ) : (
          <>
            {/* Preview Image */}
            {/*
            <div className="sidebar-panel__preview">
              <img
                src={selectedItem.source_url}
                alt={selectedItem.alt_text}
              />
            </div>
               */}

            {/* Messages */}
            {message && (
              <Notice
                status={message.type}
                isDismissible={false}
                className="sidebar-panel__notice"
              >
                {message.text}
              </Notice>
            )}

            {/* Edit Form */}
            <DataForm
              data={editedItem}
              fields={fields}
              form={form}
              onChange={handleChange}
            />

            {/* Save Button */}
            <div className="sidebar-panel__actions" style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="secondary"
                onClick={onClose}
              >
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
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarPanel;