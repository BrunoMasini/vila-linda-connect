import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { livros } from "@/data/biblia-livros";
import { getCapitulo } from "@/lib/biblia.functions";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/biblia")({
  head: () => ({
    meta: [
      { title: "Bíblia Sagrada — AD Vila Linda" },
      { name: "description", content: "Leia a Bíblia Sagrada — Almeida." },
    ],
  }),
  component: BibliaPage,
});

function BibliaPage() {
  const [livroAbrev, setLivroAbrev] = useState<string | null>(null);
  const [capitulo, setCapitulo] = useState<number | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  const livro = livros.find((l) => l.abrev === livroAbrev) ?? null;
  const fetchCap = useServerFn(getCapitulo);

  const { data: dadosCap, isFetching } = useQuery({
    queryKey: ["biblia", livroAbrev, capitulo],
    queryFn: () => fetchCap({ data: { abrev: livroAbrev!, capitulo: capitulo! } }),
    enabled: !!livroAbrev && !!capitulo,
  });

  const at = livros.filter((l) => l.testamento === "AT");
  const nt = livros.filter((l) => l.testamento === "NT");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Palavra</p>
        <h1 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">
          Bíblia Sagrada
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          className={`rounded-xl border border-white/10 bg-[color:var(--card)] ${
            mobileSidebarOpen ? "block" : "hidden"
          } lg:block`}
        >
          <div className="max-h-[70vh] overflow-y-auto p-4">
            <Secao titulo="Antigo Testamento" livros={at} ativo={livroAbrev} onPick={(a) => { setLivroAbrev(a); setCapitulo(null); }} />
            <Secao titulo="Novo Testamento" livros={nt} ativo={livroAbrev} onPick={(a) => { setLivroAbrev(a); setCapitulo(null); }} />
          </div>
        </aside>

        <section className="rounded-xl border border-white/10 bg-[color:var(--card)] p-4 sm:p-6">
          {!livro && (
            <p className="py-16 text-center text-white/60">
              Selecione um livro à esquerda para começar a leitura.
            </p>
          )}

          {livro && !capitulo && (
            <div>
              <button
                type="button"
                onClick={() => { setLivroAbrev(null); setMobileSidebarOpen(true); }}
                className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-gold lg:hidden"
              >
                <ChevronLeft className="h-4 w-4" /> Voltar
              </button>
              <h2 className="font-display text-2xl font-black text-white">{livro.nome}</h2>
              <p className="mt-1 text-sm text-white/60">Escolha o capítulo:</p>
              <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-10">
                {Array.from({ length: livro.capitulos }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setCapitulo(n); setMobileSidebarOpen(false); }}
                    className="aspect-square rounded-md border border-white/10 text-sm font-bold text-white transition hover:border-gold hover:text-gold"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {livro && capitulo && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCapitulo(null)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-gold"
                >
                  <ChevronLeft className="h-4 w-4" /> Capítulos
                </button>
                <h2 className="font-display text-lg font-black text-white sm:text-2xl">
                  {livro.nome} {capitulo}
                </h2>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={capitulo <= 1}
                    onClick={() => setCapitulo(capitulo - 1)}
                    className="rounded-md border border-white/10 px-3 py-1 text-sm font-semibold text-white disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    disabled={capitulo >= livro.capitulos}
                    onClick={() => setCapitulo(capitulo + 1)}
                    className="rounded-md border border-white/10 px-3 py-1 text-sm font-semibold text-white disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              </div>

              {isFetching && <p className="py-12 text-center text-white/60">Carregando...</p>}
              {!isFetching && dadosCap && (
                <article className="prose-biblia max-w-none space-y-3 text-[17px] leading-[1.85] text-white/90">
                  {dadosCap.versiculos.map((v) => (
                    <p key={v.numero}>
                      <sup className="mr-2 font-bold text-gold">{v.numero}</sup>
                      {v.texto}
                    </p>
                  ))}
                </article>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Secao({
  titulo,
  livros,
  ativo,
  onPick,
}: {
  titulo: string;
  livros: { abrev: string; nome: string }[];
  ativo: string | null;
  onPick: (abrev: string) => void;
}) {
  return (
    <div className="mb-4">
      <p className="mb-2 px-2 text-xs font-black uppercase tracking-widest text-gold">{titulo}</p>
      <ul className="space-y-0.5">
        {livros.map((l) => (
          <li key={l.abrev}>
            <button
              type="button"
              onClick={() => onPick(l.abrev)}
              className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition ${
                ativo === l.abrev
                  ? "bg-gold font-bold text-[color:var(--navy)]"
                  : "text-white/85 hover:bg-white/5"
              }`}
            >
              {l.nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
