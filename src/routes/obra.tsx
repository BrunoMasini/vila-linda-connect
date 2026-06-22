import { createFileRoute } from "@tanstack/react-router";
import { Heart, HandHeart, Send } from "lucide-react";

export const Route = createFileRoute("/obra")({
  head: () => ({
    meta: [
      { title: "Faça a Obra — AD Vila Linda" },
      { name: "description", content: "Missões, dízimos, ofertas e voluntariado." },
    ],
  }),
  component: ObraPage,
});

function ObraPage() {
  const cards = [
    {
      icon: Heart,
      titulo: "Dízimos & Ofertas",
      texto:
        "“Trazei todos os dízimos à casa do tesouro… e provai-me nisto, diz o Senhor dos Exércitos.” (Malaquias 3:10)",
      detalhe: "PIX: contato@advilalinda.com.br\n(em nome da igreja)",
    },
    {
      icon: Send,
      titulo: "Missões",
      texto:
        "Apoie o envio de missionários e a expansão do Reino através do Departamento de Missões.",
      detalhe: "Reuniões: 1º domingo do mês, após o culto",
    },
    {
      icon: HandHeart,
      titulo: "Voluntariado",
      texto:
        "Sirva ao Senhor com os dons que recebeu. Temos áreas em louvor, recepção, ensino infantil, ação social e mídia.",
      detalhe: "Procure um diácono ou pastor para se inscrever",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Servir</p>
        <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">
          Faça a Obra
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
          “Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade;
          porque Deus ama ao que dá com alegria.” — 2 Coríntios 9:7
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.titulo}
            className="rounded-2xl border border-white/10 bg-[color:var(--card)] p-6"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full border border-gold">
              <c.icon className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mt-4 font-display text-xl font-black text-white">{c.titulo}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{c.texto}</p>
            <p className="mt-4 whitespace-pre-line border-t border-white/10 pt-4 text-xs font-semibold text-gold">
              {c.detalhe}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
