import { useEffect } from "react";

const SITE_URL = "https://filadelfomotors.com.br";

type SeoOptions = {
  title?: string;
  description?: string;
};

/**
 * Sets <link rel="canonical">, <title> and <meta name="description"> for the current page.
 * @param path Path beginning with "/" (e.g. "/sobre"). Pass "/" for home.
 */
export function useCanonical(path: string, options: SeoOptions = {}) {
  const { title, description } = options;

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

    if (title) {
      document.title = title;
    }

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [path, title, description]);
}
