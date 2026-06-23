import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const tabs = [
  { to: "/admin/pagina-inicial", label: "Página Inicial" },
  { to: "/admin/eventos", label: "Eventos" },
  { to: "/admin/midia", label: "Mídia" },
  { to: "/admin/biografias", label: "Biografias" },
  { to: "/admin/aniversariantes", label: "Aniversariantes" },
  { to: "/admin/obra", label: "Faça a Obra" },
  { to: "/admin/contatos", label: "Contatos" },
] as const;

function AdminLayout() {
  const navigate = useNavigate();

  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">CMS</p>
          <h1 className="mt-1 truncate font-display text-2xl font-black text-white sm:text-3xl">
            Painel Administrativo
          </h1>
        </div>
        <button
          type="button"
          onClick={sair}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white hover:border-gold hover:text-gold"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeProps={{ className: "bg-gold text-[color:var(--navy)]" }}
            inactiveProps={{ className: "text-white/80 hover:bg-white/5" }}
            className="rounded-md px-4 py-2 text-sm font-bold"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
