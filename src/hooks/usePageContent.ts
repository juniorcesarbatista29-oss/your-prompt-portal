import { useQuery } from "@tanstack/react-query";
import { fetchPageContent, queryKeys } from "@/lib/queries";

type Block = {
  block_key: string;
  text_value: string | null;
  long_text_value: string | null;
  image_url: string | null;
  link_url: string | null;
};

/**
 * Returns a getter `t(key, fallback)` that reads CMS content for the given page,
 * falling back to the provided default while loading or when the block is empty.
 */
export function usePageContent(page: string) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.pageContent(page),
    queryFn: () => fetchPageContent(page),
  });

  const map = new Map<string, Block>();
  (data ?? []).forEach((b: any) => map.set(b.block_key, b));

  const t = (key: string, fallback = "") => {
    const b = map.get(key);
    return b?.text_value || b?.long_text_value || fallback;
  };
  const img = (key: string, fallback = "") => map.get(key)?.image_url || fallback;
  const link = (key: string, fallback = "") => map.get(key)?.link_url || fallback;

  return { t, img, link, isLoading };
}
