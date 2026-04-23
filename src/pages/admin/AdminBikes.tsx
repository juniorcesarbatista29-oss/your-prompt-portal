import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BikeRow = {
  id: string;
  name: string;
  tag: string;
  price: number;
  badge: string | null;
  is_active: boolean;
  display_order: number;
  cover?: string | null;
};

const badgeLabels: Record<string, string> = {
  lancamento: "Lançamento",
  mais_vendida: "Mais vendida",
  oferta: "Oferta",
  novidade: "Novidade",
};

const AdminBikes = () => {
  const [bikes, setBikes] = useState<BikeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<BikeRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bikes")
      .select("id, name, tag, price, badge, is_active, display_order, bike_images(image_url, is_cover, display_order)")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else {
      setBikes(
        (data ?? []).map((b: any) => {
          const imgs = (b.bike_images ?? []).slice().sort(
            (a: any, c: any) => (b.is_cover ? -1 : 0) || a.display_order - c.display_order,
          );
          const cover = imgs.find((i: any) => i.is_cover)?.image_url ?? imgs[0]?.image_url ?? null;
          return { ...b, cover };
        }),
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (bike: BikeRow) => {
    const { error } = await supabase
      .from("bikes")
      .update({ is_active: !bike.is_active })
      .eq("id", bike.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      load();
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("bikes").delete().eq("id", toDelete.id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bicicleta excluída" });
      setToDelete(null);
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl uppercase">Bicicletas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o catálogo exibido no site.
          </p>
        </div>
        <Link to="/admin/bikes/nova">
          <Button size="lg">
            <Plus className="size-4" /> Nova
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Carregando…</div>
      ) : bikes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-md">
          <p className="text-sm text-muted-foreground">
            Nenhuma bicicleta cadastrada ainda.
          </p>
          <Link to="/admin/bikes/nova" className="inline-block mt-4">
            <Button>
              <Plus className="size-4" /> Cadastrar primeira bike
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bikes.map((bike) => (
            <article
              key={bike.id}
              className="flex gap-4 p-4 border border-border rounded-md bg-card"
            >
              <div className="size-24 shrink-0 bg-brand-light rounded overflow-hidden grid place-items-center">
                {bike.cover ? (
                  <img src={bike.cover} alt={bike.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">Sem foto</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg uppercase truncate">{bike.name}</h3>
                    <div className="text-xs text-muted-foreground">{bike.tag}</div>
                  </div>
                  {bike.badge && (
                    <Badge variant="secondary" className="shrink-0">
                      {badgeLabels[bike.badge] ?? bike.badge}
                    </Badge>
                  )}
                </div>
                <div className="font-display text-xl mt-2">
                  R$ {Number(bike.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(bike)}
                    title={bike.is_active ? "Ocultar do site" : "Mostrar no site"}
                  >
                    {bike.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4 text-muted-foreground" />}
                    <span className="text-xs">{bike.is_active ? "Visível" : "Oculta"}</span>
                  </Button>
                  <Link to={`/admin/bikes/${bike.id}`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="size-4" /> Editar
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setToDelete(bike)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir “{toDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. As fotos vinculadas também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBikes;