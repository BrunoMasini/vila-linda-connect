import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { removerDoStorage, uploadEAssinar } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/aniversariantes")({
  component: AdminAniversariantes,
});

type Aniv = { id: string; nome: string; data_nascimento: string; foto_url: string | null };

function AdminAniversariantes() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-aniversariantes"],
    queryFn: async (): Promise<Aniv[]> => {
      const { data, error } = await supabase
        .from("aniversariantes")
        .select("*")
        .order("data_nascimento", { ascending: true });
      if (error) throw error;
      return data as Aniv[];
    },
  });

  const del = useMutation({
    mutationFn: async (a: Aniv) => {
      if (a.foto_url) await removerDoStorage("aniversariantes", a.foto_url);
      const { error } = await supabase.from("aniversariantes").delete().eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removido");
      qc.invalidateQueries({ queryKey: ["admin-aniversariantes"] });
      qc.invalidateQueries({ queryKey: ["aniversariantes"] });
    },
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-black text-white">Aniversariantes</h2>
        <AnivDialog
          trigger={
            <button className="inline-flex items-center gap-1 rounded-md bg-gold px-3 py-2 text-sm font-bold text-[color:var(--navy)]">
              <Plus className="h-4 w-4" /> Novo
            </button>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((a) => (
          <article key={a.id} className="overflow-hidden rounded-xl border border-white/10 bg-[color:var(--card)]">
            <div className="aspect-square bg-[color:var(--navy-deep)]">
              {a.foto_url && <img src={a.foto_url} alt={a.nome} className="h-full w-full object-cover" />}
            </div>
            <div className="p-3 text-center">
              <p className="truncate text-sm font-bold text-white">{a.nome}</p>
              <p className="text-xs text-gold">
                {new Date(a.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
              </p>
              <div className="mt-2 flex justify-center gap-1">
                <AnivDialog
                  aniv={a}
                  trigger={
                    <button className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                      <Pencil className="h-4 w-4" />
                    </button>
                  }
                />
                <button
                  onClick={() => { if (confirm("Excluir?")) del.mutate(a); }}
                  className="rounded p-1.5 text-white/70 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
        {data.length === 0 && <p className="text-white/60">Nenhum aniversariante cadastrado.</p>}
      </div>
    </section>
  );
}

function AnivDialog({ aniv, trigger }: { aniv?: Aniv; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(aniv?.nome ?? "");
  const [data, setData] = useState(aniv?.data_nascimento ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let foto_url = aniv?.foto_url ?? null;
      if (file) {
        if (aniv?.foto_url) await removerDoStorage("aniversariantes", aniv.foto_url);
        foto_url = await uploadEAssinar("aniversariantes", file);
      }
      const payload = { nome, data_nascimento: data, foto_url };
      if (aniv) {
        const { error } = await supabase.from("aniversariantes").update(payload).eq("id", aniv.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("aniversariantes").insert(payload);
        if (error) throw error;
      }
      toast.success("Salvo");
      qc.invalidateQueries({ queryKey: ["admin-aniversariantes"] });
      qc.invalidateQueries({ queryKey: ["aniversariantes"] });
      setOpen(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[color:var(--card)] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{aniv ? "Editar" : "Novo aniversariante"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={salvar} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Nome
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Data de nascimento
            <input
              required
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Foto
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm font-normal normal-case text-white file:mr-3 file:rounded-md file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[color:var(--navy)]"
            />
          </label>
          <DialogFooter>
            <button
              disabled={saving}
              className="rounded-md bg-gold px-4 py-2 text-sm font-black text-[color:var(--navy)] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
