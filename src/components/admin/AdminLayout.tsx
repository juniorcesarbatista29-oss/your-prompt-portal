import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bike, Megaphone, KeyRound, LogOut, ExternalLink, Settings, FileText, Link2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin/bikes", label: "Bicicletas", icon: Bike },
  { to: "/admin/ofertas", label: "Ofertas", icon: Megaphone },
  { to: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { to: "/admin/site", label: "Site", icon: Settings },
  { to: "/admin/links", label: "Links", icon: Link2 },
  { to: "/admin/conta", label: "Senha", icon: KeyRound },
];

export const AdminLayout = () => {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-secondary/40 lg:min-h-screen">
        <div className="px-5 py-6 border-b border-border">
          <div className="font-display text-xl uppercase tracking-wide">Painel</div>
          <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">
            Filadelfo Motors
          </div>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block p-3 mt-auto border-t border-border">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            Ver site
          </a>
          <div className="px-3 py-2 text-[11px] text-muted-foreground truncate">
            {user?.email}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full mt-1"
          >
            <LogOut className="size-4" /> Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="size-4" /> Sair
          </Button>
        </div>
        <div className="p-5 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};