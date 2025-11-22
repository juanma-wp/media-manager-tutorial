export const form = {
  layout: {
    type: "panel",
  },
  fields: [
    {
      id: "thumbnail",
      layout: {
        type: "panel",
        labelPosition: "none",
      },
    },
    {
      id: "title.raw",
      layout: {
        type: "panel",
        labelPosition: "none",
      },
    },
    "alt_text",
    "caption.raw",
    "description.raw",
    "date",
    {
      id: "fileInfo",

      layout: {
        type: "row",
        alignment: "center",
      },
      children: ["filesize", "mime_type", "width", "height"],
    },
  ],
};