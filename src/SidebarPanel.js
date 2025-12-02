import { Button, Notice } from "@wordpress/components";
import { close } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { useMediaEditor } from "./hooks/useMediaEditor";
import EditMediaForm from "./EditMediaForm";

const SidebarPanel = ({ onClose, selectedItems, isBulkEdit }) => {
  const {
    displayItem,
    isSaving,
    message,
    clearMessage,
    hasLocalChanges,
    handleChange: handleEditorChange,
    saveChanges,
  } = useMediaEditor(selectedItems, isBulkEdit);

  // Direct pass-through to the hook's handler
  const handleChange = handleEditorChange;

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel__header">
        <h2>
          {isBulkEdit
            ? __(`Bulk Edit (${Array.isArray(selectedItems) ? selectedItems.length : 0} items)`)
            : selectedItems
            ? __("Edit Media")
            : __("Select an item")}
        </h2>
        <Button
          icon={close}
          label={__("Close sidebar")}
          onClick={onClose}
          size="small"
        />
      </div>

      <div className="sidebar-panel__content">
        {!selectedItems ? (
          <p>{__("Select a media item from the grid to edit its details.")}</p>
        ) : (
          <>
            {/* Messages */}
            {message && (
              <Notice
                status={message.type}
                isDismissible={true}
                onDismiss={clearMessage}
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
                isBulkEdit={isBulkEdit}
                selectedCount={Array.isArray(selectedItems) ? selectedItems.length : 1}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarPanel;