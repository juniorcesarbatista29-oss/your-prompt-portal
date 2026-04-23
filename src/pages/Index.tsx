import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Catalog } from "@/components/Catalog";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
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
