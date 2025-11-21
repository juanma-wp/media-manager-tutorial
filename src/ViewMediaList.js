import { useState, useMemo } from "@wordpress/element";
import { DataViewsPicker, filterSortAndPaginate } from "@wordpress/dataviews/wp";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { drawerRight } from "@wordpress/icons";

// Import our shared field definitions and form
import { fields } from "./fields";
import { form } from "./form";
import SidebarPanel from "./SidebarPanel";

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
  });

  // State for selection
  const [selection, setSelection] = useState([]);

  // State for sidebar panel
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Simple query to get all media - filtering/sorting handled client-side
  const queryArgs = useMemo(() => ({
    per_page: -1, // Get all items
    _embed: true,
  }), []);

  // Get all media from WordPress stores
  const { media, hasResolved } = useSelect(
    (select) => {
      const selectorArgs = ["postType", "attachment", queryArgs];

      return {
        media: select(coreDataStore).getEntityRecords(
          "postType",
          "attachment",
          queryArgs
        ) || [],
        hasResolved: select(coreDataStore).hasFinishedResolution(
          "getEntityRecords",
          selectorArgs
        ),
      };
    },
    [queryArgs]
  );

  const isLoading = !hasResolved;

  // All filtering, sorting, searching, and pagination handled client-side
  const { data: processedData, paginationInfo } = useMemo(() => {
    // Make sure we have valid data
    if (!media || media.length === 0) {
      return {
        data: [],
        paginationInfo: {
          totalItems: 0,
          totalPages: 0,
        },
      };
    }
    return filterSortAndPaginate(media, view, fields);
  }, [media, view, fields]);

  // Handlers for sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedMedia(null);
  };

  // Handle selection change to select media and open sidebar
  const handleSelectionChange = (selectedIds) => {
    setSelection(selectedIds);

    if (selectedIds && selectedIds.length > 0) {
      // Find the selected item from the media array
      const selectedItem = media.find(item => item.id === parseInt(selectedIds[0]));
      if (selectedItem) {
        setSelectedMedia(selectedItem);
      }
    } 

    return false;
  };

  // Handle form changes
  const handleFormChange = (updatedItem) => {
    setSelectedMedia(updatedItem);
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
  // console.log("selectedMedia", selectedMedia);

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
              icon={drawerRight}
              onClick={toggleSidebar}
              variant="secondary"
              label={isSidebarOpen ? __("Close sidebar") : __("Open sidebar")}
              isPressed={isSidebarOpen}
            />
          </div>
        </div>

        <DataViewsPicker
          actions={[{
            supportsBulk: false,
          }]}
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
        <SidebarPanel
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          title={
            selectedMedia
              ? selectedMedia.title?.rendered || __("Untitled Media")
              : __("Select a page to edit")
          }
          selectedItem={selectedMedia}
          fields={fields}
          form={form}
          onChange={handleFormChange}
        >
          {!selectedMedia && (
            <p style={{ padding: "20px", color: "#666" }}>
              {__("Select a page to edit")}
            </p>
          )}
        </SidebarPanel>
      )}
    </div>
  );
};

// Helper function
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export default ViewMediaList;
