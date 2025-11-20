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
    filters: [
      // Example: Uncomment to filter by image types only
      // { field: "mime_type", operator: "isAny", value: ["image/jpeg", "image/png", "image/gif"] },
    ],
    fields: ["id", "caption", "filesize", "date", "mime_type", "alt_text"],
  });

  // Build query args from view filters and search
  const queryArgs = useMemo(() => {
    const filters = {};

    // Process filters
    view.filters.forEach((filter) => {
      // Handle MIME type filters
      if (filter.field === "mime_type") {
        if (filter.operator === "isAny" && filter.value?.length > 0) {
          // WordPress REST API doesn't support multiple mime types directly,
          // so we'll handle this client-side through filterSortAndPaginate
          filters.mime_type = filter.value;
        } else if (filter.operator === "is" && filter.value) {
          filters.mime_type = filter.value;
        }
      }

      // Handle date filters
      if (filter.field === "date") {
        if (filter.operator === "isAfter" && filter.value) {
          filters.after = filter.value;
        } else if (filter.operator === "isBefore" && filter.value) {
          filters.before = filter.value;
        }
      }

      // Note: Other filters like title, caption, etc. will be handled
      // client-side through filterSortAndPaginate since the WordPress
      // REST API has limited filter support for attachments
    });

    return {
      per_page: 100, // Get more items for client-side filtering
      _embed: true,
      order: view.sort?.direction,
      orderby: view.sort?.field === "date" ? "date" :
               view.sort?.field === "title.raw" ? "title" :
               view.sort?.field === "id" ? "id" : "date",
      search: view.search,
      ...filters,
    };
  }, [view.filters, view.search, view.sort]);

  // Get media from Gutenberg stores using useSelect
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
    [queryArgs] // Now depends on queryArgs which includes all filters
  );

  const isLoading = !hasResolved;

  // Process data for pagination and filtering
  // This handles client-side filtering for fields not supported by the REST API
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
