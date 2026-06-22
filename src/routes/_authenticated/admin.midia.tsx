import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { removerDoStorage, uploadEAssinar } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/midia")({
  component: AdminMidia,
});

type Banner = {
  id: string;
  imagem_url: string;
  titulo: string | null;
  ordem: number;
  ativo: boolean;
};

function AdminMidia() {
  const qc = useQueryClient();
  const [titulo, setTitulo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data = [] } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async (): Promise<Banner[]> => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Banner[];
    },
  });

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadEAssinar("banners", file);
      const maxOrdem = data.reduce((m, b) => Math.max(m, b.ordem), 0);
      const { error } = await supabase.from("banners").insert({
        imagem_url: url,
        titulo: titulo || null,
        ordem: maxOrdem + 1,
        ativo: true,
      });
      if (error) throw error;
      toast.success("Banner adicionado");
      setFile(null); setTitulo("");
      qc.invalidateQueries({ queryKey: ["admin-banners"] });
      qc.invalidateQueries({ queryKey: ["banners-ativos"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const upd = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Banner> }) => {
      const { error } = await supabase.from("banners").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-banners"] });
      qc.invalidateQueries({ queryKey: ["banners-ativos"] });
    },
  });

  const del = useMutation({
    mutationFn: async (b: Banner) => {
      await removerDoStorage("banners", b.imagem_url);
      const { error } = await supabase.from("banners").delete().eq("id", b.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Banner removido");
      qc.invalidateQueries({ queryKey: ["admin-banners"] });
      qc.invalidateQueries({ queryKey: ["banners-ativos"] });
    },
  });

  return (
    <section className="space-y-6">
      <form
        onSubmit={enviar}
        className="rounded-xl border border-white/10 bg-[color:var(--card)] p-5"
      >
        <h2 className="mb-3 font-display text-lg font-black text-white">Novo banner</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
              Título (opcional)
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
              Imagem
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full text-sm font-normal normal-case tracking-normal text-white file:mr-3 file:rounded-md file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[color:var(--navy)]"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={uploading || !file}
            className="inline-flex h-10 items-center gap-1 rounded-md bg-gold px-4 text-sm font-black text-[color:var(--navy)] disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((b) => (
          <article key={b.id} className="overflow-hidden rounded-xl border border-white/10 bg-[color:var(--card)]">
            <div className="aspect-[16/9] bg-[color:var(--navy-deep)]">
              <img src={b.imagem_url} alt={b.titulo ?? ""} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-semibold text-white">{b.titulo ?? "Sem título"}</p>
              <div className="flex items-center justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 text-white/70">
                  Ordem
                  <input
                    type="number"
                    defaultValue={b.ordem}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== b.ordem) upd.mutate({ id: b.id, patch: { ordem: v } });
                    }}
                    className="w-16 rounded border border-white/15 bg-[color:var(--navy-deep)] px-2 py-1 text-white"
                  />
                </label>
                <label className="flex items-center gap-2 text-white/70">
                  <input
                    type="checkbox"
                    checked={b.ativo}
                    onChange={(e) => upd.mutate({ id: b.id, patch: { ativo: e.target.checked } })}
                  />
                  Ativo
                </label>
                <button
                  onClick={() => { if (confirm("Excluir?")) del.mutate(b); }}
                  className="rounded p-1.5 text-white/70 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
        {data.length === 0 && <p className="text-white/60">Nenhum banner cadastrado.</p>}
      </div>
    </section>
  );
}
