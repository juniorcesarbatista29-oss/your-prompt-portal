import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

export const Footer = () => (
  <footer
    id="contato"
    className="bg-secondary border-t border-border pt-14 md:pt-20 pb-8"
    style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
  >
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-x-5 gap-y-9 pb-10 md:pb-16 border-b border-border">
        <div className="col-span-2 md:col-span-4">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Bicicletas elétricas premium para uma nova era da mobilidade urbana.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/filadelfomotors/", label: "Instagram" },
              { Icon: Facebook, href: "#", label: "Facebook" },
              { Icon: Youtube, href: "#", label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="size-9 sm:size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-brand-red hover:border-brand-red hover:text-primary-foreground transition-all"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3 md:mb-4 font-medium">
            Loja
          </div>
          <ul className="space-y-2.5 md:space-y-3 text-sm">
            {["Catálogo", "Lançamentos", "Promoções", "Acessórios"].map((l) => (
              <li key={l}>
                <a href="#" className="text-foreground/70 hover:text-brand-red transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3 md:mb-4 font-medium">
            Empresa
          </div>
          <ul className="space-y-2.5 md:space-y-3 text-sm">
            {["Sobre nós", "Blog", "Parcerias", "Imprensa"].map((l) => (
              <li key={l}>
                <a href="#" className="text-foreground/70 hover:text-brand-red transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-4">
          <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3 md:mb-4 font-medium">
            Contato
          </div>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-3">
              <MapPin className="size-4 text-foreground/60 shrink-0 mt-0.5" />
              <span className="leading-snug">Av. Da Saudade — Novo Horizonte, SP</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-foreground/60 shrink-0" />
              <a href="tel:+5517992155535" className="hover:text-brand-red transition-colors">(17) 99215-5535</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="size-4 text-foreground/60 shrink-0 mt-0.5" />
              <a href="mailto:contato@filadelfomotors.com.br" className="hover:text-brand-red transition-colors break-all leading-snug">
                contato@filadelfomotors.com.br
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-6 md:pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
        <span className="leading-relaxed">© {new Date().getFullYear()} Filadelfo Motors. Todos os direitos reservados.</span>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-5 md:gap-6">
          <a href="#" className="hover:text-brand-red transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-brand-red transition-colors">Termos de Uso</a>
        </div>
      </div>
    </div>
  </footer>
);
