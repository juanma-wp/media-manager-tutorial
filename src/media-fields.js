import { __ } from "@wordpress/i18n";
import { dateI18n } from "@wordpress/date";

/**
 * Media field definitions - Starting with DataViews properties
 * We'll enhance these with DataForm properties later
 */
export const mediaFields = [
  {
    // Common property: Unique identifier
    id: "thumbnail",

    // Common property: Display label
    label: __("Thumbnail"),

    // DataViews: Disable sorting for image columns
    enableSorting: false,

    // DataViews: Custom render for display
    render: ({ item }) => {
      const thumbnailUrl =
        item.media_details?.sizes?.thumbnail?.source_url || item.source_url;
      return (
        <img
          src={thumbnailUrl}
          alt={item.alt_text || ""}
          className="media-thumbnail"
        />
      );
    },
  },
  {
    id: "title",
    label: __("Title"),

    // Common property: Field type (useful for both components)
    type: "text",

    // DataViews: Enable search
    enableGlobalSearch: true,

    // Common property: Extract value from data
    getValue: ({ item }) => item.title?.rendered || "",

    // DataViews: Custom display
    render: ({ item }) => {
      const title = item.title?.rendered || __("(no title)");
      return (
        <div>
          <strong>{title}</strong>
          <div className="media-filename">
            {item.media_details?.file || item.source_url.split("/").pop()}
          </div>
        </div>
      );
    },
  },
  {
    id: "alt_text",
    label: __("Alternative Text"),
    type: "text",

    // DataViews: Enable search
    enableGlobalSearch: true,

    // Common property: Extract value
    getValue: ({ item }) => item.alt_text || "",

    // DataViews: Visual indication when empty
    render: ({ item }) => {
      const altText = item.alt_text || "";
      return (
        <span
          style={{
            color: altText ? "inherit" : "#999",
            fontStyle: altText ? "normal" : "italic",
          }}
        >
          {altText || __("No alt text")}
        </span>
      );
    },
  },
  {
    id: "caption",
    label: __("Caption"),
    type: "text",

    getValue: ({ item }) => {
      const caption = item.caption?.rendered || "";
      // Strip HTML for search/sort operations
      return caption.replace(/<[^>]*>/g, "");
    },

    // DataViews: Render HTML content safely
    render: ({ item }) => {
      const caption = item.caption?.rendered || "";
      return caption ? (
        <div dangerouslySetInnerHTML={{ __html: caption }} />
      ) : (
        <span style={{ color: "#999", fontStyle: "italic" }}>
          {__("(empty)")}
        </span>
      );
    },

    // DataViews: Allow hiding this column
    enableHiding: true,
    enableGlobalSearch: true,
  },
  {
    id: "date",
    label: __("Date"),
    type: "datetime",

    getValue: ({ item }) => item.date,

    // DataViews: Format date for display
    render: ({ item }) => dateI18n("M j, Y", item.date),

    // DataViews: Enable sorting
    enableSorting: true,
  },
  {
    id: "filesize",
    label: __("File Size"),
    type: "integer",

    getValue: ({ item }) => item.media_details?.filesize || 0,

    // DataViews: Human-readable file size
    render: ({ item }) => {
      const size = item.media_details?.filesize || 0;
      return formatFileSize(size);
    },
  },
  {
    id: "mime_type",
    label: __("Type"),

    getValue: ({ item }) => item.mime_type,

    // Elements for filtering
    elements: [
      { value: "image/jpeg", label: "JPEG" },
      { value: "image/png", label: "PNG" },
      { value: "image/gif", label: "GIF" },
      { value: "image/webp", label: "WebP" },
      { value: "application/pdf", label: "PDF" },
    ],

    // DataViews: Configure filtering
    filterBy: {
      operators: ["is", "isNot"],
      isPrimary: true,
    },
  },
];

// Helper function
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
