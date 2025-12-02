import { useState, useMemo } from "@wordpress/element";
import { DataViewsPicker, filterSortAndPaginate } from "@wordpress/dataviews/wp";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { pencil } from "@wordpress/icons";

// Import our custom hook
import { useMediaData } from "./hooks/useMediaData";

// Import our shared field definitions and form
import { fields } from "./fields";
import SidebarPanel from "./SidebarPanel";

import { useUsersData } from "./hooks/useUsersData";

const ViewMediaList = () => {
  
  const [view, setView] = useState({
    fields: ["author"],
    filters: [],
    mediaField: "thumbnail",
    page: 1,
    perPage: 10,
    search: "",
    titleField: "title.raw",
    descriptionField: "description.raw",
    type: "pickerGrid",
    layout: {
      previewSize: 120,
    },
  });

  // State for selection
  const [selection, setSelection] = useState([]);

  // State for sidebar panel
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);

  // Use our custom hook to fetch media data
  const { media, isLoading } = useMediaData({
    perPage: -1, // Get all items
    embed: true,
  });

  // Derive selected media from the fresh media array
  const selectedMedia = useMemo(() => {
    if (!selectedMediaIds || selectedMediaIds.length === 0) return null;
    // For single selection, return the item
    if (selectedMediaIds.length === 1) {
      return media.find((item) => item.id === selectedMediaIds[0]);
    }
    // For multiple selection, return array of items
    return media.filter((item) => selectedMediaIds.includes(item.id));
  }, [media, selectedMediaIds]);

  // All filtering, sorting, searching, and pagination handled client-side
  const { data: processedData, paginationInfo } = useMemo(() => {
    return filterSortAndPaginate(media, view, fields);
  }, [media, view, fields]);

  // Handlers for sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle selection change to select media and open sidebar
  const handleSelectionChange = (selectedIds) => {
    setSelection(selectedIds);

    if (selectedIds && selectedIds.length > 0) {
      // Store all selected IDs for bulk editing support
      setSelectedMediaIds(selectedIds.map((id) => parseInt(id)));
    } else {
      setSelectedMediaIds([]);
    }

    return false;
  };

  
  const { usersElements } = useUsersData();
  const filteredFields = useMemo(() => {
    
    // Add users to author field elements
    return fields.map((field) => {
      if (field.id === "author") {
        return {
          ...field,
          elements: usersElements
        };
      }
      return field;
    });
  }, [usersElements]);

  return (
    <div className="media-manager-layout">
      <div className="media-manager-main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>{__("Media Manager")}</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {media.length > 0 && (
              <span style={{ color: "#666" }}>
                {__(`${media.length} items`)}
              </span>
            )}
            {selectedMediaIds.length > 0 && (
              <span style={{ color: "#333", fontWeight: "bold" }}>
                {__(`${selectedMediaIds.length} selected`)}
              </span>
            )}
            <Button
              icon={pencil}
              onClick={toggleSidebar}
              variant="primary"
              label={isSidebarOpen ? __("Close sidebar") : __("Open sidebar")}
              isPressed={isSidebarOpen}
              disabled={selectedMediaIds.length === 0}
            >
              {selectedMediaIds.length > 1 ? __("Bulk Edit") : __("Edit")}
            </Button>
          </div>
        </div>

        <DataViewsPicker
          actions={[
            {
              supportsBulk: true,
            },
          ]}
          config={{
            perPageSizes: [10, 25, 50, 100],
            supportsBulkSelection: true,
          }}
          data={processedData}
          defaultLayouts={{
            pickerGrid: {},
          }}
          fields={filteredFields}
          getItemId={(item) => item.id.toString()}
          isLoading={isLoading}
          itemListLabel="Media Items"
          onChangeSelection={handleSelectionChange}
          onChangeView={setView}
          paginationInfo={paginationInfo}
          selection={selection}
          view={view}
        />
      </div>

      {/* Sidebar Panel */}
      {isSidebarOpen && (
        <SidebarPanel
          onClose={closeSidebar}
          selectedItems={selectedMedia}
          isBulkEdit={selectedMediaIds.length > 1}
        />
      )}
    </div>
  );
};

export default ViewMediaList;
