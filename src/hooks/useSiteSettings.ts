import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings, queryKeys } from "@/lib/queries";

export function useSiteSettings() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.siteSettings,
    queryFn: fetchSiteSettings,
  });
  return { settings: data, isLoading };
}
