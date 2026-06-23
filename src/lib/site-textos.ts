import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteTextos() {
  return useQuery({
    queryKey: ["site-textos"],
    queryFn: async (): Promise<Record<string, string>> => {
      const { data, error } = await supabase.from("pagina_textos").select("chave, valor");
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const t of (data ?? []) as { chave: string; valor: string }[]) {
        map[t.chave] = t.valor;
      }
      return map;
    },
  });
}
