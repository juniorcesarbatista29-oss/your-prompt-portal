import { useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Catalog } from "@/components/Catalog";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { useCanonical } from "@/hooks/useCanonical";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useStructuredData } from "@/hooks/useStructuredData";

const SITE_URL = "https://filadelfomotors.com.br";

const Index = () => {
  useCanonical("/", {
    title: "Filadelfo Motors | Bicicletas Elétricas Premium | Mobilidade Urbana Sustentável",
    description:
      "Descubra as bicicletas elétricas premium da Filadelfo Motors. Performance, design e liberdade para a mobilidade urbana sustentável. Frete grátis e parcelamento em até 24x.",
  });

  const { settings } = useSiteSettings();

  const carDealerLd = useMemo(() => {
    const sameAs = [
      settings?.instagram_url,
      settings?.facebook_url,
      settings?.tiktok_url,
      settings?.youtube_url,
    ].filter((u): u is string => Boolean(u));

    return {
      "@context": "https://schema.org",
      "@type": "CarDealer",
      "@id": `${SITE_URL}#cardealer`,
      name: "Filadelfo Motors",
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.jpg`,
      image: `${SITE_URL}/og-image.jpg`,
      description:
        "Concessionária de bicicletas elétricas premium. Mobilidade urbana sustentável com performance, design e tecnologia.",
      ...(settings?.phone || settings?.whatsapp_number
        ? {
            telephone: settings?.phone || `+55${settings?.whatsapp_number}`,
          }
        : {}),
      ...(settings?.email ? { email: settings.email } : {}),
      ...(settings?.address
        ? {
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.address,
              addressCountry: "BR",
            },
          }
        : {}),
      areaServed: { "@type": "Country", name: "Brasil" },
      priceRange: "$$",
      currenciesAccepted: "BRL",
      paymentAccepted: "Cash, Credit Card, Pix",
      ...(sameAs.length ? { sameAs } : {}),
    } satisfies Record<string, unknown>;
  }, [settings]);

  useStructuredData("ld-home-cardealer", carDealerLd);

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
