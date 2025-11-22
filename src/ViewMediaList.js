import { useState, useMemo } from "@wordpress/element";
import { DataViewsPicker, filterSortAndPaginate } from "@wordpress/dataviews/wp";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { pencil } from "@wordpress/icons";

// Import our custom hook
import { useMediaData } from "./hooks/useMediaData";

// Import our shared field definitions and form
import { fields } from "./fields";
import { form } from "./form";
import EditMediaSidebarPanel from "./EditMediaSidebarPanel";

const ViewMediaList = () => {
  const [view, setView] = useState({
    fields: [],
    filters: [],
    groupByField: undefined,
    infiniteScrollEnabled: undefined,
    mediaField: "thumbnail",
    page: 1,
    perPage: 10,
    search: "",
    titleField: "title.raw",
    descriptionField: "description.raw",
    type: "pickerGrid",
    layout: {
      previewSize: 120
    },
  });

  // State for selection
  const [selection, setSelection] = useState([]);

  // State for sidebar panel
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Use our custom hook to fetch media data
  const { media, isLoading, hasResolved } = useMediaData({
    perPage: -1, // Get all items
    embed: true,
  });

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
      // Find the selected item from the media array
      const selectedItem = media.find(
        (item) => item.id === parseInt(selectedIds[0])
      );
      if (selectedItem) {
        setSelectedMedia(selectedItem);
      }
    } else {
      setSelectedMedia(null);
    }

    return false;
  };

  // Handle form changes
  const handleFormChange = (updatedItem) => {
    setSelectedMedia(updatedItem);
    console.log("updatedItem from ViewMediaList", updatedItem);
    // Here you would typically also update the media in the backend
    // For now, we'll just update the local state
  };

  // console.log("processedData", processedData);
  // console.log("paginationInfo", paginationInfo);
  // console.log("selection", selection);
  // console.log("view", view);
  // console.log("media", media);
  // console.log("hasResolved", hasResolved);
  // console.log("isLoading", isLoading);
  // console.log("isSidebarOpen", isSidebarOpen);
  //console.log("selectedMedia", selectedMedia);

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
            <Button
              icon={pencil}
              onClick={toggleSidebar}
              variant="primary"
              label={isSidebarOpen ? __("Close sidebar") : __("Open sidebar")}
              isPressed={isSidebarOpen}
            >
              Edit
            </Button>
          </div>
        </div>

        <DataViewsPicker
          actions={[
            {
              supportsBulk: false,
            },
          ]}
          config={{
            perPageSizes: [10, 25, 50, 100],
          }}
          data={processedData}
          defaultLayouts={{
            pickerGrid: {},
          }}
          fields={fields}
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
        <EditMediaSidebarPanel
          onClose={closeSidebar}
          selectedItem={selectedMedia}
          onChange={handleFormChange}
        />
      )}
    </div>
  );
};

export default ViewMediaList;
