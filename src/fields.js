import { __ } from "@wordpress/i18n";
import { dateI18n } from "@wordpress/date";

/**
 * Media field definitions - Starting with DataViews properties
 * We'll enhance these with DataForm properties later
 */
export const fields = [
  {
    // Common property: Unique identifier
    id: "thumbnail",

    // Common property: Display label
    label: __("Thumbnail"),

    getValue: ({ item }) => item.media_details.sizes.thumbnail.source_url,
    // DataViews: Disable sorting for image columns
    enableSorting: false,
    render: ({ item }) => {
      return <img src={item.source_url} alt={item.alt_text} />;
    },
    type: "media",
    description: __(
      "The URL of the image. This is the image that will be displayed in the media library."
    ),
  },
  {
    id: "title.raw",
    label: __("Title"),

    // Common property: Field type (useful for both components)
    type: "text",

    // DataViews: Enable search
    enableGlobalSearch: true,
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
    // NEW: DataForm properties
    setValue: ({ value }) => ({ alt_text: value }),
    description: __(
      "Describe the purpose of the image. Leave empty if the image is purely decorative."
    ),
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

    setValue: ({ value }) => ({ caption: value }),
  },
  {
    id: "description.raw",
    label: __("Description"),
    type: "text",

    enableHiding: true,
  },
  {
    id: "date",
    label: __("Date"),
    type: "datetime",

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

// Create a subset for editable fields
export const editableFields = fields.filter( field =>
    ['title.raw', 'alt_text', 'caption', 'description.raw'].includes( field.id )
);
