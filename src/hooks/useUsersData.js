import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";

/**
 * Hook for fetching WordPress users
 */
export const useUsersData = () => {
  return useSelect(
    (select) => {
      const users = select(coreDataStore).getUsers({ per_page: -1 }) || [];

      return {
        users,
        usersElements: users.map(user => ({
          value: user.id,
          label: user.name || user.username || `User ${user.id}`
        })),
        isLoading: !select(coreDataStore).hasFinishedResolution("getUsers", [{ per_page: -1 }])
      };
    },
    []
  );
};