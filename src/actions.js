import { __ } from "@wordpress/i18n";
import { pencil, trash, download } from "@wordpress/icons";
import { useState } from "@wordpress/element";
import { VStack, HStack, Text, SelectControl, Button } from "@wordpress/components";

export const getActions = (setEditingItem) => [
  {
    id: "edit",
    label: __("Edit"),
    isPrimary: true,
    icon: pencil,
    modalHeader: __("See Original Image", "action label"),
    RenderModal: ({ items: [item], closeModal }) => {
      const [size, setSize] = useState("raw");
      return (
        <VStack spacing="5">
          <Text>{`Select the size you want to open for "${item.slug}"`}</Text>
          <HStack justify="left">
            <SelectControl
              __nextHasNoMarginBottom
              label="Size"
              value={size}
              options={Object.keys(item.urls)
                .filter((url) => url !== "small_s3")
                .map((url) => ({
                  label: url,
                  value: url,
                }))}
              onChange={setSize}
            />
          </HStack>
          <HStack justify="right">
            <Button
              __next40pxDefaultSize
              variant="primary"
              onClick={() => {
                closeModal();
                window.open(item.urls[size], "_blank");
              }}
            >
              Open image from original location
            </Button>
          </HStack>
        </VStack>
      );
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
    label: __("View attachment details"),
    callback: ([item]) => {
      const link = `https://new-for-devs-wp-6-9.wp.local/wp-admin/upload.php?item=${item.id}`;
      window.open(link, "_blank");
    },
  },
];
