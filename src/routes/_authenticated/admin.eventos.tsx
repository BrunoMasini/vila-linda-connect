import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/eventos")({
  component: AdminEventos,
});

type Evento = {
  id: string;
  titulo: string;
  data: string;
  hora: string | null;
  preletor: string | null;
  descricao: string | null;
};

function AdminEventos() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-eventos"],
    queryFn: async (): Promise<Evento[]> => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("data", { ascending: true });
      if (error) throw error;
      return data as Evento[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("eventos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento removido");
      qc.invalidateQueries({ queryKey: ["admin-eventos"] });
      qc.invalidateQueries({ queryKey: ["eventos-publico"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-black text-white">Eventos da Agenda</h2>
        <EventoDialog
          trigger={
            <button className="inline-flex items-center gap-1 rounded-md bg-gold px-3 py-2 text-sm font-bold text-[color:var(--navy)]">
              <Plus className="h-4 w-4" /> Novo
            </button>
          }
        />
      </div>

      {isLoading ? (
        <p className="text-white/60">Carregando...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--navy-deep)] text-left text-xs uppercase tracking-wider text-gold">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Preletor</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.id} className="border-t border-white/5 text-white/90">
                  <td className="px-4 py-3 font-semibold text-gold">
                    {new Date(e.data + "T00:00:00").toLocaleDateString("pt-BR")}
                    {e.hora && <span className="text-white/60"> {e.hora.slice(0, 5)}</span>}
                  </td>
                  <td className="px-4 py-3">{e.titulo}</td>
                  <td className="px-4 py-3 text-white/70">{e.preletor ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <EventoDialog
                        evento={e}
                        trigger={
                          <button className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                            <Pencil className="h-4 w-4" />
                          </button>
                        }
                      />
                      <button
                        onClick={() => {
                          if (confirm("Excluir este evento?")) del.mutate(e.id);
                        }}
                        className="rounded p-1.5 text-white/70 hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/50">
                    Nenhum evento cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EventoDialog({
  evento,
  trigger,
}: {
  evento?: Evento;
  trigger: React.ReactNode;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState(evento?.titulo ?? "");
  const [data, setData] = useState(evento?.data ?? "");
  const [hora, setHora] = useState(evento?.hora ?? "");
  const [preletor, setPreletor] = useState(evento?.preletor ?? "");
  const [descricao, setDescricao] = useState(evento?.descricao ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        titulo,
        data,
        hora: hora || null,
        preletor: preletor || null,
        descricao: descricao || null,
      };
      if (evento) {
        const { error } = await supabase.from("eventos").update(payload).eq("id", evento.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("eventos").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(evento ? "Evento atualizado" : "Evento criado");
      qc.invalidateQueries({ queryKey: ["admin-eventos"] });
      qc.invalidateQueries({ queryKey: ["eventos-publico"] });
      setOpen(false);
      if (!evento) {
        setTitulo(""); setData(""); setHora(""); setPreletor(""); setDescricao("");
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[color:var(--card)] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{evento ? "Editar evento" : "Novo evento"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
          className="space-y-3"
        >
          <Field label="Título"><Input value={titulo} onChange={setTitulo} required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data"><Input type="date" value={data} onChange={setData} required /></Field>
            <Field label="Hora"><Input type="time" value={hora} onChange={setHora} /></Field>
          </div>
          <Field label="Preletor / Cantor"><Input value={preletor} onChange={setPreletor} /></Field>
          <Field label="Descrição">
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white"
            />
          </Field>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
      {label}
      <div className="mt-1 font-normal normal-case tracking-normal">{children}</div>
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
    />
  );
}
