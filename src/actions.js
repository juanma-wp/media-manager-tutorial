import { __ } from "@wordpress/i18n";
import { download } from "@wordpress/icons";

export const actions = [
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
    supportsBulk: false,
  },
  {
    id: "view",
    label: __("View attachment details"),
    callback: ([item]) => {
      const link = `https://new-for-devs-wp-6-9.wp.local/wp-admin/upload.php?item=${item.id}`;
      window.open(link, "_blank");
    },
  },
];
