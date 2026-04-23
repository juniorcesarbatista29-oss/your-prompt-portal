import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import sobreHero from "@/assets/sobre-hero.jpg";

const Sobre = () => {
  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-16 md:pt-20">
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          <img
            src={sobreHero}
            alt="Mobilidade urbana elétrica Filadelfo Motors em destaque"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
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