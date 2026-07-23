import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";

export const Route = createFileRoute("/galeria/$id")({
  head: () => ({
    meta: [
      { title: "Álbum — Galeria AD Vila Linda" },
      { name: "description", content: "Fotos do evento na Assembleia de Deus Ministério Vila Linda." },
      { property: "og:title", content: "Álbum — Galeria AD Vila Linda" },
      { property: "og:description", content: "Fotos do evento na igreja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlbumPage,
});

type AlbumData = {
  id: string;
  capa_url: string | null;
  evento: { titulo: string; data: string } | null;
  fotos: { id: string; url: string; ordem: number }[];
};

function AlbumPage() {
  const { id } = Route.useParams();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["galeria-album", id],
    queryFn: async (): Promise<AlbumData | null> => {
      const { data, error } = await supabase
        .from("galeria_albuns")
        .select("id, capa_url, evento:eventos(titulo, data), galeria_fotos(id, url, ordem)")
        .eq("id", id)
        .eq("publicado", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const row = data as unknown as {
        id: string;
        capa_url: string | null;
        evento: { titulo: string; data: string } | null;
        galeria_fotos: { id: string; url: string; ordem: number }[];
      };
      return {
        id: row.id,
        capa_url: row.capa_url,
        evento: row.evento,
        fotos: [...row.galeria_fotos].sort((a, b) => a.ordem - b.ordem),
      };
    },
  });

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (!data) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % data.fotos.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i - 1 + data.fotos.length) % data.fotos.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, data]);

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white/60">Carregando...</div>;
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-white/70">Álbum não encontrado ou não publicado.</p>
        <Link to="/galeria" className="mt-4 inline-block text-gold hover:underline">
          Voltar para Galeria
        </Link>
      </div>
    );
  }

  const d = data.evento ? new Date(data.evento.data + "T00:00:00") : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Link to="/galeria" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Todos os álbuns
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="font-display text-3xl font-black text-white sm:text-4xl">
          {data.evento?.titulo ?? "Álbum"}
        </h1>
        {d && <p className="mt-2 text-sm font-semibold text-gold">{d.toLocaleDateString("pt-BR")}</p>}
      </header>

      {data.fotos.length === 0 ? (
        <p className="text-center text-white/60">Nenhuma foto neste álbum ainda.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
          {data.fotos.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setLightbox(i)}
              className="group aspect-square overflow-hidden rounded-lg border border-white/10 bg-[color:var(--navy-deep)] focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <img
                src={f.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox !== null && data.fotos[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i - 1 + data.fotos.length) % data.fotos.length));
            }}
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={data.fotos[lightbox].url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            aria-label="Próxima"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i + 1) % data.fotos.length));
            }}
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            {lightbox + 1} / {data.fotos.length}
          </div>
        </div>
      )}
    </div>
  );
}
