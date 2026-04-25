import { supabase } from "@/integrations/supabase/client";
import type { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  bikes: ["bikes", "active"] as const,
  activeOffer: ["offers", "active"] as const,
  siteSettings: ["site_settings"] as const,
  pageContent: (page: string) => ["page_content", page] as const,
  navLinks: (location: "header" | "footer") => ["nav_links", location] as const,
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

export async function fetchSiteSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchPageContent(page: string) {
  const { data, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("page", page)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchNavLinks(location: "header" | "footer") {
  const { data, error } = await supabase
    .from("nav_links")
    .select("*")
    .eq("location", location)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Warm the cache as soon as the app boots so the first paint already has data. */
export function prefetchInitialData(qc: QueryClient) {
  qc.prefetchQuery({ queryKey: queryKeys.bikes, queryFn: fetchActiveBikes });
  qc.prefetchQuery({ queryKey: queryKeys.activeOffer, queryFn: fetchActiveOffer });
  qc.prefetchQuery({ queryKey: queryKeys.siteSettings, queryFn: fetchSiteSettings });
  qc.prefetchQuery({ queryKey: queryKeys.pageContent("home"), queryFn: () => fetchPageContent("home") });
  qc.prefetchQuery({ queryKey: queryKeys.navLinks("header"), queryFn: () => fetchNavLinks("header") });
  qc.prefetchQuery({ queryKey: queryKeys.navLinks("footer"), queryFn: () => fetchNavLinks("footer") });
}
