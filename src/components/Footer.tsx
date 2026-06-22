export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[color:var(--navy-deep)] py-8 text-center text-sm text-white/70">
      <div className="mx-auto max-w-7xl px-4">
        <p className="font-display font-bold text-white">
          Igreja Assembleia de Deus — Ministério Vila Linda
        </p>
        <p className="mt-2 text-xs text-white/60">
          © {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
