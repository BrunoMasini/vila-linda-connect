import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos — AD Vila Linda" },
      { name: "description", content: "Agenda de cultos, atividades e aniversariantes do mês." },
    ],
  }),
  component: EventosPage,
});

type Evento = {
  id: string;
  titulo: string;
  data: string;
  hora: string | null;
  preletor: string | null;
  descricao: string | null;
};

type Aniversariante = {
  id: string;
  nome: string;
  data_nascimento: string;
  foto_url: string | null;
};

const MESES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

function EventosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Calendário</p>
        <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">
          Eventos da Igreja
        </h1>
      </header>

      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="agenda">Agenda Geral</TabsTrigger>
          <TabsTrigger value="aniversarios">Aniversariantes</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="mt-8">
          <AgendaList />
        </TabsContent>

        <TabsContent value="aniversarios" className="mt-8">
          <AniversariantesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AgendaList() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["eventos-publico"],
    queryFn: async (): Promise<Evento[]> => {
      const hoje = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .gte("data", hoje)
        .order("data", { ascending: true });
      if (error) throw error;
      return data as Evento[];
    },
  });

  if (isLoading) return <p className="text-center text-white/60">Carregando...</p>;
  if (data.length === 0)
    return <p className="text-center text-white/60">Nenhum evento agendado no momento.</p>;

  return (
    <ul className="space-y-4">
      {data.map((e) => {
        const d = new Date(e.data + "T00:00:00");
        return (
          <li
            key={e.id}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-xl border border-white/10 bg-[color:var(--card)] p-5 sm:gap-6"
          >
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border-2 border-gold bg-[color:var(--navy-deep)] text-center">
              <div>
                <p className="font-display text-3xl font-black leading-none text-gold">
                  {String(d.getDate()).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
                  {MESES[d.getMonth()]}
                </p>
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-white sm:text-xl">{e.titulo}</h3>
              {e.hora && (
                <p className="mt-1 text-sm font-semibold text-gold">
                  {e.hora.slice(0, 5)}
                  {e.preletor && <span className="text-white/70"> · {e.preletor}</span>}
                </p>
              )}
              {e.descricao && <p className="mt-2 text-sm text-white/80">{e.descricao}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function AniversariantesList() {
  const mesAtual = new Date().getMonth() + 1;

  const { data = [], isLoading } = useQuery({
    queryKey: ["aniversariantes", mesAtual],
    queryFn: async (): Promise<Aniversariante[]> => {
      const { data, error } = await supabase.from("aniversariantes").select("*");
      if (error) throw error;
      return (data as Aniversariante[])
        .filter((a) => new Date(a.data_nascimento + "T00:00:00").getMonth() + 1 === mesAtual)
        .sort(
          (a, b) =>
            new Date(a.data_nascimento + "T00:00:00").getDate() -
            new Date(b.data_nascimento + "T00:00:00").getDate(),
        );
    },
  });

  if (isLoading) return <p className="text-center text-white/60">Carregando...</p>;
  if (data.length === 0)
    return (
      <p className="text-center text-white/60">
        Sem aniversariantes cadastrados para {MESES[mesAtual - 1]}.
      </p>
    );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((a) => {
        const d = new Date(a.data_nascimento + "T00:00:00");
        return (
          <article
            key={a.id}
            className="overflow-hidden rounded-xl border border-white/10 bg-[color:var(--card)]"
          >
            <div className="aspect-square w-full overflow-hidden bg-[color:var(--navy-deep)]">
              {a.foto_url ? (
                <img src={a.foto_url} alt={a.nome} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-4xl text-white/20">
                  🎂
                </div>
              )}
            </div>
            <div className="p-3 text-center">
              <p className="truncate font-display text-sm font-bold text-white">{a.nome}</p>
              <p className="mt-1 text-xs font-semibold text-gold">
                {String(d.getDate()).padStart(2, "0")} de {MESES[d.getMonth()]}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
