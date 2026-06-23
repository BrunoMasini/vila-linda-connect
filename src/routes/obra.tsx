import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart, HandHeart, Send, Users, BookOpen, Church, type LucideIcon } from "lucide-react";
import { useSiteTextos } from "@/lib/site-textos";

export const Route = createFileRoute("/obra")({
  head: () => ({
    meta: [
      { title: "Faça a Obra — AD Vila Linda" },
      { name: "description", content: "Missões, dízimos, ofertas e voluntariado." },
    ],
  }),
  component: ObraPage,
});

type Card = {
  id: string;
  icone: string;
  titulo: string;
  texto: string;
  detalhe: string;
};

const ICONES: Record<string, LucideIcon> = {
  heart: Heart,
  handheart: HandHeart,
  send: Send,
  users: Users,
  book: BookOpen,
  church: Church,
};

function ObraPage() {
  const { data: textos = {} } = useSiteTextos();
  const { data: cards = [] } = useQuery({
    queryKey: ["obra-cards"],
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase
        .from("obra_cards")
        .select("id, icone, titulo, texto, detalhe")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Card[];
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Servir</p>
        <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">
          Faça a Obra
        </h1>
        {textos.obra_versiculo_topo && (
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
            {textos.obra_versiculo_topo}
          </p>
        )}
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => {
          const Icon = ICONES[c.icone] ?? Heart;
          return (
            <article
              key={c.id}
              className="rounded-2xl border border-white/10 bg-[color:var(--card)] p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold">
                <Icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="mt-4 font-display text-xl font-black text-white">{c.titulo}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/80">{c.texto}</p>
              {c.detalhe && (
                <p className="mt-4 whitespace-pre-line border-t border-white/10 pt-4 text-xs font-semibold text-gold">
                  {c.detalhe}
                </p>
              )}
            </article>
          );
        })}
        {cards.length === 0 && (
          <p className="md:col-span-3 text-center text-white/60">Em breve.</p>
        )}
      </div>
    </div>
  );
}
