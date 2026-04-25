import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Upload, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/queries";

type Block = {
  id: string;
  page: string;
  block_key: string;
  label: string | null;
  text_value: string | null;
  long_text_value: string | null;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
};

const PAGES = [
  { value: "home", label: "Home" },
  { value: "sobre", label: "Sobre" },
];

const AdminContent = () => {
  const qc = useQueryClient();
  const [activePage, setActivePage] = useState("home");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newBlock, setNewBlock] = useState({ block_key: "", label: "" });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .order("page")
      .order("display_order");
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else {
      setBlocks((data ?? []) as Block[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const pageBlocks = useMemo(
    () => blocks.filter((b) => b.page === activePage),
    [blocks, activePage]
  );

  const update = (id: string, patch: Partial<Block>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const handleUpload = async (block: Block, file: File) => {
    setUploadingId(block.id);
    const ext = file.name.split(".").pop();
    const path = `site/${block.page}-${block.block_key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("bike-media").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("bike-media").getPublicUrl(path);
      update(block.id, { image_url: data.publicUrl });
    }
    setUploadingId(null);
  };

  const saveBlock = async (block: Block) => {
    setSavingId(block.id);
    const { error } = await supabase
      .from("page_content")
      .update({
        label: block.label,
        text_value: block.text_value,
        long_text_value: block.long_text_value,
        image_url: block.image_url,
        link_url: block.link_url,
        display_order: block.display_order,
      })
      .eq("id", block.id);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bloco salvo" });
      qc.invalidateQueries({ queryKey: queryKeys.pageContent(block.page) });
    }
    setSavingId(null);
  };

  const removeBlock = async (block: Block) => {
    if (!confirm(`Remover o bloco "${block.label || block.block_key}"?`)) return;
    const { error } = await supabase.from("page_content").delete().eq("id", block.id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bloco removido" });
      qc.invalidateQueries({ queryKey: queryKeys.pageContent(block.page) });
      load();
    }
  };

  const addBlock = async () => {
    if (!newBlock.block_key.trim()) {
      toast({ title: "Informe a chave do bloco", variant: "destructive" });
      return;
    }
    setCreating(true);
    const maxOrder = Math.max(0, ...pageBlocks.map((b) => b.display_order));
    const { error } = await supabase.from("page_content").insert({
      page: activePage,
      block_key: newBlock.block_key.trim(),
      label: newBlock.label.trim() || null,
      display_order: maxOrder + 10,
    });
    if (error) {
      toast({ title: "Erro ao criar bloco", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bloco criado" });
      setNewBlock({ block_key: "", label: "" });
      qc.invalidateQueries({ queryKey: queryKeys.pageContent(activePage) });
      load();
    }
    setCreating(false);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl uppercase">Conteúdo das páginas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edite títulos, parágrafos e imagens de cada bloco do site.
        </p>
      </header>

      <Tabs value={activePage} onValueChange={setActivePage}>
        <TabsList>
          {PAGES.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGES.map((p) => (
          <TabsContent key={p.value} value={p.value} className="mt-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {pageBlocks.map((block) => (
                  <div key={block.id} className="border border-border rounded-md p-5 bg-card space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
                          {block.block_key} · ordem {block.display_order}
                        </div>
                        <Input
                          className="mt-1 font-medium"
                          value={block.label ?? ""}
                          onChange={(e) => update(block.id, { label: e.target.value })}
                          placeholder="Rótulo amigável"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBlock(block)}
                        aria-label="Remover"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Texto curto</Label>
                        <Input
                          value={block.text_value ?? ""}
                          onChange={(e) => update(block.id, { text_value: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Link</Label>
                        <Input
                          value={block.link_url ?? ""}
                          onChange={(e) => update(block.id, { link_url: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Texto longo</Label>
                      <Textarea
                        value={block.long_text_value ?? ""}
                        onChange={(e) => update(block.id, { long_text_value: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Imagem</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          value={block.image_url ?? ""}
                          onChange={(e) => update(block.id, { image_url: e.target.value })}
                          placeholder="https://..."
                        />
                        <label className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-border cursor-pointer hover:border-foreground transition-colors whitespace-nowrap">
                          {uploadingId === block.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Upload className="size-3.5" />
                          )}
                          Enviar
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUpload(block, f);
                            }}
                            disabled={uploadingId === block.id}
                          />
                        </label>
                      </div>
                      {block.image_url && (
                        <img
                          src={block.image_url}
                          alt=""
                          className="mt-2 max-h-32 rounded-md border border-border object-cover"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      <div className="w-24">
                        <Label className="text-[10px]">Ordem</Label>
                        <Input
                          type="number"
                          value={block.display_order}
                          onChange={(e) =>
                            update(block.id, { display_order: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="ml-auto">
                        <Button onClick={() => saveBlock(block)} disabled={savingId === block.id}>
                          {savingId === block.id ? (
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
                    Novo bloco
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Chave (ex.: hero_title)"
                      value={newBlock.block_key}
                      onChange={(e) =>
                        setNewBlock((s) => ({ ...s, block_key: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Rótulo amigável"
                      value={newBlock.label}
                      onChange={(e) => setNewBlock((s) => ({ ...s, label: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addBlock} disabled={creating} variant="outline">
                    {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    Adicionar bloco
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

export default AdminContent;
