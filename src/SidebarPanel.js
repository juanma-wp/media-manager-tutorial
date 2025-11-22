import { DataForm } from "@wordpress/dataviews/wp";
import { Button, Notice } from "@wordpress/components";
import { close } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { fields } from "./fields";
import { form } from "./form";
import { useMediaEditor } from "./hooks/useMediaEditor";

const SidebarPanel = ({ isOpen, onClose, selectedItem, onChange }) => {
  const {
    displayItem,
    isSaving,
    message,
    hasLocalChanges,
    handleChange: handleEditorChange,
    saveChanges,
  } = useMediaEditor(selectedItem);

  // Wrapper to call both the hook's handler and the parent's onChange
  const handleChange = (newData) => {
    handleEditorChange(newData);
    if (onChange) {
      const updatedItem = { ...selectedItem, ...newData };
      onChange(updatedItem);
    }
  };

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
              data={displayItem}
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
                onClick={saveChanges}
                isBusy={isSaving}
                disabled={!hasLocalChanges || isSaving}
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