import { useEffect } from "react";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { useCanonical } from "@/hooks/useCanonical";
import sobreHero from "@/assets/sobre-hero.webp";

const Sobre = () => {
  useCanonical("/sobre");
  useEffect(() => {
    document.title = "Sobre a Filadelfo Motors | Propósito, Qualidade e Sustentabilidade";
  }, []);
  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-16 md:pt-20">
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden bg-secondary">
          <img
            src={sobreHero}
            alt="Mobilidade urbana elétrica Filadelfo Motors em destaque"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
            // @ts-expect-error fetchpriority is a valid HTML attribute
            fetchpriority="high"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        <About />
      </div>
      <Footer />
      </main>
    </PageTransition>
  );
};

export default Sobre;