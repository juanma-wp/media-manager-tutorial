import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { pencil, trash, download } from "@wordpress/icons";

export const actions = [
  {
    id: "edit",
    label: __("Edit"),
    isPrimary: true,
    icon: pencil,
    callback: ([item]) => {
      setEditingItem(item);
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
