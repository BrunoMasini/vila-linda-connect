import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/galeria/")({
  head: () => ({
    meta: [
      { title: "Galeria de Fotos — AD Vila Linda" },
      { name: "description", content: "Álbuns de fotos dos cultos e eventos da Assembleia de Deus Ministério Vila Linda." },
      { property: "og:title", content: "Galeria de Fotos — AD Vila Linda" },
      { property: "og:description", content: "Álbuns de fotos dos cultos e eventos da igreja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaleriaPage,
});

type AlbumCard = {
  id: string;
  capa_url: string | null;
  evento: { titulo: string; data: string; foto_url: string | null } | null;
  total: number;
};

function GaleriaPage() {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["galeria-albuns-publicos"],
    queryFn: async (): Promise<AlbumCard[]> => {
      const { data, error } = await supabase
        .from("galeria_albuns")
        .select("id, capa_url, evento:eventos(titulo, data, foto_url), galeria_fotos(count)")
        .eq("publicado", true);
      if (error) throw error;
      const rows = (data ?? []) as unknown as Array<{
        id: string;
        capa_url: string | null;
        evento: { titulo: string; data: string; foto_url: string | null } | null;
        galeria_fotos: { count: number }[];
      }>;
      return rows
        .map((r) => ({
          id: r.id,
          capa_url: r.capa_url,
          evento: r.evento,
          total: r.galeria_fotos?.[0]?.count ?? 0,
        }))
        .sort((a, b) => (b.evento?.data ?? "").localeCompare(a.evento?.data ?? ""));
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Memórias</p>
        <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">
          Galeria de Fotos
        </h1>
        <p className="mt-3 text-white/70">Reviva os momentos marcantes da nossa igreja.</p>
      </header>

      {isLoading ? (
        <p className="text-center text-white/60">Carregando...</p>
      ) : isError ? (
        <p className="text-center text-white/60">Não foi possível carregar a galeria agora.</p>
      ) : data.length === 0 ? (
        <p className="text-center text-white/60">Nenhum álbum publicado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((a) => {
            const capa = a.capa_url ?? a.evento?.foto_url ?? null;
            const d = a.evento ? new Date(a.evento.data + "T00:00:00") : null;
            return (
              <Link
                key={a.id}
                to="/galeria/$id"
                params={{ id: a.id }}
                className="group overflow-hidden rounded-xl border border-white/10 bg-[color:var(--card)] transition-colors hover:border-gold"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[color:var(--navy-deep)]">
                  {capa ? (
                    <img
                      src={capa}
                      alt={a.evento?.titulo ?? "Álbum da galeria"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-5xl text-white/20">📷</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold text-white">{a.evento?.titulo ?? "Álbum"}</h3>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    {d && (
                      <span className="font-semibold text-gold">
                        {d.toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    <span className="text-white/60">{a.total} {a.total === 1 ? "foto" : "fotos"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}