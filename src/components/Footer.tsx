import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useNavLinks } from "@/hooks/useNavLinks";

export const Footer = () => {
  const { settings } = useSiteSettings();
  const { links: footerLinks } = useNavLinks("footer");

  const socials = [
    { Icon: Instagram, href: settings?.instagram_url, label: "Instagram" },
    { Icon: Facebook, href: settings?.facebook_url, label: "Facebook" },
    { Icon: Youtube, href: settings?.youtube_url, label: "YouTube" },
  ].filter((s) => s.href);

  const phone = settings?.phone || "(17) 99215-5535";
  const whatsappNumber = (settings?.whatsapp_number || "5517992155535").replace(/\D/g, "");
  const phoneHref = `https://wa.me/${whatsappNumber}`;
  const email = settings?.email || "contato@filadelfomotors.com.br";
  const address = settings?.address || "Av. Da Saudade, Nº 225 — Novo Horizonte, SP";
  const mapsUrl = settings?.maps_url || "https://maps.app.goo.gl/msPeohwmxPVEpzN86";

  return (
    <footer
      id="contato"
      className="bg-secondary border-t border-border pt-14 md:pt-20 pb-8"
      style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-x-5 gap-y-9 pb-10 md:pb-16 border-b border-border">
          <div className="col-span-2 md:col-span-5">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Bicicletas elétricas premium para uma nova era da mobilidade urbana.
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="size-9 sm:size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-brand-red hover:border-brand-red hover:text-primary-foreground transition-all"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerLinks.length > 0 && (
            <div className="col-span-1 md:col-span-3">
              <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3 md:mb-4 font-medium">
                Navegação
              </div>
              <ul className="space-y-2.5 md:space-y-3 text-sm">
                {footerLinks.map((l: any) => {
                  const isInternal =
                    l.url.startsWith("/") && !l.url.startsWith("/#") && !l.open_in_new_tab;
                  return (
                    <li key={l.id}>
                      {isInternal ? (
                        <Link
                          to={l.url}
                          className="text-foreground/70 hover:text-brand-red transition-colors"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.url}
                          target={l.open_in_new_tab ? "_blank" : undefined}
                          rel={l.open_in_new_tab ? "noopener noreferrer" : undefined}
                          className="text-foreground/70 hover:text-brand-red transition-colors"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="col-span-2 md:col-span-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3 md:mb-4 font-medium">
              Contato
            </div>
            <address
              aria-label="Informações de contato da Filadelfo Motors"
              className="not-italic space-y-3 text-sm text-foreground/80"
              itemScope
              itemType="https://schema.org/LocalBusiness"
            >
              <meta itemProp="name" content="Filadelfo Motors" />
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-foreground/60 shrink-0 mt-0.5" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver endereço no mapa: ${address}`}
                  className="leading-snug hover:text-brand-red transition-colors"
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <span itemProp="streetAddress">{address}</span>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-foreground/60 shrink-0" />
                <a
                  href={phoneHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Falar no WhatsApp ${phone}`}
                  className="hover:text-brand-red transition-colors"
                  itemProp="telephone"
                >
                  {phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="size-4 text-foreground/60 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-brand-red transition-colors break-all leading-snug"
                  itemProp="email"
                >
                  {email}
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="pt-6 md:pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
          <span className="leading-relaxed">
            © {new Date().getFullYear()} Filadelfo Motors. Todos os direitos reservados.
          </span>
          <Link
            to="/privacidade"
            className="hover:text-brand-red transition-colors"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
};
