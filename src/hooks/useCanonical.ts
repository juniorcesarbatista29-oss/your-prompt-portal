import { useEffect } from "react";

const SITE_URL = "https://filadelfomotors.com.br";

/**
 * Sets <link rel="canonical"> for the current page.
 * @param path Path beginning with "/" (e.g. "/sobre"). Pass "/" for home.
 */
export function useCanonical(path: string) {
  useEffect(() => {
    const normalized =
      path === "/" ? "" : "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
    const href = `${SITE_URL}${normalized}`;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }, [path]);
}
