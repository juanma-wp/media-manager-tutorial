import { useState, useEffect } from "@wordpress/element";
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

  // Reset changes when selected item changes
  useEffect(() => {
    setChanges({});
    setMessage(null);
  }, [selectedItem?.id]);

  // Combine original item with changes for display
  const displayItem = selectedItem ? { ...selectedItem, ...changes } : null;

  const handleChange = (newData) => {
    if (!selectedItem) return;

    // newData is the complete updated object from DataForm
    // Extract only the changes by comparing with original
    const changedFields = {};
    Object.keys(newData).forEach(key => {
      if (newData[key] !== selectedItem[key]) {
        changedFields[key] = newData[key];
      }
    });

    setChanges(changedFields);
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

  const clearMessage = () => {
    setMessage(null);
  };

  return {
    displayItem,
    isSaving,
    message,
    clearMessage,
    hasLocalChanges: Object.keys(changes).length > 0,
    handleChange,
    saveChanges,
  };
};