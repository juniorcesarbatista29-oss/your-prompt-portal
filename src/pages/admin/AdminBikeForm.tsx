import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, Star, Trash2, Loader2, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type ImageRow = {
  id: string;
  image_url: string;
  caption: string | null;
  is_cover: boolean;
  display_order: number;
};

type ColorOpt = { name: string; hex: string };

const badgeOptions = [
  { value: "none", label: "Nenhum" },
  { value: "lancamento", label: "Lançamento" },
  { value: "mais_vendida", label: "Mais vendida" },
  { value: "oferta", label: "Oferta" },
  { value: "novidade", label: "Novidade" },
];

const AdminBikeForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "nova";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bikeId, setBikeId] = useState<string | null>(isNew ? null : id!);
  const [images, setImages] = useState<ImageRow[]>([]);

  const [form, setForm] = useState({
    name: "",
    tag: "",
    description: "",
    price: "",
    parcel: "",
    autonomia: "",
    motor: "",
    velocidade: "",
    weight_capacity: "",
    video_url: "",
    badge: "none",
    is_active: true,
    display_order: 0,
  });
  const [colors, setColors] = useState<ColorOpt[]>([]);
  const [newColor, setNewColor] = useState<ColorOpt>({ name: "", hex: "#000000" });

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase
        .from("bikes")
        .select("*, bike_images(*)")
        .eq("id", id!)
        .maybeSingle();
      if (error || !data) {
        toast({ title: "Não encontrada", variant: "destructive" });
        navigate("/admin/bikes");
        return;
      }
      setForm({
        name: data.name ?? "",
        tag: data.tag ?? "",
        description: data.description ?? "",
        price: String(data.price ?? ""),
        parcel: data.parcel ?? "",
        autonomia: data.autonomia ?? "",
        motor: data.motor ?? "",
        velocidade: data.velocidade ?? "",
        weight_capacity: (data as any).weight_capacity ?? "",
        video_url: data.video_url ?? "",
        badge: data.badge ?? "none",
        is_active: data.is_active,
        display_order: data.display_order ?? 0,
      });
      const rawColors = (data as any).colors;
      if (Array.isArray(rawColors)) {
        setColors(
          rawColors
            .filter((c: any) => c && typeof c.name === "string" && typeof c.hex === "string")
            .map((c: any) => ({ name: c.name, hex: c.hex })),
        );
      }
      setImages(
        (data.bike_images ?? []).sort(
          (a: ImageRow, b: ImageRow) => a.display_order - b.display_order,
        ),
      );
      setLoading(false);
    })();
  }, [id, isNew, navigate]);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast({ title: "Preencha nome e preço", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload: any = {
      name: form.name,
      tag: form.tag,
      description: form.description || null,
      price: Number(form.price),
      parcel: form.parcel || null,
      autonomia: form.autonomia || null,
      motor: form.motor || null,
      velocidade: form.velocidade || null,
      weight_capacity: form.weight_capacity || null,
      colors: colors,
      video_url: form.video_url || null,
      badge: form.badge === "none" ? null : (form.badge as any),
      is_active: form.is_active,
      display_order: form.display_order,
    };

    if (isNew) {
      const { data, error } = await supabase.from("bikes").insert(payload).select("id").single();
      setSaving(false);
      if (error) {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Bicicleta criada — agora adicione as fotos" });
      setBikeId(data.id);
      navigate(`/admin/bikes/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase.from("bikes").update(payload).eq("id", bikeId!);
      setSaving(false);
      if (error) {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Alterações salvas" });
    }
  };

  const reloadImages = async () => {
    if (!bikeId) return;
    const { data } = await supabase
      .from("bike_images")
      .select("*")
      .eq("bike_id", bikeId)
      .order("display_order");
    setImages((data ?? []) as ImageRow[]);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !bikeId) return;
    setUploading(true);
    const startOrder = images.length;
    let i = 0;
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${bikeId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("bike-media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) {
        toast({ title: `Falha em ${file.name}`, description: upErr.message, variant: "destructive" });
        continue;
      }
      const { data: pub } = supabase.storage.from("bike-media").getPublicUrl(path);
      await supabase.from("bike_images").insert({
        bike_id: bikeId,
        image_url: pub.publicUrl,
        display_order: startOrder + i,
        is_cover: images.length === 0 && i === 0,
      });
      i++;
    }
    setUploading(false);
    await reloadImages();
    toast({ title: "Fotos enviadas" });
  };

  const updateCaption = async (img: ImageRow, caption: string) => {
    await supabase.from("bike_images").update({ caption }).eq("id", img.id);
  };

  const setCover = async (img: ImageRow) => {
    if (!bikeId) return;
    await supabase.from("bike_images").update({ is_cover: false }).eq("bike_id", bikeId);
    await supabase.from("bike_images").update({ is_cover: true }).eq("id", img.id);
    reloadImages();
  };

  const deleteImage = async (img: ImageRow) => {
    // try to clean from storage too
    const url = new URL(img.image_url);
    const idx = url.pathname.indexOf("/bike-media/");
    if (idx >= 0) {
      const path = decodeURIComponent(url.pathname.substring(idx + "/bike-media/".length));
      await supabase.storage.from("bike-media").remove([path]);
    }
    await supabase.from("bike_images").delete().eq("id", img.id);
    reloadImages();
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Carregando…</div>;
  }

  return (
    <div>
      <Link to="/admin/bikes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <h1 className="font-display text-3xl md:text-4xl uppercase mb-6">
        {isNew ? "Nova bicicleta" : form.name || "Editar"}
      </h1>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border border-border rounded-md bg-card">
          <div className="md:col-span-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="tag">Categoria / tag</Label>
            <Input id="tag" value={form.tag} placeholder="Ex.: Cidade, Mountain, Moped" onChange={(e) => update("tag", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="badge">Selo</Label>
            <Select value={form.badge} onValueChange={(v) => update("badge", v)}>
              <SelectTrigger id="badge"><SelectValue /></SelectTrigger>
              <SelectContent>
                {badgeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Texto que aparece no detalhe da bicicleta"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border border-border rounded-md bg-card">
          <div>
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="parcel">Parcelamento (opcional)</Label>
            <Input id="parcel" value={form.parcel} placeholder="12x R$ 707" onChange={(e) => update("parcel", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="display_order">Ordem na vitrine</Label>
            <Input id="display_order" type="number" value={form.display_order} onChange={(e) => update("display_order", Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="autonomia">Autonomia</Label>
            <Input id="autonomia" value={form.autonomia} placeholder="120km" onChange={(e) => update("autonomia", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="motor">Motor</Label>
            <Input id="motor" value={form.motor} placeholder="1000W" onChange={(e) => update("motor", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="velocidade">Vel. máx.</Label>
            <Input id="velocidade" value={form.velocidade} placeholder="45km/h" onChange={(e) => update("velocidade", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="weight_capacity">Peso suportado</Label>
            <Input id="weight_capacity" value={form.weight_capacity} placeholder="120kg" onChange={(e) => update("weight_capacity", e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="video_url">Link do vídeo (YouTube/Vimeo)</Label>
            <Input id="video_url" type="url" value={form.video_url} placeholder="https://youtube.com/watch?v=…" onChange={(e) => update("video_url", e.target.value)} />
          </div>
        </section>

        <section className="p-5 border border-border rounded-md bg-card space-y-4">
          <div>
            <h2 className="font-display text-xl uppercase">Cores disponíveis</h2>
            <p className="text-sm text-muted-foreground">Adicione todas as cores em que esta bike é vendida. Aparecem como bolinhas para o cliente escolher.</p>
          </div>

          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map((c, idx) => (
                <div
                  key={`${c.hex}-${idx}`}
                  className="flex items-center gap-2 pl-1.5 pr-1 py-1 rounded-full border border-border bg-background"
                >
                  <span
                    className="size-6 rounded-full border border-border shadow-inner"
                    style={{ backgroundColor: c.hex }}
                    aria-hidden
                  />
                  <span className="text-sm">{c.name}</span>
                  <button
                    type="button"
                    aria-label={`Remover cor ${c.name}`}
                    onClick={() => setColors((prev) => prev.filter((_, i) => i !== idx))}
                    className="size-6 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
            <div>
              <Label htmlFor="color_name">Nome da cor</Label>
              <Input
                id="color_name"
                value={newColor.name}
                placeholder="Ex.: Preto fosco"
                onChange={(e) => setNewColor((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="color_hex">Cor</Label>
              <input
                id="color_hex"
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor((p) => ({ ...p, hex: e.target.value }))}
                className="h-10 w-16 rounded-md border border-input bg-background cursor-pointer"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!newColor.name.trim()) {
                  toast({ title: "Dê um nome para a cor", variant: "destructive" });
                  return;
                }
                setColors((prev) => [...prev, { name: newColor.name.trim(), hex: newColor.hex }]);
                setNewColor({ name: "", hex: "#000000" });
              }}
            >
              <Plus className="size-4" /> Adicionar cor
            </Button>
          </div>
        </section>

        <section className="flex items-center gap-3 p-5 border border-border rounded-md bg-card">
          <Switch id="is_active" checked={form.is_active} onCheckedChange={(v) => update("is_active", v)} />
          <Label htmlFor="is_active" className="cursor-pointer">
            Visível no site
          </Label>
        </section>

        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/80 backdrop-blur py-3">
          <Link to="/admin/bikes">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Salvando…" : isNew ? "Criar bicicleta" : "Salvar alterações"}
          </Button>
        </div>
      </form>

      {!isNew && bikeId && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl uppercase">Fotos</h2>
              <p className="text-sm text-muted-foreground">A foto marcada com estrela é a capa.</p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
              <Button asChild type="button" disabled={uploading}>
                <span>
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Subir fotos
                </span>
              </Button>
            </label>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-md text-sm text-muted-foreground">
              Nenhuma foto. Suba uma ou mais imagens do seu computador.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="border border-border rounded-md overflow-hidden bg-card">
                  <div className="aspect-square bg-brand-light grid place-items-center">
                    <img src={img.image_url} alt={img.caption ?? ""} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-3 space-y-3">
                    <Input
                      defaultValue={img.caption ?? ""}
                      placeholder="Legenda (opcional)"
                      onBlur={(e) => updateCaption(img, e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCover(img)}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <Checkbox checked={img.is_cover} />
                        <Star className={`size-3.5 ${img.is_cover ? "text-brand-red fill-brand-red" : "text-muted-foreground"}`} />
                        Capa
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteImage(img)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminBikeForm;