import { ArrowRight, Weight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import bikeUrban from "@/assets/bike-urban.jpg";
import bikeMoped from "@/assets/bike-moped.jpg";
import bikeMtb from "@/assets/bike-mtb.jpg";
import bikeFold from "@/assets/bike-fold.jpg";
import { BikeDetailModal, type Bike } from "./BikeDetailModal";
import { fetchActiveBikes, queryKeys } from "@/lib/queries";
import { buildBikeAlt } from "@/lib/bike-alt";

const fallbackProducts: Bike[] = [
  {
    name: "Voltz Pro",
    tag: "Moped",
    price: "8.490",
    parcel: "12x R$ 707",
    image: bikeMoped,
    badge: "Lançamento",
    specs: { autonomia: "120km", motor: "1000W", vel: "45km/h" },
  },
  {
    name: "Urban One",
    tag: "Cidade",
    price: "5.290",
    parcel: "12x R$ 440",
    image: bikeUrban,
    badge: null,
    specs: { autonomia: "80km", motor: "500W", vel: "32km/h" },
  },
  {
    name: "Trail X",
    tag: "Mountain",
    price: "9.890",
    parcel: "12x R$ 824",
    image: bikeMtb,
    badge: "Mais vendido",
    specs: { autonomia: "100km", motor: "750W", vel: "40km/h" },
  },
  {
    name: "Fold Lite",
    tag: "Dobrável",
    price: "4.190",
    parcel: "12x R$ 349",
    image: bikeFold,
    badge: null,
    specs: { autonomia: "60km", motor: "350W", vel: "28km/h" },
  },
];

const badgeLabels: Record<string, string> = {
  lancamento: "Lançamento",
  mais_vendida: "Mais vendido",
  oferta: "Oferta",
  novidade: "Novidade",
};

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const Catalog = () => {
  const [selected, setSelected] = useState<Bike | null>(null);
  const [open, setOpen] = useState(false);

  const { data: dbBikes } = useQuery({
    queryKey: queryKeys.bikes,
    queryFn: fetchActiveBikes,
  });

  const products: Bike[] = (() => {
    if (!dbBikes || dbBikes.length === 0) return fallbackProducts;
    // Home shows only the first 4 bikes as highlights — full list lives on /catalogo
    return dbBikes.slice(0, 4).map((b: any) => {
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
  })();

  const openBike = (bike: Bike) => {
    setSelected(bike);
    setOpen(true);
  };

  return (
    <section id="catalogo" className="relative section-y-tight bg-secondary">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-14 text-center">
          <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground font-medium">
            Destaques da semana
          </span>
          <h2 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl uppercase mt-4 md:mt-5 leading-[0.9]">
            Catálogo <span className="text-brand-red">2026.</span>
          </h2>
        </div>

        <div id="destaques" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p, i) => (
            <article
              key={p.name}
              onClick={() => openBike(p)}
              className="group relative bg-card border border-border rounded-md overflow-hidden hover:border-foreground/30 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-deep animate-fade-up cursor-pointer"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {p.badge && (
                <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-foreground text-background text-[9px] md:text-[10px] font-medium tracking-[0.2em] uppercase px-2 md:px-2.5 py-1 rounded-sm">
                  {p.badge}
                </span>
              )}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                {p.tag}
              </div>

              <div className="aspect-[4/3] sm:aspect-square bg-brand-light relative overflow-hidden">
                <img
                  src={p.image}
                  alt={buildBikeAlt(p)}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-contain p-3 md:p-4 transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="font-display text-xl md:text-2xl uppercase">{p.name}</h3>

                {p.colors && p.colors.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    {p.colors.slice(0, 5).map((c, idx) => (
                      <span
                        key={`${c.hex}-${idx}`}
                        title={c.name}
                        className="size-3.5 rounded-full border border-border shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {p.colors.length > 5 && (
                      <span className="text-[10px] text-muted-foreground">+{p.colors.length - 5}</span>
                    )}
                  </div>
                )}

                <div
                  className={`mt-3 md:mt-4 grid ${p.weightCapacity ? "grid-cols-4" : "grid-cols-3"} gap-1.5 sm:gap-2 py-3 md:py-4 border-y border-border`}
                >
                  {Object.entries(p.specs).map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[9px] tracking-[0.15em] sm:tracking-widest uppercase text-muted-foreground">
                        {k}
                      </div>
                      <div className="text-[11px] sm:text-xs md:text-sm font-semibold mt-0.5 break-words leading-tight">{v}</div>
                    </div>
                  ))}
                  {p.weightCapacity && (
                    <div>
                      <div className="text-[9px] tracking-[0.15em] sm:tracking-widest uppercase text-muted-foreground">
                        Peso
                      </div>
                      <div className="text-[11px] sm:text-xs md:text-sm font-semibold mt-0.5 break-words leading-tight tabular-nums">
                        {p.weightCapacity}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 md:mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
                      A partir de
                    </div>
                    <div className="font-display text-[1.35rem] md:text-2xl leading-none">R$ {p.price}</div>
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

        <div className="mt-10 md:mt-14 text-center">
          <Button asChild variant="outlineHero" size="lg" className="w-full sm:w-auto">
            <Link to="/catalogo">
              Ver catálogo completo <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <BikeDetailModal bike={selected} open={open} onOpenChange={setOpen} />
    </section>
  );
};
