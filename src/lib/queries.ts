import { supabase } from "@/integrations/supabase/client";
import type { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  bikes: ["bikes", "active"] as const,
  activeOffer: ["offers", "active"] as const,
};

export async function fetchActiveBikes() {
  const { data, error } = await supabase
    .from("bikes")
    .select("*, bike_images(image_url, caption, is_cover, display_order)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveOffer() {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Warm the cache as soon as the app boots so the first paint already has data. */
export function prefetchInitialData(qc: QueryClient) {
  qc.prefetchQuery({ queryKey: queryKeys.bikes, queryFn: fetchActiveBikes });
  qc.prefetchQuery({ queryKey: queryKeys.activeOffer, queryFn: fetchActiveOffer });
}