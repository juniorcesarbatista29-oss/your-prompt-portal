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

    // Parse "Av. Da Saudade, Nº 225 — Novo Horizonte, SP" → street / locality / region
    const rawAddress = settings?.address || "Av. Da Saudade, Nº 225 — Novo Horizonte, SP";
    const [streetPart, localityPart] = rawAddress.split(/\s[—–-]\s/);
    let addressLocality = "Novo Horizonte";
    let addressRegion = "SP";
    if (localityPart) {
      const [city, region] = localityPart.split(",").map((s) => s.trim());
      if (city) addressLocality = city;
      if (region) addressRegion = region;
    }
    const streetAddress = (streetPart || rawAddress).trim();

    const mapsUrl = settings?.maps_url || "https://maps.app.goo.gl/msPeohwmxPVEpzN86";

    // Normalize telephone to E.164 (+55...) — Google's preferred format
    const rawWhats = (settings?.whatsapp_number || "5517992155535").replace(/\D/g, "");
    const telephone = `+${rawWhats}`;

    return {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CarDealer"],
      "@id": `${SITE_URL}#localbusiness`,
      name: "Filadelfo Motors",
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.jpg`,
      image: [`${SITE_URL}/og-image.jpg`],
      description:
        "Loja de bicicletas elétricas premium em Novo Horizonte/SP. Mobilidade urbana sustentável com performance, design e tecnologia.",
      telephone,
      ...(settings?.email ? { email: settings.email } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode: "14965-038",
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -21.4718556,
        longitude: -49.212673,
      },
      hasMap: mapsUrl,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "13:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: addressLocality },
        { "@type": "State", name: addressRegion },
        { "@type": "Country", name: "Brasil" },
      ],
      priceRange: "$$",
      currenciesAccepted: "BRL",
      paymentAccepted: "Cash, Credit Card, Pix",
      ...(sameAs.length ? { sameAs } : {}),
    } satisfies Record<string, unknown>;
  }, [settings]);

  useStructuredData("ld-home-localbusiness", carDealerLd);

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
