import { useState, useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";

/**
 * Hook for editing media attachments
 * Tracks local changes and saves them to WordPress
 * Supports bulk editing of multiple items
 */
export const useMediaEditor = (selectedItems, isBulkEdit = false) => {
  // Single state object with all editor state
  const [state, setState] = useState({
    changes: {},      // Unsaved changes
    isSaving: false,  // Loading state
    message: null     // Success/error messages
  });

  const { editEntityRecord, saveEditedEntityRecord } = useDispatch("core");

  // Get the first item for single edit, or use selectedItems for bulk
  const selectedItem = isBulkEdit ? null : selectedItems;

  // Clear everything when switching items
  useEffect(() => {
    setState({ changes: {}, isSaving: false, message: null });
  }, [selectedItem?.id, isBulkEdit, Array.isArray(selectedItems) ? selectedItems.length : 0]);

  // Track what changed compared to original
  const handleChange = (newData) => {
    if (!selectedItem && !isBulkEdit) return;

    if (isBulkEdit) {
      // For bulk edit, track all changes without comparing to original
      setState(prev => ({ ...prev, changes: newData }));
    } else {
      // Only keep fields that actually changed
      const changedFields = {};
      for (const [key, value] of Object.entries(newData)) {
        if (value !== selectedItem[key]) {
          changedFields[key] = value;
        }
      }
      setState(prev => ({ ...prev, changes: changedFields }));
    }
  };

  // Save changes to WordPress
  const saveChanges = async () => {
    if ((!selectedItem && !isBulkEdit) || Object.keys(state.changes).length === 0) return;

    setState(prev => ({ ...prev, isSaving: true, message: null }));

    try {
      if (isBulkEdit && Array.isArray(selectedItems)) {
        // Bulk save - apply changes to all selected items
        const savePromises = selectedItems.map(async (item) => {
          editEntityRecord("postType", "attachment", item.id, state.changes);
          return saveEditedEntityRecord("postType", "attachment", item.id);
        });

        const results = await Promise.all(savePromises);
        const allSaved = results.every(saved => saved);

        if (allSaved) {
          setState({ changes: {}, isSaving: false, message: { type: 'success', text: `${selectedItems.length} items updated successfully!` } });
        } else {
          setState(prev => ({ ...prev, isSaving: false, message: { type: 'error', text: "Some items failed to save" } }));
        }
      } else {
        // Single save
        editEntityRecord("postType", "attachment", selectedItem.id, state.changes);
        const saved = await saveEditedEntityRecord("postType", "attachment", selectedItem.id);

        if (saved) {
          setState({ changes: {}, isSaving: false, message: { type: 'success', text: "Changes saved!" } });
        } else {
          setState(prev => ({ ...prev, isSaving: false, message: { type: 'error', text: "Failed to save" } }));
        }
      }
    } catch {
      setState(prev => ({ ...prev, isSaving: false, message: { type: 'error', text: "Failed to save" } }));
    }
  };

  // For bulk edit, create a display item with common values or placeholders
  const getBulkDisplayItem = () => {
    if (!isBulkEdit || !Array.isArray(selectedItems) || selectedItems.length === 0) return null;

    // Check which fields have the same value across all selected items
    const bulkItem = {};

    // Fields that can be bulk edited
    const bulkEditableFields = ['author', 'date'];

    bulkEditableFields.forEach(fieldName => {
      // Check if all items have the same value for this field
      const firstValue = selectedItems[0][fieldName];
      let allSame;

      if (fieldName === 'date') {
        // For dates, compare just the date part (YYYY-MM-DD), ignoring time
        const getDateOnly = (dateString) => {
          if (!dateString) return null;
          return dateString.split('T')[0]; // Get just the date part
        };

        const firstDateOnly = getDateOnly(firstValue);
        allSame = selectedItems.every(item => getDateOnly(item[fieldName]) === firstDateOnly);

        // Debug logging for date field
        console.log('Date comparison:', {
          firstValue,
          firstDateOnly,
          allValues: selectedItems.map(item => item[fieldName]),
          allDatesOnly: selectedItems.map(item => getDateOnly(item[fieldName])),
          allSame
        });
      } else {
        allSame = selectedItems.every(item => item[fieldName] === firstValue);
      }

      if (allSame && firstValue !== undefined && firstValue !== null) {
        // If all items have the same value, show it
        bulkItem[fieldName] = firstValue;
      } else {
        // If values differ, show a placeholder
        // For author (numeric field), use null; for date (string field), use '-'
        bulkItem[fieldName] = fieldName === 'author' ? null : '-';
      }
    });

    // Apply any changes made during editing
    return { ...bulkItem, ...state.changes };
  };

  return {
    // Merge original item with unsaved changes for display
    displayItem: isBulkEdit
      ? getBulkDisplayItem()
      : selectedItem
        ? { ...selectedItem, ...state.changes }
        : null,
    isSaving: state.isSaving,
    message: state.message,
    clearMessage: () => setState(prev => ({ ...prev, message: null })),
    hasLocalChanges: Object.keys(state.changes).length > 0,
    handleChange,
    saveChanges,
  };
};