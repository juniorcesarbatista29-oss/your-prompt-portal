import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const AdminAccount = () => {
  const { user } = useAdminAuth();
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) {
      toast({ title: "A senha precisa ter pelo menos 8 caracteres", variant: "destructive" });
      return;
    }
    if (pwd !== pwd2) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSaving(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha alterada com sucesso" });
      setPwd("");
      setPwd2("");
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="font-display text-3xl md:text-4xl uppercase">Sua conta</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">{user?.email}</p>

      <form onSubmit={handleSubmit} className="space-y-4 p-5 border border-border rounded-md bg-card">
        <h2 className="font-display text-lg uppercase">Trocar senha</h2>
        <div>
          <Label htmlFor="pwd">Nova senha</Label>
          <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} minLength={8} required />
        </div>
        <div>
          <Label htmlFor="pwd2">Confirmar nova senha</Label>
          <Input id="pwd2" type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} minLength={8} required />
        </div>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Salvando…" : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
};

export default AdminAccount;