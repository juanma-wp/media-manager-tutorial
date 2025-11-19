import { useState, useEffect, useMemo } from "@wordpress/element";
import { DataViews, filterSortAndPaginate } from "@wordpress/dataviews/wp";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";

// Import our shared field definitions and actions
import { fields } from "./fields";
import { actions } from "./actions";

// Configure apiFetch
apiFetch.use(apiFetch.createNonceMiddleware(window.mediaManagerData?.nonce));

const ViewMediaList = () => {
  const [view, setView] = useState({
    type: "grid",
    perPage: 20,
    page: 1,
    sort: {
      field: "date",
      direction: "desc",
    },
    titleField: "title.raw",
    descriptionField: "description.raw",
    mediaField: "thumbnail",
    search: "",
    fields: ["caption","filesize", "date","mime_type","alt_text"],
  });

  // Get media from Redux store using useSelect
  const { media, hasResolved } = useSelect(
    (select) => {
      const query = {
        per_page: 100,
        _embed: true,
      };

      // Add search if provided in view
      if (view.search) {
        query.search = view.search;
      }

      const selectorArgs = ["postType", "attachment", query];

      return {
        media: select(coreDataStore).getEntityRecords(
          "postType",
          "attachment",
          query
        ) || [],
        hasResolved: select(coreDataStore).hasFinishedResolution(
          "getEntityRecords",
          selectorArgs
        ),
      };
    },
    [view.search]
  );

  const isLoading = !hasResolved;

  // Process data for pagination and filtering
  const { data: processedData, paginationInfo } = useMemo(() => {
    return filterSortAndPaginate(media, view, fields);
  }, [media, view, fields]);

  
  console.log({ processedData, fields, view });
  // Define available layouts
  const defaultLayouts = {
    table: {},
    grid: {},
    list: {},
  };



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
