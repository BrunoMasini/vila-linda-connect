import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/ministerial")({
  head: () => ({
    meta: [
      { title: "Gestão Ministerial — AD Vila Linda" },
      { name: "description", content: "Pastores, dirigentes e líderes do ministério." },
    ],
  }),
  component: MinisterialPage,
});

type Lider = {
  id: string;
  nome: string;
  cargo: string;
  foto_url: string | null;
  biografia: string | null;
};

function MinisterialPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["lideres"],
    queryFn: async (): Promise<Lider[]> => {
      const { data, error } = await supabase
        .from("lideres")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Lider[];
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Liderança</p>
        <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">
          Gestão Ministerial
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
          Conheça os pastores, dirigentes e líderes que servem a esta casa com amor e dedicação.
        </p>
      </header>

      {isLoading ? (
        <p className="text-center text-white/60">Carregando...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-white/60">Em breve, a equipe ministerial será publicada.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((l) => (
            <LiderCard key={l.id} lider={l} />
          ))}
        </div>
      )}
    </div>
  );
}

function LiderCard({ lider }: { lider: Lider }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--card)] transition hover:border-gold/60">
      <div className="aspect-[4/5] w-full overflow-hidden border-b-4 border-[color:var(--navy-deep)] bg-[color:var(--navy-deep)]">
        {lider.foto_url ? (
          <img src={lider.foto_url} alt={lider.nome} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-6xl text-white/15">✝</div>
        )}
      </div>
      <div className="p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">{lider.cargo}</p>
        <h3 className="mt-2 font-display text-xl font-black text-white">{lider.nome}</h3>
        {lider.biografia && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-md border border-gold px-4 py-2 text-sm font-bold text-gold transition hover:bg-gold hover:text-[color:var(--navy)]"
              >
                Ver Biografia
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border-white/10 bg-[color:var(--card)] text-white">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-gold">{lider.nome}</DialogTitle>
                <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                  {lider.cargo}
                </p>
              </DialogHeader>
              <div className="mt-4 max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                {lider.biografia}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </article>
  );
}
