import { useState, useEffect, useMemo } from "@wordpress/element";
import { DataViews, filterSortAndPaginate } from "@wordpress/dataviews/wp";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";

// Import our shared field definitions and actions
import { fields } from "./fields";
import { actions } from "./actions";

// "defaultLayouts" definition
const primaryField = 'id';
const mediaField = "thumbnail";

const defaultLayouts = {
	table: {
		layout: {
			primaryField,
		},
	},
	grid: {
		layout: {
			primaryField,
			mediaField,
		},
	},
};


const ViewMediaList = () => {
  const [view, setView] = useState({
    type: "table",
    perPage: 20,
    layout: defaultLayouts.table.layout,
    page: 1,
    sort: {
      field: "date",
      direction: "desc",
    },
    titleField: "title.raw",
    descriptionField: "description.raw",
    mediaField: "thumbnail",
    search: "",
    filters: [],
    fields: ["id", "caption", "filesize", "date", "mime_type", "alt_text"],
  });

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
  // filterSortAndPaginate processes the view's filters, search, sort, and page settings
  const { data: processedData, paginationInfo } = useMemo(() => {
    return filterSortAndPaginate(media, view, fields);
  }, [media, view, fields]);


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>{__("Media Manager")}</h1>
        <div style={{ color: "#666" }}>
          {media.length > 0 && <span>{__(`${media.length} items`)}</span>}
        </div>
      </div>

      <DataViews
        data={processedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        defaultLayouts={defaultLayouts}
        actions={actions}
        isLoading={isLoading}
        paginationInfo={paginationInfo}
        getItemId={(item) => item.id}
      />
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
