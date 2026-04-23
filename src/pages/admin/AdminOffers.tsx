import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

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
  is_active: boolean;
};

const modeOptions = [
  { value: "on_enter", label: "Pop-up ao entrar no site" },
  { value: "on_exit", label: "Pop-up ao tentar sair" },
  { value: "top_banner", label: "Banner fixo no topo" },
];

const emptyOffer: Omit<Offer, "id"> = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  cta_label: "",
  cta_url: "",
  mode: "on_enter",
  delay_seconds: 3,
  is_active: false,
};

const AdminOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Offer | (Omit<Offer, "id"> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else setOffers((data ?? []) as Offer[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => setEditing({ ...emptyOffer });
  const startEdit = (o: Offer) => setEditing({ ...o });

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title) {
      toast({ title: "Informe o título", variant: "destructive" });
      return;
    }
    setSaving(true);
    // Garantir que apenas uma oferta esteja ativa por vez
    if (editing.is_active) {
      await supabase.from("offers").update({ is_active: false }).neq("id", editing.id ?? "00000000-0000-0000-0000-000000000000");
    }
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      description: editing.description || null,
      image_url: editing.image_url || null,
      cta_label: editing.cta_label || null,
      cta_url: editing.cta_url || null,
      mode: editing.mode,
      delay_seconds: editing.delay_seconds,
      is_active: editing.is_active,
    };
    if ("id" in editing && editing.id) {
      const { error } = await supabase.from("offers").update(payload).eq("id", editing.id);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Oferta atualizada" });
        setEditing(null);
        load();
      }
    } else {
      const { error } = await supabase.from("offers").insert(payload);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Oferta criada" });
        setEditing(null);
        load();
      }
    }
    setSaving(false);
  };

  const handleUpload = async (file: File | null) => {
    if (!file || !editing) return;
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `offers/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("bike-media").upload(path, file);
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
    } else {
      const { data: pub } = supabase.storage.from("bike-media").getPublicUrl(path);
      setEditing({ ...editing, image_url: pub.publicUrl });
    }
    setUploading(false);
  };

  const handleDelete = async (o: Offer) => {
    if (!confirm(`Excluir oferta "${o.title}"?`)) return;
    await supabase.from("offers").delete().eq("id", o.id);
    load();
  };

  const toggleActive = async (o: Offer) => {
    if (!o.is_active) {
      await supabase.from("offers").update({ is_active: false }).neq("id", o.id);
    }
    await supabase.from("offers").update({ is_active: !o.is_active }).eq("id", o.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl uppercase">Ofertas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Crie pop-ups de promoção exibidos para os clientes. Apenas uma oferta fica ativa por vez.
          </p>
        </div>
        <Button onClick={startNew} size="lg">
          <Plus className="size-4" /> Nova oferta
        </Button>
      </div>

      {editing && (
        <div className="mb-8 p-5 md:p-6 border border-border rounded-md bg-card space-y-4">
          <h2 className="font-display text-xl uppercase">
            {"id" in editing && editing.id ? "Editar oferta" : "Nova oferta"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Título *</Label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
            </div>
            <div>
              <Label>Modo de exibição</Label>
              <Select value={editing.mode} onValueChange={(v) => setEditing({ ...editing, mode: v as Offer["mode"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {modeOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Texto do botão</Label>
              <Input value={editing.cta_label ?? ""} placeholder="Ex.: Ver oferta" onChange={(e) => setEditing({ ...editing, cta_label: e.target.value })} />
            </div>
            <div>
              <Label>Link do botão</Label>
              <Input value={editing.cta_url ?? ""} placeholder="https://wa.me/55…" onChange={(e) => setEditing({ ...editing, cta_url: e.target.value })} />
            </div>
            {editing.mode !== "top_banner" && (
              <div>
                <Label>Atraso (segundos)</Label>
                <Input
                  type="number"
                  min={0}
                  value={editing.delay_seconds}
                  onChange={(e) => setEditing({ ...editing, delay_seconds: Number(e.target.value) })}
                />
              </div>
            )}
            <div className="md:col-span-2">
              <Label>Imagem (opcional)</Label>
              <div className="flex items-center gap-3 mt-1.5">
                {editing.image_url && (
                  <img src={editing.image_url} alt="" className="size-20 object-contain bg-brand-light rounded" />
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
                  />
                  <Button asChild type="button" variant="outline" disabled={uploading}>
                    <span>
                      {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                      {editing.image_url ? "Trocar imagem" : "Subir imagem"}
                    </span>
                  </Button>
                </label>
                {editing.image_url && (
                  <Button variant="ghost" size="sm" onClick={() => setEditing({ ...editing, image_url: "" })}>
                    Remover
                  </Button>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <Switch
                checked={editing.is_active}
                onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                id="active"
              />
              <Label htmlFor="active" className="cursor-pointer">
                Ativar essa oferta agora (desativa as outras)
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Carregando…</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-md text-sm text-muted-foreground">
          Nenhuma oferta criada ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((o) => (
            <div key={o.id} className="flex items-center gap-4 p-4 border border-border rounded-md bg-card">
              {o.image_url && <img src={o.image_url} alt="" className="size-14 object-contain bg-brand-light rounded shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-lg uppercase">{o.title}</h3>
                  {o.is_active && (
                    <span className="text-[10px] tracking-widest uppercase bg-brand-red text-primary-foreground px-2 py-0.5 rounded-sm">
                      Ativa
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {modeOptions.find((m) => m.value === o.mode)?.label}
                  {o.subtitle && ` · ${o.subtitle}`}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toggleActive(o)} title={o.is_active ? "Desativar" : "Ativar"}>
                {o.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => startEdit(o)}>Editar</Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(o)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOffers;