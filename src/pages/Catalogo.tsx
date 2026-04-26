import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { BikeDetailModal, type Bike } from "@/components/BikeDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { fetchActiveBikes, queryKeys } from "@/lib/queries";
import { useCanonical } from "@/hooks/useCanonical";
import { buildBikeAlt } from "@/lib/bike-alt";

const badgeLabels: Record<string, string> = {
  lancamento: "Lançamento",
  mais_vendida: "Mais vendido",
  oferta: "Oferta",
  novidade: "Novidade",
};

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Extract the first integer found in a spec string like "120km", "1000W", "45km/h". */
const parseNum = (s: string | undefined | null): number | null => {
  if (!s) return null;
  const m = String(s).match(/\d+(?:[.,]\d+)?/);
  return m ? Number(m[0].replace(",", ".")) : null;
};

const Catalogo = () => {
  useCanonical("/catalogo");
  const [selected, setSelected] = useState<Bike | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("Todas");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    document.title = "Catálogo · Filadelfo Motors";
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.bikes,
    queryFn: fetchActiveBikes,
  });

  const bikes: Bike[] = useMemo(() => {
    if (!data) return [];
    return data.map((b: any) => {
      const imgs = (b.bike_images ?? [])
        .slice()
        .sort((a: any, c: any) => a.display_order - c.display_order);
      const cover = imgs.find((i: any) => i.is_cover) ?? imgs[0];
      const rawColors = Array.isArray(b.colors) ? b.colors : [];
      return {
        name: b.name,
        tag: b.tag,
        price: formatPrice(Number(b.price)),
        parcel: b.parcel ?? "",
        image: cover?.image_url ?? "",
        badge: b.badge ? badgeLabels[b.badge] ?? b.badge : null,
        specs: {
          autonomia: b.autonomia ?? "—",
          motor: b.motor ?? "—",
          vel: b.velocidade ?? "—",
        },
        weightCapacity: b.weight_capacity ?? null,
        colors: rawColors
          .filter((c: any) => c && typeof c.name === "string" && typeof c.hex === "string")
          .map((c: any) => ({ name: c.name, hex: c.hex })),
        description: b.description ?? undefined,
        videoUrl: b.video_url,
        gallery: imgs.map((i: any) => ({ url: i.image_url, caption: i.caption })),
      };
    });
  }, [data]);

  const tags = useMemo(() => {
    const s = new Set<string>();
    bikes.forEach((b) => s.add(b.tag));
    return ["Todas", ...Array.from(s)];
  }, [bikes]);

  // Compute price range from actual data so the slider always matches catalog reality
  const priceRange = useMemo(() => {
    const prices = bikes
      .map((b) => Number(String(b.price).replace(/\./g, "").replace(",", ".")))
      .filter((n) => Number.isFinite(n));
    const dataMax = Math.max(0, ...prices);
    // Always allow up to R$ 20.000, or higher if a bike exceeds that
    const max = Math.max(20000, Math.ceil(dataMax / 500) * 500);
    return { min: 0, max };
  }, [bikes]);

  const filtered = useMemo(() => {
    return bikes.filter((b) => {
      const matchesTag = tag === "Todas" || b.tag === tag;
      const matchesQuery =
        !query ||
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.tag.toLowerCase().includes(query.toLowerCase());
      const priceNum = Number(
        String(b.price).replace(/\./g, "").replace(",", "."),
      );
      const matchesPrice = maxPrice === 0 || (Number.isFinite(priceNum) && priceNum <= maxPrice);
      return matchesTag && matchesQuery && matchesPrice;
    });
  }, [bikes, query, tag, maxPrice]);

  const activeFilterCount =
    (tag !== "Todas" ? 1 : 0) +
    (query ? 1 : 0) +
    (maxPrice > 0 ? 1 : 0);

  const clearFilters = () => {
    setQuery("");
    setTag("Todas");
    setMaxPrice(0);
  };

  const openBike = (bike: Bike) => {
    setSelected(bike);
    setOpen(true);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
        <Header />

        <section className="pt-24 sm:pt-28 md:pt-32 pb-10 md:pb-14 border-b border-border">
          <div className="container mx-auto px-4 text-center flex flex-col items-center">
            <span className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase text-muted-foreground font-medium">
              Coleção 2026
            </span>
            <h1 className="font-display text-[2.5rem] xs:text-5xl sm:text-6xl md:text-7xl uppercase mt-3 sm:mt-4 leading-[0.95] sm:leading-[0.9] text-balance text-center w-full">
              Catálogo <span className="text-brand-red">completo.</span>
            </h1>
            <p className="mt-4 max-w-md sm:max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed px-2 text-balance">
              Toda a linha Filadelfo Motors — urbanas, mopeds, mountain e dobráveis.
              Encontre a sua próxima bike elétrica.
            </p>

            <div className="mt-8 w-full flex flex-col sm:flex-row gap-3 sm:items-center text-left">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou categoria"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                className="sm:ml-auto inline-flex items-center justify-center gap-2 text-[11px] tracking-widest uppercase px-3 py-2 rounded-full border border-border hover:border-foreground transition-colors whitespace-nowrap"
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="size-3.5" />
                Filtros avançados
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-brand-red text-primary-foreground text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {filtersOpen && (
              <div className="mt-5 p-5 md:p-6 border border-border rounded-md bg-secondary/40 animate-fade-in space-y-6">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-3">
                    Modelo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTag(t)}
                        className={`text-[11px] tracking-widest uppercase px-3 py-2 rounded-full border whitespace-nowrap transition-colors ${
                          tag === t
                            ? "bg-foreground text-background border-foreground"
                            : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="max-w-md">
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="text-[10px] tracking-widest uppercase text-muted-foreground">
                        Preço máximo
                      </label>
                      <span className="font-display text-base">
                        {maxPrice > 0
                          ? `R$ ${maxPrice.toLocaleString("pt-BR")}`
                          : "—"}
                      </span>
                    </div>
                    <Slider
                      value={[maxPrice]}
                      min={priceRange.min}
                      max={priceRange.max}
                      step={100}
                      onValueChange={([v]) => setMaxPrice(v)}
                    />
                    <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                      <span>R$ 0</span>
                      <span>R$ {priceRange.max.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">
                      {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
                    </span>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-foreground/70 hover:text-brand-red transition-colors"
                    >
                      <X className="size-3.5" /> Limpar tudo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="section-y-tight">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-md bg-secondary/60 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm tracking-widest uppercase text-muted-foreground">
                  Nenhuma bicicleta encontrada
                </p>
                <Button variant="outline" className="mt-6" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filtered.map((p, i) => (
                  <article
                    key={`${p.name}-${i}`}
                    onClick={() => openBike(p)}
                    className="group relative bg-card border border-border rounded-md overflow-hidden hover:border-foreground/30 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-deep cursor-pointer"
                  >
                    {p.badge && (
                      <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-foreground text-background text-[9px] md:text-[10px] font-medium tracking-[0.2em] uppercase px-2 md:px-2.5 py-1 rounded-sm">
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                      {p.tag}
                    </div>

                    <div className="aspect-square bg-brand-light relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={buildBikeAlt(p)}
                        loading="lazy"
                        className="w-full h-full object-contain p-3 md:p-4 transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-5 md:p-6">
                      <h3 className="font-display text-xl md:text-2xl uppercase">{p.name}</h3>

                      {p.colors && p.colors.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          {p.colors.slice(0, 5).map((c, idx) => (
                            <span
                              key={`${c.hex}-${idx}`}
                              title={c.name}
                              className="size-3 xs:size-3.5 rounded-full border border-border shadow-inner"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          {p.colors.length > 5 && (
                            <span className="text-[10px] text-muted-foreground">+{p.colors.length - 5}</span>
                          )}
                        </div>
                      )}

                      <div className="mt-3 md:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2 py-3 md:py-4 border-y border-border">
                        {Object.entries(p.specs).map(([k, v]) => (
                          <div key={k} className="min-w-0">
                            <div className="text-[9px] tracking-[0.15em] sm:tracking-widest uppercase text-muted-foreground truncate leading-tight">
                              {k}
                            </div>
                            <div className="text-[11px] sm:text-xs md:text-sm font-semibold mt-1 leading-[1.15] tabular-nums break-words">
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>

                      {p.weightCapacity && (
                        <div className="mt-3 flex items-baseline justify-between gap-2">
                          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground leading-tight">
                            Peso suportado
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-foreground tabular-nums leading-tight">
                            {p.weightCapacity}
                          </span>
                        </div>
                      )}

                      <div className="mt-3 md:mt-4 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
                            A partir de
                          </div>
                          <div className="font-display text-xl md:text-2xl">R$ {p.price}</div>
                          <div className="text-[10px] md:text-xs text-muted-foreground truncate">
                            {p.parcel}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBike(p);
                          }}
                          aria-label={`Ver ${p.name}`}
                          className="size-10 md:size-11 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-brand-red hover:text-primary-foreground transition-all group-hover:rotate-[-45deg]"
                        >
                          <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      <BikeDetailModal bike={selected} open={open} onOpenChange={setOpen} />
    </PageTransition>
  );
};

export default Catalogo;