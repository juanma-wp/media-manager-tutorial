import { useState } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";

/**
 * Simple hook for handling media editing operations
 */
export const useMediaEditor = (selectedItem) => {
  const [changes, setChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreDataStore);

  // Combine original item with changes for display
  const displayItem = selectedItem ? { ...selectedItem, ...changes } : null;

  const handleChange = (newData) => {
    if (!selectedItem) return;

    // Track only the changes
    const updatedChanges = {};
    Object.keys(newData).forEach(key => {
      if (newData[key] !== selectedItem[key]) {
        updatedChanges[key] = newData[key];
      }
    });
    setChanges(updatedChanges);
  };

  const saveChanges = async () => {
    if (!selectedItem || Object.keys(changes).length === 0) return;

    setIsSaving(true);
    setMessage(null);

    try {
      editEntityRecord("postType", "attachment", selectedItem.id, changes);

      const updatedRecord = await saveEditedEntityRecord(
        "postType",
        "attachment",
        selectedItem.id
      );

      if (updatedRecord) {
        setMessage({ type: 'success', text: "Changes saved successfully!" });
        setChanges({});
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Failed to save changes" });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    displayItem,
    isSaving,
    message,
    hasLocalChanges: Object.keys(changes).length > 0,
    handleChange,
    saveChanges,
  };
};