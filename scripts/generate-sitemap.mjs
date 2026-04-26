/**
 * Gera public/sitemap.xml com:
 *   - Páginas estáticas (/, /catalogo, /sobre)
 *   - Uma entrada por bicicleta ativa em formato deep-link
 *     (/catalogo?bike=<slug>) — abre o modal da bike automaticamente
 *
 * Uso:
 *   bun run sitemap
 *   ou
 *   node scripts/generate-sitemap.mjs
 *
 * Variáveis de ambiente esperadas (ou lê do .env automaticamente via Vite):
 *   VITE_SUPABASE_URL              — ex: https://xxx.supabase.co
 *   VITE_SUPABASE_PUBLISHABLE_KEY  — anon/publishable key
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SITE_URL = "https://filadelfomotors.com.br";
const OUT_PATH = join(ROOT, "public", "sitemap.xml");

// ---------------------------------------------------------------------------
// Carrega .env manualmente (sem dependências)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, vRaw] = m;
    if (process.env[k]) continue;
    const v = vRaw.replace(/^['"]|['"]$/g, "");
    process.env[k] = v;
  }
}
loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const today = new Date().toISOString().split("T")[0];

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeXml = (s) =>
  s.replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  }[c]));

function urlEntry({ loc, lastmod = today, changefreq = "weekly", priority = "0.7" }) {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Busca bikes ativas (REST direto, sem o SDK Supabase)
// ---------------------------------------------------------------------------
async function fetchActiveBikes() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(
      "[sitemap] VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY não definidos — gerando apenas páginas estáticas.",
    );
    return [];
  }
  const endpoint = `${SUPABASE_URL}/rest/v1/bikes?select=name,updated_at&is_active=eq.true&order=display_order.asc`;
  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) {
      console.warn(`[sitemap] Falha ao buscar bikes (HTTP ${res.status}).`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn("[sitemap] Erro de rede ao buscar bikes:", err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
async function main() {
  const bikes = await fetchActiveBikes();

  const staticEntries = [
    urlEntry({ loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" }),
    urlEntry({ loc: `${SITE_URL}/catalogo`, changefreq: "weekly", priority: "0.9" }),
    urlEntry({ loc: `${SITE_URL}/sobre`, changefreq: "monthly", priority: "0.7" }),
  ];

  const bikeEntries = bikes
    .filter((b) => b.name && b.name.trim())
    .map((b) =>
      urlEntry({
        loc: `${SITE_URL}/catalogo?bike=${slugify(b.name)}`,
        lastmod: (b.updated_at || "").split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.8",
      }),
    );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...bikeEntries,
    "</urlset>",
    "",
  ].join("\n");

  writeFileSync(OUT_PATH, xml, "utf8");
  console.log(
    `[sitemap] Gerado ${OUT_PATH} — ${staticEntries.length} estáticas + ${bikeEntries.length} bicicletas.`,
  );
}

main().catch((err) => {
  console.error("[sitemap] Falhou:", err);
  process.exit(1);
});
