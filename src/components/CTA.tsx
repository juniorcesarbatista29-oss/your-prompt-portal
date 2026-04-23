import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTA = () => (
  <section
    id="financiamento"
    className="relative section-y bg-brand-red text-primary-foreground overflow-hidden"
  >
    <div className="absolute inset-0 grain opacity-20" />
    <div className="absolute -right-32 -top-32 size-[400px] md:size-[600px] rounded-full bg-foreground/5 blur-3xl" />

    <div className="container mx-auto relative px-4 flex flex-col items-center text-center max-w-4xl">
      <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase font-medium opacity-80">
        Pronto para acelerar?
      </span>
      <h2 className="font-display text-[clamp(2.4rem,12vw,4rem)] sm:text-6xl md:text-8xl uppercase mt-4 md:mt-6 leading-[0.95] sm:leading-[0.9] text-balance">
        Sua próxima jornada
        <br className="hidden sm:block" />{" "}
        é{" "}
        <em className="not-italic underline decoration-2 underline-offset-[8px] md:underline-offset-[12px]">
          elétrica
        </em>
        .
      </h2>
      <p className="mt-5 md:mt-7 max-w-xl opacity-85 text-base md:text-lg leading-relaxed">
        Leve sua bike elétrica em até <strong className="font-semibold">24x no cartão</strong>.
        Últimas unidades da coleção — não fique de fora.
      </p>
      <Button
        asChild
        size="xl"
        className="mt-8 md:mt-10 bg-foreground text-background hover:bg-background hover:text-foreground transition-all uppercase tracking-widest font-semibold w-full sm:w-auto whitespace-normal text-center leading-snug"
      >
        <a
          href="https://wa.me/5517992155535?text=Ol%C3%A1%21%20Quero%20falar%20com%20o%20time%20de%20vendas%20da%20Filadelfo%20Motors."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com o time de vendas no WhatsApp (17) 99215-5535"
        >
          Falar com o time de vendas <ArrowRight />
        </a>
      </Button>
    </div>
  </section>
);
