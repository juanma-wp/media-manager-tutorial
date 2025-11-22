import { useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";

/**
 * Simple hook for fetching media data from WordPress
 */
export const useMediaData = (options = {}) => {
  const queryArgs = useMemo(() => ({
    per_page: options.perPage || -1,
    _embed: options.embed !== false,
  }), [options.perPage, options.embed]);

  return useSelect(
    (select) => {
      const selectorArgs = ["postType", "attachment", queryArgs];

      return {
        media: select(coreDataStore).getEntityRecords("postType", "attachment", queryArgs) || [],
        hasResolved: select(coreDataStore).hasFinishedResolution("getEntityRecords", selectorArgs),
        isLoading: select(coreDataStore).isResolving("getEntityRecords", selectorArgs),
      };
    },
    [queryArgs]
  );
};