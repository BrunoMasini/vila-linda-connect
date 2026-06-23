import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/logo-admvl.jpeg.asset.json";


const links = [
  { to: "/", label: "Página Inicial" },
  { to: "/eventos", label: "Eventos" },
  { to: "/ministerial", label: "Gestão Ministerial" },
  { to: "/biblia", label: "Bíblia Sagrada" },
  { to: "/obra", label: "Faça a Obra" },
  { to: "/contatos", label: "Contatos" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:var(--navy-deep)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--navy-deep)]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--navy-deep)]">
            <img
              src={logoAsset.url}
              alt="Logo Assembleia de Deus Ministério Vila Linda"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate font-display text-sm font-extrabold leading-tight text-white sm:text-base">
              Assembleia de Deus
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.18em] text-gold sm:text-xs">
              Ministério Vila Linda
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-gold" }}
              inactiveProps={{ className: "text-white/80 hover:text-white" }}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/auth"
            className="ml-2 rounded-md border border-gold px-3 py-2 text-sm font-bold text-gold transition-colors hover:bg-gold hover:text-[color:var(--navy)]"
          >
            Acesso Admin
          </Link>
        </nav>



        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-white lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-[color:var(--navy-deep)] px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "text-gold bg-white/5" }}
              inactiveProps={{ className: "text-white/80" }}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-3 text-base font-semibold"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-md border border-gold px-3 py-3 text-base font-bold text-gold"
          >
            Acesso Admin
          </Link>
        </nav>

      )}
    </header>
  );
}
