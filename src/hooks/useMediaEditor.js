import { useState, useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";

/**
 * Simple hook for handling media editing operations
 */
export const useMediaEditor = (selectedItem) => {
  const [modifiedItem, setModifiedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreDataStore);

  // Reset modified item when selected item changes
  useEffect(() => {
    setModifiedItem(null);
    setMessage(null);
  }, [selectedItem?.id]);

  // Use modified item or original
  const displayItem = modifiedItem || selectedItem;

  const handleChange = (newData) => {
    setModifiedItem(newData);
  };

  const saveChanges = async () => {
    if (!selectedItem || !modifiedItem) return;

    setIsSaving(true);
    setMessage(null);

    try {
      editEntityRecord("postType", "attachment", selectedItem.id, modifiedItem);

      const updatedRecord = await saveEditedEntityRecord(
        "postType",
        "attachment",
        selectedItem.id
      );

      if (updatedRecord) {
        setMessage({ type: 'success', text: "Changes saved successfully!" });
        setModifiedItem(null);
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

  // Has changes if there's a modified item
  const hasLocalChanges = !!modifiedItem;

  return {
    displayItem,
    isSaving,
    message,
    clearMessage,
    hasLocalChanges,
    handleChange,
    saveChanges,
  };
};