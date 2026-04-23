import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const links = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Falar com o time de vendas", href: "/#financiamento" },
];

// Prefetch lazy chunks on hover/focus for instant navigation
const prefetchers: Record<string, () => Promise<unknown>> = {
  "/sobre": () => import("@/pages/Sobre.tsx"),
  "/catalogo": () => import("@/pages/Catalogo.tsx"),
};
const prefetch = (href: string) => prefetchers[href]?.();

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // iOS-safe scroll lock: preserves scroll position without jump
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => {
            const isInternal = l.href.startsWith("/") && !l.href.startsWith("/#");
            const className =
              "text-sm font-medium text-foreground/75 hover:text-brand-red transition-colors relative group";
            const inner = (
              <>
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-red transition-all group-hover:w-full" />
              </>
            );
            return isInternal ? (
              <Link
                key={l.href}
                to={l.href}
                className={className}
                onMouseEnter={() => prefetch(l.href)}
                onFocus={() => prefetch(l.href)}
                onTouchStart={() => prefetch(l.href)}
              >
                {inner}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className={className}>
                {inner}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Buscar" className="hidden sm:inline-flex">
            <Search />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl overflow-y-auto"
          style={{
            maxHeight: "calc(100svh - 4rem)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <nav className="container mx-auto flex flex-col py-4 px-4">
            {links.map((l) => {
              const isInternal = l.href.startsWith("/") && !l.href.startsWith("/#");
              const cls =
                "py-4 text-base font-medium text-foreground/85 hover:text-brand-red border-b border-border/60 last:border-0";
              return isInternal ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  onTouchStart={() => prefetch(l.href)}
                  className={cls}
                >
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className={cls}>
                  {l.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
