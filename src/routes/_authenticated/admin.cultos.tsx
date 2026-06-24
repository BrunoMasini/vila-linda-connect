import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/cultos")({
  component: AdminCultos,
});

type Culto = {
  id: string;
  titulo: string;
  descricao: string | null;
  igreja: "sede" | "filial";
  hora_inicio: string | null;
  hora_fim: string | null;
  ordem: number;
};

function AdminCultos() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-cultos"],
    queryFn: async (): Promise<Culto[]> => {
      const { data, error } = await supabase
        .from("cultos")
        .select("*")
        .order("igreja", { ascending: true })
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Culto[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cultos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removido");
      qc.invalidateQueries({ queryKey: ["admin-cultos"] });
      qc.invalidateQueries({ queryKey: ["cultos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const grupos = [
    { igreja: "sede" as const, label: "Igreja Sede" },
    { igreja: "filial" as const, label: "Igreja Filial" },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-black text-white">Cultos</h2>
        <CultoDialog
          trigger={
            <button className="inline-flex items-center gap-1 rounded-md bg-gold px-3 py-2 text-sm font-bold text-[color:var(--navy)]">
              <Plus className="h-4 w-4" /> Novo
            </button>
          }
        />
      </div>

      <div className="space-y-6">
        {grupos.map((g) => {
          const itens = data.filter((c) => c.igreja === g.igreja);
          return (
            <div key={g.igreja}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">
                {g.label}
              </h3>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-[color:var(--navy-deep)] text-left text-xs uppercase tracking-wider text-gold">
                    <tr>
                      <th className="px-4 py-3">Ordem</th>
                      <th className="px-4 py-3">Título</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">Horário</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((c) => (
                      <tr key={c.id} className="border-t border-white/5 text-white/90">
                        <td className="px-4 py-3 text-white/60">{c.ordem}</td>
                        <td className="px-4 py-3 font-semibold">{c.titulo}</td>
                        <td className="px-4 py-3 text-white/70">{c.descricao ?? "—"}</td>
                        <td className="px-4 py-3 text-gold">
                          {c.hora_inicio?.slice(0, 5) ?? "—"}
                          {c.hora_fim && ` às ${c.hora_fim.slice(0, 5)}`}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <CultoDialog
                              culto={c}
                              trigger={
                                <button className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                                  <Pencil className="h-4 w-4" />
                                </button>
                              }
                            />
                            <button
                              onClick={() => { if (confirm("Excluir?")) del.mutate(c.id); }}
                              className="rounded p-1.5 text-white/70 hover:bg-destructive/20 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {itens.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-white/50">
                          Nenhum culto cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CultoDialog({ culto, trigger }: { culto?: Culto; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState(culto?.titulo ?? "");
  const [descricao, setDescricao] = useState(culto?.descricao ?? "");
  const [igreja, setIgreja] = useState<"sede" | "filial">(culto?.igreja ?? "sede");
  const [horaInicio, setHoraInicio] = useState(culto?.hora_inicio?.slice(0, 5) ?? "");
  const [horaFim, setHoraFim] = useState(culto?.hora_fim?.slice(0, 5) ?? "");
  const [ordem, setOrdem] = useState(String(culto?.ordem ?? 0));
  const [saving, setSaving] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        titulo,
        descricao: descricao || null,
        igreja,
        hora_inicio: horaInicio || null,
        hora_fim: horaFim || null,
        ordem: Number(ordem) || 0,
      };
      if (culto) {
        const { error } = await supabase.from("cultos").update(payload).eq("id", culto.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cultos").insert(payload);
        if (error) throw error;
      }
      toast.success("Salvo");
      qc.invalidateQueries({ queryKey: ["admin-cultos"] });
      qc.invalidateQueries({ queryKey: ["cultos"] });
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
      <DialogContent className="border-white/10 bg-[color:var(--card)] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{culto ? "Editar culto" : "Novo culto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={salvar} className="space-y-3">
          <Field label="Título">
            <input
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white"
            />
          </Field>
          <Field label="Descrição (ex.: todo primeiro sábado do mês)">
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Igreja">
              <select
                value={igreja}
                onChange={(e) => setIgreja(e.target.value as "sede" | "filial")}
                className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white"
              >
                <option value="sede">Sede</option>
                <option value="filial">Filial</option>
              </select>
            </Field>
            <Field label="Ordem">
              <input
                type="number"
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
                className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Hora início">
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white"
              />
            </Field>
            <Field label="Hora fim">
              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white"
              />
            </Field>
          </div>
          <DialogFooter>
            <button
              type="submit"
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
      {label}
      <div className="mt-1 font-normal normal-case tracking-normal">{children}</div>
    </label>
  );
}
