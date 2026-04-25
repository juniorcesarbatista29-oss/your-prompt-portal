import { useQuery } from "@tanstack/react-query";
import { fetchNavLinks, queryKeys } from "@/lib/queries";

export function useNavLinks(location: "header" | "footer") {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.navLinks(location),
    queryFn: () => fetchNavLinks(location),
  });
  return { links: data ?? [], isLoading };
}
