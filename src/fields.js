import { __ } from "@wordpress/i18n";
import { dateI18n } from "@wordpress/date";

/**
 * Media field definitions - Enhanced for both DataViews and DataForm
 * Showcasing WordPress 6.9 field types and validation features
 */
export const fields = [
  {
    id: "id",
    label: __("ID"),
    type: "integer",
    enableSorting: true,
    enableGlobalSearch: true,
  },
  {
    // Common property: Unique identifier
    id: "thumbnail",

    // Common property: Display label
    label: __("Thumbnail"),

    getValue: ({ item }) => {
      if (!item) return '';
      return item?.media_details?.sizes?.medium?.source_url || '';
    },
    render: ({ item }) => {
      return (
        <img
          height="100%"
          width="100%"
          src={item.source_url}
          alt={item.alt_text}
        />
      );
    },
    readOnly: true,
    type: "media",
    description: __(
      "The URL of the image. This is the image that will be displayed in the media library."
    ),
    readOnly: true,
  },
  {
    id: "title.raw",
    label: __("Title"),

    // Common property: Field type (useful for both components)
    type: "text",

    // DataViews: Enable search
    enableGlobalSearch: true,
    enableSorting: true,
    filterBy: {
      operators: ["contains", "notContains", "is", "isNot"],
    },
    isValid: {
      required: true,
      elements: true,
      custom: validateTitle,
    },
  },
  {
    id: "alt_text",
    label: __("Alternative Text"),
    type: "text",

    // DataViews: Enable search
    enableGlobalSearch: true,
    filterBy: {
      operators: ["contains", "notContains"],
    },

    description: __(
      "Describe the purpose of the image. Leave empty if the image is purely decorative."
    ),
  },
  {
    id: "caption.raw",
    label: __("Caption"),
    type: "text",

    // DataViews: Allow hiding this column
    enableHiding: true,
    enableGlobalSearch: true,
    filterBy: {
      operators: ["contains", "notContains"],
    },
  },
  {
    id: "description.raw",
    label: __("Description"),
    type: "text",

    enableHiding: true,
    filterBy: {
      operators: ["contains", "notContains"],
    },
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
    readOnly: true,
    getValue: ({ item }) => {
      const [size] = formatFileSize(item.media_details?.filesize || 0);
      return size;
    },

    // DataViews: Human-readable file size
    render: ({ item }) => {
      const size = item.media_details?.filesize || 0;
      return formatFileSize(size);
    },
    enableSorting: true,
  },
  {
    id: "mime_type",
    label: __("Type"),
    type: "text",
    readOnly: true,
    // Elements for filtering
    elements: [
      { value: "image/jpeg", label: "JPEG" },
      { value: "image/png", label: "PNG" },
      { value: "image/gif", label: "GIF" },
      { value: "image/webp", label: "WebP" },
      { value: "image/svg+xml", label: "SVG" },
      { value: "video/mp4", label: "MP4 Video" },
      { value: "application/pdf", label: "PDF" },
      { value: "application/zip", label: "ZIP" },
    ],

    // DataViews: Configure filtering
    filterBy: {
      operators: ["is", "isNot", "isAny", "isNone"],
    },
    enableSorting: true,
  },
  {
    id: "width",
    label: __("Width"),
    type: "integer",
    getValue: ({ item }) => item.media_details?.width || 0,
    render: ({ item }) => {
      const width = item.media_details?.width;
      return width ? `${width}px` : "-";
    },
    readOnly: true,
    enableSorting: true,
  },
  {
    id: "height",
    label: __("Height"),
    type: "integer",
    getValue: ({ item }) => item.media_details?.height || 0,
    render: ({ item }) => {
      const height = item.media_details?.height;
      return height ? `${height}px` : "-";
    },
    readOnly: true,
    enableSorting: true,
  },
];

// Helper function
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return [parseInt(Math.round((bytes / Math.pow(k, i)) * 100) / 100, 10), sizes[i]];
}

function validateTitle({title: { raw: value }}) {
  if (!value || value.trim() === '') {
    return __('Title is required');
  }
  if (value.length < 5) {
    return __('Title must be at least 5 characters long');
  }
  if (value.length > 100) {
    return __('Title must be less than 100 characters');
  }
  // Check for special characters
  const specialCharsRegex = /[<>]/;
  if (specialCharsRegex.test(value)) {
    return __('Title cannot contain < or > characters');
  }
  return true;
};