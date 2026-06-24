import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/cultos")({
  head: () => ({
    meta: [
      { title: "Cultos — AD Vila Linda" },
      { name: "description", content: "Horários e dias dos cultos das igrejas Sede e Filial." },
      { property: "og:title", content: "Cultos — AD Vila Linda" },
      { property: "og:description", content: "Horários e dias dos cultos das igrejas Sede e Filial." },
    ],
  }),
  component: CultosPage,
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

function CultosPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["cultos"],
    queryFn: async (): Promise<Culto[]> => {
      const { data, error } = await supabase
        .from("cultos")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Culto[];
    },
  });

  const sede = data.filter((c) => c.igreja === "sede");
  const filial = data.filter((c) => c.igreja === "filial");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Programação</p>
        <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">
          Cultos
        </h1>
      </header>

      <Tabs defaultValue="sede" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="sede">Igreja Sede</TabsTrigger>
          <TabsTrigger value="filial">Igreja Filial</TabsTrigger>
        </TabsList>

        <TabsContent value="sede" className="mt-8">
          <ListaCultos itens={sede} loading={isLoading} />
        </TabsContent>
        <TabsContent value="filial" className="mt-8">
          <ListaCultos itens={filial} loading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ListaCultos({ itens, loading }: { itens: Culto[]; loading: boolean }) {
  if (loading) return <p className="text-center text-white/60">Carregando...</p>;
  if (itens.length === 0)
    return <p className="text-center text-white/60">Nenhum culto cadastrado.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {itens.map((c) => (
        <li
          key={c.id}
          className="rounded-xl border border-white/10 bg-[color:var(--card)] p-5"
        >
          <h3 className="font-display text-lg font-bold text-white sm:text-xl">{c.titulo}</h3>
          {c.descricao && <p className="mt-1 text-sm text-white/80">{c.descricao}</p>}
          {(c.hora_inicio || c.hora_fim) && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-gold/40 px-3 py-1.5 text-sm font-semibold text-gold">
              <Clock className="h-4 w-4" />
              {c.hora_inicio?.slice(0, 5)}
              {c.hora_fim && ` às ${c.hora_fim.slice(0, 5)}`}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
