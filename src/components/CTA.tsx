import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageContent } from "@/hooks/usePageContent";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export const CTA = () => {
  const { t } = usePageContent("home");
  const { settings } = useSiteSettings();
  const eyebrow = t("cta_title", "Pronto para acelerar?");
  const subtitle = t(
    "cta_subtitle",
    "Leve sua bike elétrica em até 24x no cartão. Últimas unidades da coleção — não fique de fora."
  );
  const waUrl = buildWhatsappUrl(settings?.whatsapp_number, "Gostaria de falar com um vendedor");

  return (
    <section
      id="financiamento"
      className="relative section-y bg-brand-red text-primary-foreground overflow-hidden"
    >
      <div className="absolute inset-0 grain opacity-20" />
      <div className="absolute -right-32 -top-32 size-[400px] md:size-[600px] rounded-full bg-foreground/5 blur-3xl" />

      <div className="container mx-auto relative px-4 flex flex-col items-center text-center max-w-4xl">
        <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase font-medium opacity-80">
          {eyebrow}
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
          {subtitle}
        </p>
        <Button
          asChild
          size="xl"
          className="mt-8 md:mt-10 bg-foreground text-background hover:bg-background hover:text-foreground transition-all uppercase tracking-widest font-semibold w-full sm:w-auto whitespace-normal text-center leading-snug"
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com o time de vendas no WhatsApp"
          >
            Falar com o time de vendas <ArrowRight />
          </a>
        </Button>
      </div>
    </section>
  );
};
