import { Button, Notice } from "@wordpress/components";
import { close } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { useMediaEditor } from "./hooks/useMediaEditor";
import EditMediaForm from "./EditMediaForm";

const SidebarPanel = ({ onClose, selectedItem, onChange }) => {
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

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel__header">
        <h2>
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

            {/* Render form component only when displayItem exists */}
            {displayItem && (
              <EditMediaForm
                displayItem={displayItem}
                onChange={handleChange}
                saveChanges={saveChanges}
                isSaving={isSaving}
                hasLocalChanges={hasLocalChanges}
                onClose={onClose}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarPanel;