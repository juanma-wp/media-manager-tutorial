import { __ } from "@wordpress/i18n";
import { pencil, trash, download } from "@wordpress/icons";
import Edit from "./EditMedia";

export const actions = [
  {
    id: "edit",
    label: __("Edit"),
    isPrimary: true,
    icon: pencil,
    modalHeader: __("Edit Media Details"),
    RenderModal: ({ items: [item], closeModal }) => {
      return <Edit item={item} closeModal={closeModal} />;
    },
  },
  {
    id: "download",
    label: __("Download"),
    icon: download,
    callback: (items) => {
      items.forEach((item) => {
        const link = document.createElement("a");
        link.href = item.source_url;
        link.download = item.media_details?.file || "download";
        link.click();
      });
    },
    supportsBulk: true,
  },
  {
    id: "view",
    label: __("View attachment page"),
    callback: ([item]) => {
      window.open(item.link, "_blank");
    },
  },
];
