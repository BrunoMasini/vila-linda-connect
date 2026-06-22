import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { removerDoStorage, uploadEAssinar } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/biografias")({
  component: AdminBiografias,
});

type Lider = {
  id: string;
  nome: string;
  cargo: string;
  foto_url: string | null;
  biografia: string | null;
  ordem: number;
};

function AdminBiografias() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-lideres"],
    queryFn: async (): Promise<Lider[]> => {
      const { data, error } = await supabase
        .from("lideres")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Lider[];
    },
  });

  const del = useMutation({
    mutationFn: async (l: Lider) => {
      if (l.foto_url) await removerDoStorage("lideres", l.foto_url);
      const { error } = await supabase.from("lideres").delete().eq("id", l.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removido");
      qc.invalidateQueries({ queryKey: ["admin-lideres"] });
      qc.invalidateQueries({ queryKey: ["lideres"] });
    },
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-black text-white">Líderes</h2>
        <LiderDialog
          trigger={
            <button className="inline-flex items-center gap-1 rounded-md bg-gold px-3 py-2 text-sm font-bold text-[color:var(--navy)]">
              <Plus className="h-4 w-4" /> Novo
            </button>
          }
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((l) => (
          <article key={l.id} className="rounded-xl border border-white/10 bg-[color:var(--card)] p-4">
            <div className="flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[color:var(--navy-deep)]">
                {l.foto_url && <img src={l.foto_url} alt={l.nome} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">{l.cargo}</p>
                <h3 className="truncate font-display text-base font-black text-white">{l.nome}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/60">{l.biografia}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <LiderDialog
                lider={l}
                trigger={
                  <button className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                    <Pencil className="h-4 w-4" />
                  </button>
                }
              />
              <button
                onClick={() => { if (confirm("Excluir?")) del.mutate(l); }}
                className="rounded p-1.5 text-white/70 hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
        {data.length === 0 && <p className="text-white/60">Nenhum líder cadastrado.</p>}
      </div>
    </section>
  );
}

function LiderDialog({ lider, trigger }: { lider?: Lider; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(lider?.nome ?? "");
  const [cargo, setCargo] = useState(lider?.cargo ?? "");
  const [biografia, setBiografia] = useState(lider?.biografia ?? "");
  const [ordem, setOrdem] = useState(lider?.ordem ?? 0);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let foto_url = lider?.foto_url ?? null;
      if (file) {
        if (lider?.foto_url) await removerDoStorage("lideres", lider.foto_url);
        foto_url = await uploadEAssinar("lideres", file);
      }
      const payload = { nome, cargo, biografia: biografia || null, ordem, foto_url };
      if (lider) {
        const { error } = await supabase.from("lideres").update(payload).eq("id", lider.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lideres").insert(payload);
        if (error) throw error;
      }
      toast.success("Salvo");
      qc.invalidateQueries({ queryKey: ["admin-lideres"] });
      qc.invalidateQueries({ queryKey: ["lideres"] });
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
      <DialogContent className="border-white/10 bg-[color:var(--card)] text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{lider ? "Editar líder" : "Novo líder"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={salvar} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Nome" value={nome} onChange={setNome} required />
            <FieldInput label="Cargo" value={cargo} onChange={setCargo} required />
          </div>
          <FieldInput label="Ordem" type="number" value={String(ordem)} onChange={(v) => setOrdem(Number(v))} />
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Foto
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm font-normal normal-case text-white file:mr-3 file:rounded-md file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[color:var(--navy)]"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
            Biografia
            <textarea
              rows={6}
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
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

function FieldInput({
  label, value, onChange, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white focus:border-gold focus:outline-none"
      />
    </label>
  );
}
