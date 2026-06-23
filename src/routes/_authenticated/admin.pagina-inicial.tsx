import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/pagina-inicial")({
  component: AdminPaginaInicial,
});

type Texto = { chave: string; valor: string };

const CAMPOS = [
  { chave: "home_titulo", label: "Título de boas-vindas", multiline: false },
  { chave: "home_paragrafo1", label: "Parágrafo 1 da home", multiline: true },
  { chave: "home_paragrafo2", label: "Parágrafo 2 da home", multiline: true },
  { chave: "home_versiculo", label: "Versículo destacado (home)", multiline: false },
  { chave: "ministerial_subtitulo", label: "Subtítulo da Gestão Ministerial", multiline: true },
] as const;

function AdminPaginaInicial() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-textos"],
    queryFn: async (): Promise<Texto[]> => {
      const { data, error } = await supabase.from("pagina_textos").select("chave, valor");
      if (error) throw error;
      return data as Texto[];
    },
  });

  const [valores, setValores] = useState<Record<string, string>>({});
  useEffect(() => {
    const map: Record<string, string> = {};
    for (const t of data) map[t.chave] = t.valor;
    setValores(map);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = CAMPOS.map((c) => ({ chave: c.chave, valor: valores[c.chave] ?? "" }));
      const { error } = await supabase
        .from("pagina_textos")
        .upsert(rows, { onConflict: "chave" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Textos salvos");
      qc.invalidateQueries({ queryKey: ["admin-textos"] });
      qc.invalidateQueries({ queryKey: ["site-textos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-white/60">Carregando...</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-md border border-gold/30 bg-gold/5 p-4 text-sm text-white/80">
        Os banners do carrossel da Página Inicial são gerenciados na aba <strong>Mídia</strong>.
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="space-y-4 rounded-xl border border-white/10 bg-[color:var(--card)] p-5"
      >
        <h2 className="font-display text-lg font-black text-white">Textos das páginas</h2>
        {CAMPOS.map((c) => (
          <label key={c.chave} className="block text-xs font-bold uppercase tracking-widest text-white/70">
            {c.label}
            {c.multiline ? (
              <textarea
                rows={4}
                value={valores[c.chave] ?? ""}
                onChange={(e) => setValores((v) => ({ ...v, [c.chave]: e.target.value }))}
                className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white focus:border-gold focus:outline-none"
              />
            ) : (
              <input
                value={valores[c.chave] ?? ""}
                onChange={(e) => setValores((v) => ({ ...v, [c.chave]: e.target.value }))}
                className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white focus:border-gold focus:outline-none"
              />
            )}
          </label>
        ))}
        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-md bg-gold px-4 py-2 text-sm font-black text-[color:var(--navy)] disabled:opacity-60"
        >
          {save.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </section>
  );
}
