import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Catalog } from "@/components/Catalog";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { useCanonical } from "@/hooks/useCanonical";

const Index = () => {
  useCanonical("/", {
    title: "Filadelfo Motors | Bicicletas Elétricas Premium | Mobilidade Urbana Sustentável",
    description:
      "Descubra as bicicletas elétricas premium da Filadelfo Motors. Performance, design e liberdade para a mobilidade urbana sustentável. Frete grátis e parcelamento em até 24x.",
  });
  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <Hero />
        <Marquee />
        <Catalog />
        <CTA />
        <Footer />
      </main>
    </PageTransition>
  );
};

export default Index;
