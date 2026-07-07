import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./profileApi";
import { profileQueryKeys } from "./profileQueryKeys";

export const useProfilesQuery = () => useQuery({
  queryKey: profileQueryKeys.all,
  queryFn: () => profileApi.getAll(),
});