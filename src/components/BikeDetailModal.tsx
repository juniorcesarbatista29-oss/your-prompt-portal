import { useState } from "react";
import { Battery, Gauge, Zap, X, MessageCircle, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { buildBikeAlt } from "@/lib/bike-alt";

export type Bike = {
  name: string;
  tag: string;
  price: string;
  parcel: string;
  image: string;
  badge: string | null;
  specs: { autonomia: string; motor: string; vel: string };
  description?: string;
  videoUrl?: string | null;
  gallery?: { url: string; caption?: string | null }[];
};

const WHATSAPP_NUMBER = "5517992155535";

type Props = {
  bike: Bike | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SpecsAndCTA = ({ bike }: { bike: Bike }) => {
  const message = encodeURIComponent(
    `Olá! Tenho interesse na bicicleta elétrica ${bike.name} (${bike.tag}). Pode me passar mais informações?`
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  const gallery = bike.gallery && bike.gallery.length > 0 ? bike.gallery : [{ url: bike.image, caption: null }];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = gallery[Math.min(activeIdx, gallery.length - 1)];

  return (
    <div className="grid h-full gap-5 md:grid-cols-[minmax(0,1fr)_minmax(22rem,0.86fr)] md:items-start md:gap-7">
      <div className="min-w-0">
      <div className="relative aspect-[4/3] sm:aspect-square bg-brand-light overflow-hidden rounded-md">
        {bike.badge && (
          <span className="absolute top-3 left-3 z-10 bg-brand-red text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
            {bike.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 z-10 text-[10px] tracking-widest uppercase text-muted-foreground bg-background/80 px-2 py-1 rounded-sm">
          {bike.tag}
        </span>
        <img
          src={active.url}
          alt={buildBikeAlt(bike)}
          className="w-full h-full object-contain p-4"
          loading="eager"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((g, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`size-14 shrink-0 rounded border-2 overflow-hidden bg-brand-light ${
                i === activeIdx ? "border-brand-red" : "border-border"
              }`}
            >
              <img src={g.url} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
      {active.caption && (
        <p className="mt-2 text-xs text-muted-foreground italic px-1">{active.caption}</p>
      )}
      </div>

      <div className="min-w-0 px-1 md:px-0">
        <h3 className="font-display text-2xl md:text-3xl uppercase">{bike.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {bike.description ??
            `A ${bike.name} foi projetada para entregar performance, autonomia e design. Componentes premium, motor brushless e bateria de lítio certificada.`}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 py-4 border-y border-border">
          {[
            { icon: Battery, label: "Autonomia", value: bike.specs.autonomia },
            { icon: Zap, label: "Motor", value: bike.specs.motor },
            { icon: Gauge, label: "Vel. máx", value: bike.specs.vel },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-start">
              <Icon className="size-4 text-brand-red mb-2" />
              <span className="text-[9px] tracking-widest uppercase text-muted-foreground">
                {label}
              </span>
              <span className="font-display text-base sm:text-lg md:text-xl mt-0.5 leading-tight break-words">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col xs:flex-row xs:items-baseline xs:justify-between gap-2 xs:gap-3">
          <div>
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
              A partir de
            </div>
            <div className="font-display text-3xl md:text-4xl">R$ {bike.price}</div>
          </div>
          <div className="xs:text-right text-xs text-muted-foreground">
            ou em até <strong className="text-foreground font-semibold">24x no cartão</strong>
          </div>
        </div>

        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block mt-6">
          <Button
            size="xl"
            className="w-full bg-[#25D366] hover:bg-[#1fb755] text-white uppercase tracking-widest font-semibold whitespace-normal text-center leading-snug"
          >
            <MessageCircle className="size-5" />
            Comprar pelo WhatsApp
          </Button>
        </a>
        {bike.videoUrl && (
          <a href={bike.videoUrl} target="_blank" rel="noopener noreferrer" className="block mt-3">
            <Button variant="outline" size="lg" className="w-full">
              <Play className="size-4" /> Assistir vídeo
            </Button>
          </a>
        )}
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Atendimento direto com o time de vendas · (17) 99215-5535
        </p>
      </div>
    </div>
  );
};

export const BikeDetailModal = ({ bike, open, onOpenChange }: Props) => {
  const isMobile = useIsMobile();

  if (!bike) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92svh] rounded-t-lg">
          <DrawerTitle className="sr-only">{bike.name}</DrawerTitle>
          <DrawerDescription className="sr-only">
            Detalhes da bicicleta elétrica {bike.name}
          </DrawerDescription>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label="Fechar"
              className="absolute right-4 top-4 z-20 size-9 rounded-full bg-background/90 border border-border flex items-center justify-center text-foreground shadow-soft transition-all hover:bg-foreground hover:text-background"
            >
              <X className="size-4" />
            </button>
          </DrawerClose>
          <div className="overflow-y-auto px-4 pb-8 pt-8">
            <SpecsAndCTA bike={bike} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl p-5 md:p-7 max-h-[88vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{bike.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Detalhes da bicicleta elétrica {bike.name}
        </DialogDescription>
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-20 size-9 rounded-full bg-background/90 border border-border flex items-center justify-center shadow-soft hover:bg-foreground hover:text-background transition-all"
        >
          <X className="size-4" />
        </button>
        <SpecsAndCTA bike={bike} />
      </DialogContent>
    </Dialog>
  );
};