import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const AdminSignup = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Criar admin · Filadelfo Motors";
  }, []);

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin/bikes" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "Use pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin/login` },
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Não foi possível cadastrar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Conta criada!",
      description: "Você já é o administrador. Redirecionando…",
    });
    // Pequeno delay para o trigger do banco rodar
    setTimeout(() => navigate("/admin/bikes", { replace: true }), 800);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="size-12 rounded-full bg-foreground text-background grid place-items-center mx-auto mb-4">
            <UserPlus className="size-5" />
          </div>
          <h1 className="font-display text-3xl uppercase">Criar admin</h1>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mt-2">
            Cadastro inicial
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            O primeiro usuário criado será automaticamente o administrador deste
            painel. Cadastros seguintes não terão acesso.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-secondary/40 border border-border rounded-md p-6"
        >
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha (mín. 6 caracteres)</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Criando…" : "Criar conta"}
          </Button>
          <p className="text-center text-xs text-muted-foreground pt-2">
            Já tem conta?{" "}
            <a href="/admin/login" className="underline hover:text-foreground">
              Entrar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
