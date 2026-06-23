import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/obra")({
  component: AdminObra,
});

type Card = {
  id: string;
  icone: string;
  titulo: string;
  texto: string;
  detalhe: string;
  ordem: number;
};

const ICONES = [
  { value: "heart", label: "Coração" },
  { value: "handheart", label: "Mãos com coração" },
  { value: "send", label: "Avião (envio/missões)" },
  { value: "users", label: "Pessoas" },
  { value: "book", label: "Bíblia / livro" },
  { value: "church", label: "Igreja" },
];

function AdminObra() {
  const qc = useQueryClient();

  // Texto do versículo do topo
  const { data: textos = [] } = useQuery({
    queryKey: ["admin-textos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pagina_textos").select("chave, valor");
      if (error) throw error;
      return data as { chave: string; valor: string }[];
    },
  });
  const [versiculo, setVersiculo] = useState("");
  useEffect(() => {
    const v = textos.find((t) => t.chave === "obra_versiculo_topo")?.valor ?? "";
    setVersiculo(v);
  }, [textos]);

  const saveVersiculo = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("pagina_textos")
        .upsert({ chave: "obra_versiculo_topo", valor: versiculo }, { onConflict: "chave" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Versículo salvo");
      qc.invalidateQueries({ queryKey: ["admin-textos"] });
      qc.invalidateQueries({ queryKey: ["site-textos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Cards
  const { data: cards = [] } = useQuery({
    queryKey: ["admin-obra-cards"],
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase.from("obra_cards").select("*").order("ordem", { ascending: true });
      if (error) throw error;
      return data as Card[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("obra_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Card removido");
      qc.invalidateQueries({ queryKey: ["admin-obra-cards"] });
      qc.invalidateQueries({ queryKey: ["obra-cards"] });
    },
  });

  return (
    <section className="space-y-6">
      <form
        onSubmit={(e) => { e.preventDefault(); saveVersiculo.mutate(); }}
        className="space-y-3 rounded-xl border border-white/10 bg-[color:var(--card)] p-5"
      >
        <h2 className="font-display text-lg font-black text-white">Versículo do topo</h2>
        <textarea
          rows={3}
          value={versiculo}
          onChange={(e) => setVersiculo(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={saveVersiculo.isPending}
          className="rounded-md bg-gold px-4 py-2 text-sm font-black text-[color:var(--navy)] disabled:opacity-60"
        >
          {saveVersiculo.isPending ? "Salvando..." : "Salvar versículo"}
        </button>
      </form>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-black text-white">Cards da página</h2>
          <CardDialog
            trigger={
              <button className="inline-flex items-center gap-1 rounded-md bg-gold px-3 py-2 text-sm font-bold text-[color:var(--navy)]">
                <Plus className="h-4 w-4" /> Novo card
              </button>
            }
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <article key={c.id} className="rounded-xl border border-white/10 bg-[color:var(--card)] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">
                {ICONES.find((i) => i.value === c.icone)?.label ?? c.icone} · ordem {c.ordem}
              </p>
              <h3 className="mt-2 font-display text-base font-black text-white">{c.titulo}</h3>
              <p className="mt-1 line-clamp-3 text-xs text-white/70">{c.texto}</p>
              <p className="mt-2 whitespace-pre-line border-t border-white/10 pt-2 text-xs font-semibold text-gold">
                {c.detalhe}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <CardDialog
                  card={c}
                  trigger={
                    <button className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                      <Pencil className="h-4 w-4" />
                    </button>
                  }
                />
                <button
                  onClick={() => { if (confirm("Excluir este card?")) del.mutate(c.id); }}
                  className="rounded p-1.5 text-white/70 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
          {cards.length === 0 && <p className="text-white/60">Nenhum card cadastrado.</p>}
        </div>
      </div>
    </section>
  );
}

function CardDialog({ card, trigger }: { card?: Card; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [icone, setIcone] = useState(card?.icone ?? "heart");
  const [titulo, setTitulo] = useState(card?.titulo ?? "");
  const [texto, setTexto] = useState(card?.texto ?? "");
  const [detalhe, setDetalhe] = useState(card?.detalhe ?? "");
  const [ordem, setOrdem] = useState(card?.ordem ?? 0);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { icone, titulo, texto, detalhe, ordem };
      if (card) {
        const { error } = await supabase.from("obra_cards").update(payload).eq("id", card.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("obra_cards").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvo");
      qc.invalidateQueries({ queryKey: ["admin-obra-cards"] });
      qc.invalidateQueries({ queryKey: ["obra-cards"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[color:var(--card)] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{card ? "Editar card" : "Novo card"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Ícone
            <select
              value={icone}
              onChange={(e) => setIcone(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case text-white"
            >
              {ICONES.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
              Título
              <input
                value={titulo} required
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case text-white"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
              Ordem
              <input
                type="number" value={ordem}
                onChange={(e) => setOrdem(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case text-white"
              />
            </label>
          </div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Texto principal
            <textarea
              rows={3} value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case text-white"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Detalhe (ex.: PIX, horários — quebras de linha são preservadas)
            <textarea
              rows={2} value={detalhe}
              onChange={(e) => setDetalhe(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case text-white"
            />
          </label>
          <DialogFooter>
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-md bg-gold px-4 py-2 text-sm font-black text-[color:var(--navy)] disabled:opacity-60"
            >
              {save.isPending ? "Salvando..." : "Salvar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
