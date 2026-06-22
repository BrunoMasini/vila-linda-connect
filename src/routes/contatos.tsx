import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Mail, Instagram, Facebook, Youtube } from "lucide-react";

export const Route = createFileRoute("/contatos")({
  head: () => ({
    meta: [
      { title: "Contatos — AD Vila Linda" },
      { name: "description", content: "Telefones, endereço e redes sociais." },
    ],
  }),
  component: ContatosPage,
});

function ContatosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Fale Conosco</p>
        <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">Contatos</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Linha icon={MapPin} titulo="Endereço">
            Vila Linda — atualize com o endereço completo da igreja
          </Linha>
          <Linha icon={Phone} titulo="Telefone">
            (00) 0000-0000
          </Linha>
          <Linha icon={Mail} titulo="E-mail">
            contato@advilalinda.com.br
          </Linha>
          <div className="rounded-xl border border-white/10 bg-[color:var(--card)] p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">
              Redes Sociais
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: Instagram, label: "Instagram", href: "#" },
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Youtube, label: "YouTube", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[color:var(--card)]">
          <iframe
            title="Mapa"
            src="https://www.google.com/maps?q=Vila+Linda+Santo+Andre&output=embed"
            className="h-[420px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function Linha({
  icon: Icon,
  titulo,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-[color:var(--card)] p-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">{titulo}</p>
        <p className="mt-1 text-sm text-white/90">{children}</p>
      </div>
    </div>
  );
}
