export const form = {
  layout: { type: "card" },
  fields: [
    // Row layout for title and alt text
    {
      id: "title-and-alt",
      children: [
        {
          id: "title.raw",
          layout: { type: "panel", labelPosition: "top" },
        },
        "alt_text",
      ],
      layout: {
        type: "row",
        alignment: "center",
      },
    },
    // Card layout for media metadata
    {
      id: "metadata",
      label: "Media Metadata",
      layout: {
        type: "card",
        isOpened: false,
        isCollapsible: true,
      },
      children: ["caption.raw", "description.raw"],
    },
    // Panel layout for credits and licensing
    // Row layout for file info
    {
      id: "fileInfo",
      label: "File Information",
      layout: {
        type: "row",
      },
      children: ["filesize", "width", "height", "mime_type"],
    },
  ],
};
