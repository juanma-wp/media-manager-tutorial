import { useState, useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";

/**
 * Hook for editing media attachments
 * Tracks local changes and saves them to WordPress
 */
export const useMediaEditor = (selectedItem) => {
  // Single state object with all editor state
  const [state, setState] = useState({
    changes: {},      // Unsaved changes
    isSaving: false,  // Loading state
    message: null     // Success/error messages
  });

  const { editEntityRecord, saveEditedEntityRecord } = useDispatch("core");

  // Clear everything when switching items
  useEffect(() => {
    setState({ changes: {}, isSaving: false, message: null });
  }, [selectedItem?.id]);

  // Track what changed compared to original
  const handleChange = (newData) => {
    if (!selectedItem) return;

    // Only keep fields that actually changed
    const changedFields = {};
    for (const [key, value] of Object.entries(newData)) {
      if (value !== selectedItem[key]) {
        changedFields[key] = value;
      }
    }
    setState(prev => ({ ...prev, changes: changedFields }));
  };

  // Save changes to WordPress
  const saveChanges = async () => {
    if (!selectedItem || Object.keys(state.changes).length === 0) return;

    setState(prev => ({ ...prev, isSaving: true, message: null }));

    try {
      // Tell WordPress about the changes
      editEntityRecord("postType", "attachment", selectedItem.id, state.changes);

      // Actually save them
      const saved = await saveEditedEntityRecord("postType", "attachment", selectedItem.id);

      if (saved) {
        setState({ changes: {}, isSaving: false, message: { type: 'success', text: "Changes saved!" } });
      } else {
        setState(prev => ({ ...prev, isSaving: false, message: { type: 'error', text: "Failed to save" } }));
      }
    } catch {
      setState(prev => ({ ...prev, isSaving: false, message: { type: 'error', text: "Failed to save" } }));
    }
  };

  return {
    // Merge original item with unsaved changes for display
    displayItem: selectedItem ? { ...selectedItem, ...state.changes } : null,
    isSaving: state.isSaving,
    message: state.message,
    clearMessage: () => setState(prev => ({ ...prev, message: null })),
    hasLocalChanges: Object.keys(state.changes).length > 0,
    handleChange,
    saveChanges,
  };
};