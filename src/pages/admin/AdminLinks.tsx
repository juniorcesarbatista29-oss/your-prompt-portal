import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/queries";

type NavLink = {
  id: string;
  location: "header" | "footer";
  label: string;
  url: string;
  display_order: number;
  is_visible: boolean;
  open_in_new_tab: boolean;
};

const LOCATIONS: { value: "header" | "footer"; label: string }[] = [
  { value: "header", label: "Header (menu superior)" },
  { value: "footer", label: "Footer (rodapé)" },
];

const AdminLinks = () => {
  const qc = useQueryClient();
  const [activeLoc, setActiveLoc] = useState<"header" | "footer">("header");
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("nav_links")
      .select("*")
      .order("location")
      .order("display_order");
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else {
      setLinks((data ?? []) as NavLink[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const locLinks = links.filter((l) => l.location === activeLoc);

  const update = (id: string, patch: Partial<NavLink>) =>
    setLinks((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const saveLink = async (link: NavLink) => {
    setSavingId(link.id);
    const { error } = await supabase
      .from("nav_links")
      .update({
        label: link.label,
        url: link.url,
        display_order: link.display_order,
        is_visible: link.is_visible,
        open_in_new_tab: link.open_in_new_tab,
      })
      .eq("id", link.id);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Link salvo" });
      qc.invalidateQueries({ queryKey: queryKeys.navLinks(link.location) });
    }
    setSavingId(null);
  };

  const removeLink = async (link: NavLink) => {
    if (!confirm(`Remover o link "${link.label}"?`)) return;
    const { error } = await supabase.from("nav_links").delete().eq("id", link.id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Link removido" });
      qc.invalidateQueries({ queryKey: queryKeys.navLinks(link.location) });
      load();
    }
  };

  const addLink = async () => {
    if (!newLink.label.trim() || !newLink.url.trim()) {
      toast({ title: "Preencha rótulo e URL", variant: "destructive" });
      return;
    }
    setCreating(true);
    const maxOrder = Math.max(0, ...locLinks.map((l) => l.display_order));
    const { error } = await supabase.from("nav_links").insert({
      location: activeLoc,
      label: newLink.label.trim(),
      url: newLink.url.trim(),
      display_order: maxOrder + 10,
    });
    if (error) {
      toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Link criado" });
      setNewLink({ label: "", url: "" });
      qc.invalidateQueries({ queryKey: queryKeys.navLinks(activeLoc) });
      load();
    }
    setCreating(false);
  };

  const move = (link: NavLink, dir: -1 | 1) => {
    const sorted = [...locLinks].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((l) => l.id === link.id);
    const target = sorted[idx + dir];
    if (!target) return;
    const a = link.display_order;
    update(link.id, { display_order: target.display_order });
    update(target.id, { display_order: a });
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl uppercase">Links de navegação</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edite os itens do menu superior e do rodapé.
        </p>
      </header>

      <Tabs value={activeLoc} onValueChange={(v) => setActiveLoc(v as "header" | "footer")}>
        <TabsList>
          {LOCATIONS.map((l) => (
            <TabsTrigger key={l.value} value={l.value}>
              {l.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LOCATIONS.map((l) => (
          <TabsContent key={l.value} value={l.value} className="mt-6 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {locLinks
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((link, i) => (
                    <div key={link.id} className="border border-border rounded-md p-4 bg-card">
                      <div className="grid sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-4">
                          <Label>Rótulo</Label>
                          <Input
                            value={link.label}
                            onChange={(e) => update(link.id, { label: e.target.value })}
                          />
                        </div>
                        <div className="sm:col-span-5">
                          <Label>URL</Label>
                          <Input
                            value={link.url}
                            onChange={(e) => update(link.id, { url: e.target.value })}
                            placeholder="/catalogo ou https://..."
                          />
                        </div>
                        <div className="sm:col-span-3 flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={link.is_visible}
                              onCheckedChange={(v) => update(link.id, { is_visible: v })}
                            />
                            Visível
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={link.open_in_new_tab}
                              onCheckedChange={(v) => update(link.id, { open_in_new_tab: v })}
                            />
                            Abrir em nova aba
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => move(link, -1)}
                          disabled={i === 0}
                          aria-label="Subir"
                        >
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => move(link, 1)}
                          disabled={i === locLinks.length - 1}
                          aria-label="Descer"
                        >
                          <ArrowDown className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLink(link)}
                          aria-label="Remover"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        <div className="ml-auto">
                          <Button onClick={() => saveLink(link)} disabled={savingId === link.id}>
                            {savingId === link.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Save className="size-4" />
                            )}
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                <div className="border border-dashed border-border rounded-md p-5 bg-secondary/30 space-y-3">
                  <div className="text-[11px] tracking-widest uppercase text-muted-foreground">
                    Novo link
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Rótulo (ex.: Catálogo)"
                      value={newLink.label}
                      onChange={(e) => setNewLink((s) => ({ ...s, label: e.target.value }))}
                    />
                    <Input
                      placeholder="URL (/catalogo ou https://...)"
                      value={newLink.url}
                      onChange={(e) => setNewLink((s) => ({ ...s, url: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addLink} disabled={creating} variant="outline">
                    {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    Adicionar link
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminLinks;
