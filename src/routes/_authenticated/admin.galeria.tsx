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
} from "@/components/ui/dialog";
import { Images, Plus, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { removerDoStorage, uploadEAssinar } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/galeria")({
  component: AdminGaleria,
});

type EventoRow = {
  id: string;
  titulo: string;
  data: string;
  foto_url: string | null;
  album:
    | { id: string; publicado: boolean; capa_url: string | null; total: number }
    | null;
};

function AdminGaleria() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-galeria-eventos"],
    queryFn: async (): Promise<EventoRow[]> => {
      const { data, error } = await supabase
        .from("eventos")
        .select("id, titulo, data, foto_url, galeria_albuns(id, publicado, capa_url, galeria_fotos(count))")
        .order("data", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as unknown as Array<{
        id: string;
        titulo: string;
        data: string;
        foto_url: string | null;
        galeria_albuns: Array<{
          id: string;
          publicado: boolean;
          capa_url: string | null;
          galeria_fotos: { count: number }[];
        }>;
      }>;
      return rows.map((r) => {
        const a = r.galeria_albuns?.[0];
        return {
          id: r.id,
          titulo: r.titulo,
          data: r.data,
          foto_url: r.foto_url,
          album: a
            ? { id: a.id, publicado: a.publicado, capa_url: a.capa_url, total: a.galeria_fotos?.[0]?.count ?? 0 }
            : null,
        };
      });
    },
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-black text-white">Galeria de Fotos</h2>
        <p className="text-xs text-white/60">Um álbum por evento</p>
      </div>

      {isLoading ? (
        <p className="text-white/60">Carregando...</p>
      ) : data.length === 0 ? (
        <p className="text-white/60">Cadastre um evento primeiro para criar seu álbum.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--navy-deep)] text-left text-xs uppercase tracking-wider text-gold">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Álbum</th>
                <th className="px-4 py-3">Fotos</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.id} className="border-t border-white/5 text-white/90">
                  <td className="px-4 py-3 font-semibold text-gold">
                    {new Date(e.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">{e.titulo}</td>
                  <td className="px-4 py-3">
                    {e.album ? (
                      e.album.publicado ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                          Publicado
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-white/70">
                          Rascunho
                        </span>
                      )
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/70">{e.album?.total ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <AlbumDialog evento={e} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AlbumDialog({ evento }: { evento: EventoRow }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md bg-gold px-3 py-2 text-xs font-bold text-[color:var(--navy)]">
          {evento.album ? <Images className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {evento.album ? "Gerenciar" : "Criar álbum"}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[color:var(--card)] text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{evento.titulo}</DialogTitle>
        </DialogHeader>
        <AlbumEditor evento={evento} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AlbumEditor({ evento, onClose }: { evento: EventoRow; onClose: () => void }) {
  const qc = useQueryClient();

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-galeria-eventos"] });
    qc.invalidateQueries({ queryKey: ["galeria-albuns-publicos"] });
    if (evento.album) qc.invalidateQueries({ queryKey: ["admin-album", evento.album.id] });
  };

  const criar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("galeria_albuns")
        .insert({ evento_id: evento.id, publicado: false, capa_url: evento.foto_url });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Álbum criado");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!evento.album) {
    return (
      <div className="space-y-4 py-4">
        <p className="text-sm text-white/70">
          Ainda não existe álbum para este evento. Crie o álbum, faça upload das fotos e publique quando estiver pronto.
        </p>
        <button
          type="button"
          onClick={() => criar.mutate()}
          disabled={criar.isPending}
          className="rounded-md bg-gold px-4 py-2 text-sm font-black text-[color:var(--navy)] disabled:opacity-60"
        >
          {criar.isPending ? "Criando..." : "Criar álbum"}
        </button>
      </div>
    );
  }

  return <AlbumFotos albumId={evento.album.id} onDeleted={() => { invalidateAll(); onClose(); }} />;
}

function AlbumFotos({ albumId, onDeleted }: { albumId: string; onDeleted: () => void }) {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: album } = useQuery({
    queryKey: ["admin-album", albumId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galeria_albuns")
        .select("id, publicado, capa_url, galeria_fotos(id, url, ordem)")
        .eq("id", albumId)
        .single();
      if (error) throw error;
      const row = data as unknown as {
        id: string;
        publicado: boolean;
        capa_url: string | null;
        galeria_fotos: { id: string; url: string; ordem: number }[];
      };
      return {
        ...row,
        galeria_fotos: [...row.galeria_fotos].sort((a, b) => a.ordem - b.ordem),
      };
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-album", albumId] });
    qc.invalidateQueries({ queryKey: ["admin-galeria-eventos"] });
    qc.invalidateQueries({ queryKey: ["galeria-albuns-publicos"] });
  };

  const togglePublicado = useMutation({
    mutationFn: async (publicado: boolean) => {
      const { error } = await supabase.from("galeria_albuns").update({ publicado }).eq("id", albumId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Atualizado");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const setCapa = useMutation({
    mutationFn: async (url: string) => {
      const { error } = await supabase.from("galeria_albuns").update({ capa_url: url }).eq("id", albumId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Capa definida");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluirFoto = useMutation({
    mutationFn: async (foto: { id: string; url: string }) => {
      await removerDoStorage("galeria", foto.url);
      const { error } = await supabase.from("galeria_fotos").delete().eq("id", foto.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Foto removida");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluirAlbum = useMutation({
    mutationFn: async () => {
      if (album) {
        await Promise.all(album.galeria_fotos.map((f) => removerDoStorage("galeria", f.url)));
      }
      const { error } = await supabase.from("galeria_albuns").delete().eq("id", albumId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Álbum excluído");
      onDeleted();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const startOrdem = (album?.galeria_fotos.length ?? 0);
      const uploads = await Promise.all(
        Array.from(files).map(async (file, i) => {
          const url = await uploadEAssinar("galeria", file);
          return { album_id: albumId, url, ordem: startOrdem + i };
        }),
      );
      const { error } = await supabase.from("galeria_fotos").insert(uploads);
      if (error) throw error;
      toast.success(`${uploads.length} foto(s) enviada(s)`);
      invalidate();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  if (!album) return <p className="py-4 text-white/60">Carregando...</p>;

  return (
    <div className="space-y-4 py-2">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-[color:var(--navy-deep)] p-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gold px-3 py-2 text-xs font-bold text-[color:var(--navy)]">
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Enviando..." : "Enviar fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
            className="hidden"
          />
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={album.publicado}
            onChange={(e) => togglePublicado.mutate(e.target.checked)}
            className="h-4 w-4 accent-[color:var(--gold)]"
          />
          Publicado na Galeria pública
        </label>

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => {
              if (confirm("Excluir álbum e todas as fotos?")) excluirAlbum.mutate();
            }}
            className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Excluir álbum
          </button>
        </div>
      </div>

      {album.galeria_fotos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/15 p-8 text-center text-white/50">
          Nenhuma foto ainda. Clique em "Enviar fotos" para começar.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {album.galeria_fotos.map((f) => {
            const isCapa = album.capa_url === f.url;
            return (
              <div key={f.id} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
                <img src={f.url} alt="" className="h-full w-full object-cover" />
                {isCapa && (
                  <span className="absolute left-1 top-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-black text-[color:var(--navy)]">
                    CAPA
                  </span>
                )}
                <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    title="Definir como capa"
                    onClick={() => setCapa.mutate(f.url)}
                    className="rounded-md bg-white/10 p-1.5 text-white hover:bg-gold hover:text-[color:var(--navy)]"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Excluir"
                    onClick={() => excluirFoto.mutate(f)}
                    className="rounded-md bg-white/10 p-1.5 text-white hover:bg-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
