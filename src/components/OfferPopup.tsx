import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveOffer, queryKeys } from "@/lib/queries";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Offer = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  mode: "on_enter" | "on_exit" | "top_banner";
  delay_seconds: number;
};

const STORAGE_KEY = "filadelfo_offer_dismissed";

export const OfferPopup = () => {
  const { data } = useQuery({
    queryKey: queryKeys.activeOffer,
    queryFn: fetchActiveOffer,
  });

  const dismissedId = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
  const offer: Offer | null = data && data.id !== dismissedId ? (data as Offer) : null;

  const [open, setOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (!offer) return;
    if (offer.mode === "top_banner") {
      setBannerVisible(true);
      return;
    }
    if (offer.mode === "on_enter") {
      const t = window.setTimeout(() => setOpen(true), Math.max(0, offer.delay_seconds * 1000));
      return () => window.clearTimeout(t);
    }
    if (offer.mode === "on_exit") {
      const handler = (e: MouseEvent) => {
        if (e.clientY <= 0) setOpen(true);
      };
      document.addEventListener("mouseout", handler);
      return () => document.removeEventListener("mouseout", handler);
    }
  }, [offer]);

  const dismiss = () => {
    if (offer) sessionStorage.setItem(STORAGE_KEY, offer.id);
    setOpen(false);
    setBannerVisible(false);
  };

  if (!offer) return null;

  if (offer.mode === "top_banner" && bannerVisible) {
    return (
      <div className="fixed top-0 inset-x-0 z-[60] bg-brand-red text-primary-foreground">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
          <span className="font-semibold">{offer.title}</span>
          {offer.subtitle && <span className="hidden sm:inline opacity-90">— {offer.subtitle}</span>}
          {offer.cta_url && offer.cta_label && (
            <a href={offer.cta_url} target="_blank" rel="noopener noreferrer" className="underline font-semibold ml-1 whitespace-nowrap">
              {offer.cta_label}
            </a>
          )}
          <button onClick={dismiss} aria-label="Fechar" className="ml-auto opacity-80 hover:opacity-100">
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : dismiss())}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">{offer.title}</DialogTitle>
        <DialogDescription className="sr-only">{offer.subtitle ?? ""}</DialogDescription>
        {offer.image_url && (
          <div className="aspect-[16/10] bg-brand-light">
            <img
              src={offer.image_url}
              alt={`Oferta Filadelfo Motors: ${offer.title}${offer.subtitle ? ` — ${offer.subtitle}` : ""}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 text-center">
          {offer.subtitle && (
            <div className="text-[10px] tracking-widest uppercase text-brand-red font-semibold">
              {offer.subtitle}
            </div>
          )}
          <h3 className="font-display text-3xl uppercase mt-2 leading-tight">{offer.title}</h3>
          {offer.description && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{offer.description}</p>
          )}
          {offer.cta_url && offer.cta_label && (
            <a href={offer.cta_url} target="_blank" rel="noopener noreferrer" className="block mt-5">
              <Button size="lg" className="w-full">{offer.cta_label}</Button>
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};