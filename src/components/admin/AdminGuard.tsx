import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { loading, user, isAdmin } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-sm text-muted-foreground tracking-widest uppercase">
          Carregando…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-6 text-center">
        <div>
          <h1 className="font-display text-3xl uppercase">Sem permissão</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Esta conta não tem acesso de administrador.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};