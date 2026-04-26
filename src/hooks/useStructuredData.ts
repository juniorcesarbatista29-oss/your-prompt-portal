import { useEffect } from "react";

/**
 * Injects a JSON-LD <script type="application/ld+json"> into <head>
 * tagged with a unique id so it can be replaced/removed cleanly.
 *
 * Pass `null` as data to skip injection (e.g. while loading).
 *
 * @param id   Unique DOM id for this JSON-LD block (e.g. "ld-home-cardealer")
 * @param data Plain JSON-LD object (will be JSON.stringify'd)
 */
export function useStructuredData(
  id: string,
  data: Record<string, unknown> | null,
) {
  useEffect(() => {
    if (!data) return;
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      script?.remove();
    };
  }, [id, data]);
}
