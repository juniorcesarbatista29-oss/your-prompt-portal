import { useEffect } from "react";

const SITE_URL = "https://filadelfomotors.com.br";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

type SeoOptions = {
  title?: string;
  description?: string;
  /** Absolute or root-relative URL of the social-share image */
  image?: string;
  /** og:type — defaults to "website" */
  type?: "website" | "article" | "product";
};

/** Upsert a <meta> tag by attribute (name or property). */
function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets per-route SEO tags: <title>, <meta name="description">,
 * <link rel="canonical"> and Open Graph / Twitter Card metadata.
 *
 * @param path Path beginning with "/" (e.g. "/sobre"). Pass "/" for home.
 */
export function useCanonical(path: string, options: SeoOptions = {}) {
  const { title, description, image, type = "website" } = options;

  useEffect(() => {
    const normalized =
      path === "/" ? "" : "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
    const href = `${SITE_URL}${normalized}`;

    // Canonical link
    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);

    // Title
    if (title) {
      document.title = title;
      upsertMeta("property", "og:title", title);
      upsertMeta("name", "twitter:title", title);
    }

    // Description
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }

    // Canonical URL in social tags
    upsertMeta("property", "og:url", href);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", "Filadelfo Motors");
    upsertMeta("property", "og:locale", "pt_BR");

    // Image
    const resolvedImage = image
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
      : DEFAULT_OG_IMAGE;
    upsertMeta("property", "og:image", resolvedImage);
    upsertMeta("name", "twitter:image", resolvedImage);
    upsertMeta("name", "twitter:card", "summary_large_image");
  }, [path, title, description, image, type]);
}
