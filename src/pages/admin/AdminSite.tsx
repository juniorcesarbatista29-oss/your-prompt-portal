import { useEffect, useState } from "react";
import { Loader2, Save, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/queries";

type Settings = {
  id?: string;
  whatsapp_number: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  maps_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
};

const empty: Settings = {
  whatsapp_number: "",
  phone: "",
  email: "",
  address: "",
  instagram_url: "",
  facebook_url: "",
  youtube_url: "",
  tiktok_url: "",
  maps_url: "",
  seo_title: "",
  seo_description: "",
  og_image_url: "",
};

const AdminSite = () => {
  const qc = useQueryClient();
  const [settings, setSettings] = useState<Settings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else if (data) {
      setSettings(data as Settings);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `site/og-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("bike-media").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Erro ao enviar imagem", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("bike-media").getPublicUrl(path);
      set("og_image_url", data.publicUrl);
    }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...settings };
    delete (payload as any).id;
    let error;
    if (settings.id) {
      ({ error } = await supabase.from("site_settings").update(payload).eq("id", settings.id));
    } else {
      ({ error } = await supabase.from("site_settings").insert(payload));
    }
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Configurações salvas" });
      qc.invalidateQueries({ queryKey: queryKeys.siteSettings });
      load();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl uppercase">Configurações do site</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Contato, redes sociais e informações exibidas em todo o site.
        </p>
      </header>

      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-[11px] tracking-widest uppercase text-muted-foreground border-b border-border pb-2">
            Contato
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>WhatsApp (somente números, com DDI)</Label>
              <Input
                value={settings.whatsapp_number ?? ""}
                onChange={(e) => set("whatsapp_number", e.target.value)}
                placeholder="17996015317"
              />
            </div>
            <div>
              <Label>Telefone exibido</Label>
              <Input
                value={settings.phone ?? ""}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(17) 99601-5317"
              />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={settings.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <Label>Endereço</Label>
              <Input
                value={settings.address ?? ""}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[11px] tracking-widest uppercase text-muted-foreground border-b border-border pb-2">
            Redes sociais
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Instagram</Label>
              <Input
                value={settings.instagram_url ?? ""}
                onChange={(e) => set("instagram_url", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label>Facebook</Label>
              <Input
                value={settings.facebook_url ?? ""}
                onChange={(e) => set("facebook_url", e.target.value)}
              />
            </div>
            <div>
              <Label>YouTube</Label>
              <Input
                value={settings.youtube_url ?? ""}
                onChange={(e) => set("youtube_url", e.target.value)}
              />
            </div>
            <div>
              <Label>TikTok</Label>
              <Input
                value={settings.tiktok_url ?? ""}
                onChange={(e) => set("tiktok_url", e.target.value)}
              />
            </div>
            <div>
              <Label>Link do Google Maps</Label>
              <Input
                value={settings.maps_url ?? ""}
                onChange={(e) => set("maps_url", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[11px] tracking-widest uppercase text-muted-foreground border-b border-border pb-2">
            SEO e pré-visualização
          </h2>
          <div>
            <Label>Título padrão (Google / aba do navegador)</Label>
            <Input
              value={settings.seo_title ?? ""}
              onChange={(e) => set("seo_title", e.target.value)}
            />
          </div>
          <div>
            <Label>Descrição padrão</Label>
            <Textarea
              value={settings.seo_description ?? ""}
              onChange={(e) => set("seo_description", e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label>Imagem de pré-visualização (Open Graph)</Label>
            <div className="flex items-center gap-3">
              <Input
                value={settings.og_image_url ?? ""}
                onChange={(e) => set("og_image_url", e.target.value)}
                placeholder="https://..."
              />
              <label className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-border cursor-pointer hover:border-foreground transition-colors whitespace-nowrap">
                {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                Enviar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            {settings.og_image_url && (
              <img
                src={settings.og_image_url}
                alt="Pré-visualização"
                className="mt-3 max-h-40 rounded-md border border-border object-cover"
              />
            )}
          </div>
        </section>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSite;
