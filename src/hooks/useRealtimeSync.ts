import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/queries";

/**
 * Subscribes to realtime changes on public content tables and invalidates
 * the matching React Query caches so the site reflects admin edits instantly.
 */
export function useRealtimeSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("public-content-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "bikes" }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.bikes });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "bike_images" }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.bikes });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "offers" }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.activeOffer });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.siteSettings });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "page_content" }, (payload) => {
        const row = (payload.new ?? payload.old) as { page?: string } | null;
        if (row?.page) {
          qc.invalidateQueries({ queryKey: queryKeys.pageContent(row.page) });
        } else {
          qc.invalidateQueries({ queryKey: ["page_content"] });
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "nav_links" }, () => {
        qc.invalidateQueries({ queryKey: queryKeys.navLinks("header") });
        qc.invalidateQueries({ queryKey: queryKeys.navLinks("footer") });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}
