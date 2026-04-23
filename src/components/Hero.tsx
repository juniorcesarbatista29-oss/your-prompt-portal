import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBike from "@/assets/hero-bike.jpg";

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] flex items-center pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-background"
    >
      {/* Background bike — clean automotive composition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroBike}
          alt="Bicicleta elétrica Filadelfo Motors em destaque"
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover object-[65%_center] sm:object-[60%_center] md:object-[80%_center] lg:object-[75%_center] opacity-95 will-change-transform"
        />
        {/* Horizontal readability mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10 md:from-background md:via-background/60 md:to-transparent" />
        {/* Vertical fade for footer-area legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        {/* iOS contrast guard */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent md:hidden" />
      </div>

      <div className="container mx-auto relative z-10 grid md:grid-cols-12 gap-8 md:gap-8 items-center px-4">
        <div className="md:col-span-12 animate-fade-up text-center">
          <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground font-medium">
            Coleção 2026
          </span>

          <h1 className="mt-4 md:mt-5 font-display text-[clamp(2.35rem,8.8vw,7rem)] leading-[0.95] sm:leading-[0.88] uppercase tracking-tight text-foreground">
            <span className="block overflow-hidden">
              <span className="block whitespace-nowrap animate-hero-line" style={{ animationDelay: "0.05s" }}>
                Energia que <span className="text-brand-red">move</span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="block animate-hero-line" style={{ animationDelay: "0.28s" }}>
                cidades.
              </span>
            </span>
          </h1>

          <p className="mt-6 md:mt-8 mx-auto max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
            Bicicletas elétricas premium para quem não negocia performance,
            design ou liberdade.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center sm:justify-center gap-3 sm:gap-4">
            <Button asChild variant="hero" size="xl" className="w-full sm:w-auto">
              <Link to="/catalogo">
                Ver catálogo <ArrowRight />
              </Link>
            </Button>
            <Button variant="outlineHero" size="xl" className="w-full sm:w-auto">
              Simular financiamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
