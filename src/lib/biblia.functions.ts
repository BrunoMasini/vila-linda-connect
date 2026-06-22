import { createServerFn } from "@tanstack/react-start";
import { livroParaSlugApi } from "@/data/biblia-api-map";

export type CapituloBiblia = {
  reference: string;
  versiculos: { numero: number; texto: string }[];
};

export const getCapitulo = createServerFn({ method: "GET" })
  .inputValidator((d: { abrev: string; capitulo: number }) => d)
  .handler(async ({ data }): Promise<CapituloBiblia> => {
    const slug = livroParaSlugApi[data.abrev];
    if (!slug) throw new Error("Livro não encontrado");
    const url = `https://bible-api.com/${encodeURIComponent(slug)}+${data.capitulo}?translation=almeida`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha ao carregar capítulo");
    const json = (await res.json()) as {
      reference: string;
      verses: { verse: number; text: string }[];
    };
    return {
      reference: json.reference,
      versiculos: json.verses.map((v) => ({ numero: v.verse, texto: v.text.trim() })),
    };
  });
