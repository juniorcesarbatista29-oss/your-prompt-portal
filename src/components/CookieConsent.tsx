import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "fm_cookie_consent_v1";

type Preferences = {
  necessary: true; // always on
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

const defaultPrefs: Preferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: "",
};

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // small delay so it doesn't fight the page load
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
      }
      setPrefs(JSON.parse(saved));
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (p: Preferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
    setPrefs(p);
    setVisible(false);
    setManageOpen(false);
  };

  const acceptAll = () =>
    persist({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });

  const rejectOptional = () =>
    persist({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });

  const saveCustom = () =>
    persist({
      ...prefs,
      necessary: true,
      timestamp: new Date().toISOString(),
    });

  if (!visible && !manageOpen) return null;

  return (
    <>
      {visible && (
        <div
          role="dialog"
          aria-label="Aviso de cookies"
          aria-describedby="cookie-consent-desc"
          className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none"
          style={{
            paddingLeft: "calc(env(safe-area-inset-left, 0px) + 0.75rem)",
            paddingRight: "calc(env(safe-area-inset-right, 0px) + 0.75rem)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
            paddingTop: "0.5rem",
          }}
        >
          <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-2xl">
            <div className="relative p-4 sm:p-5">
              <button
                type="button"
                aria-label="Fechar aviso"
                onClick={rejectOptional}
                className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-start gap-3 pr-8">
                <div className="hidden sm:flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                  <Cookie className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base sm:text-lg uppercase tracking-wide leading-tight mb-1.5 flex items-center gap-2">
                    <Cookie className="size-4 text-brand-red sm:hidden" />
                    Este site usa cookies
                  </p>
                  <p
                    id="cookie-consent-desc"
                    className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed"
                  >
                    Usamos cookies para garantir o funcionamento do site,
                    lembrar suas preferências e entender como ele é utilizado.
                    Saiba mais na nossa{" "}
                    <Link
                      to="/privacidade"
                      className="text-brand-red hover:underline"
                    >
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="w-full sm:order-3"
                >
                  Aceitar todos
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setManageOpen(true)}
                  className="w-full sm:order-2"
                >
                  Gerenciar preferências
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={rejectOptional}
                  className="w-full sm:order-1"
                >
                  Apenas essenciais
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              Preferências de cookies
            </DialogTitle>
            <DialogDescription>
              Escolha quais categorias de cookies você permite. Você pode
              alterar essa escolha a qualquer momento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 border border-border rounded-lg p-4">
              <div>
                <p className="font-medium text-sm">Essenciais</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Necessários para o funcionamento do site, como navegação e
                  preferências básicas. Sempre ativos.
                </p>
              </div>
              <Switch checked disabled />
            </div>

            <div className="flex items-start justify-between gap-4 border border-border rounded-lg p-4">
              <div>
                <p className="font-medium text-sm">Análise de uso</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ajudam a entender quais páginas e modelos despertam mais
                  interesse, para melhorarmos a experiência.
                </p>
              </div>
              <Switch
                checked={prefs.analytics}
                onCheckedChange={(v) =>
                  setPrefs((p) => ({ ...p, analytics: v }))
                }
              />
            </div>

            <div className="flex items-start justify-between gap-4 border border-border rounded-lg p-4">
              <div>
                <p className="font-medium text-sm">Marketing</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Permitem mostrar conteúdos e ofertas mais relevantes para o
                  seu perfil em outras plataformas.
                </p>
              </div>
              <Switch
                checked={prefs.marketing}
                onCheckedChange={(v) =>
                  setPrefs((p) => ({ ...p, marketing: v }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={rejectOptional}>
              Apenas essenciais
            </Button>
            <Button variant="outline" onClick={acceptAll}>
              Aceitar todos
            </Button>
            <Button onClick={saveCustom}>Salvar preferências</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
