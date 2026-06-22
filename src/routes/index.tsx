import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — AD Vila Linda" },
      { name: "description", content: "Bem-vindo à Assembleia de Deus — Ministério Vila Linda." },
    ],
  }),
  component: Home,
});

type Banner = { id: string; imagem_url: string; titulo: string | null };

function Home() {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const { data: banners = [] } = useQuery({
    queryKey: ["banners-ativos"],
    queryFn: async (): Promise<Banner[]> => {
      const { data, error } = await supabase
        .from("banners")
        .select("id, imagem_url, titulo")
        .eq("ativo", true)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Banner[];
    },
  });

  return (
    <div>
      <section className="border-b border-white/10">
        {banners.length > 0 ? (
          <Carousel opts={{ loop: true }} plugins={[autoplay.current]} className="w-full">
            <CarouselContent>
              {banners.map((b) => (
                <CarouselItem key={b.id}>
                  <div className="relative aspect-[16/7] w-full overflow-hidden bg-[color:var(--navy-deep)]">
                    <img
                      src={b.imagem_url}
                      alt={b.titulo ?? "Banner"}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    {b.titulo && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:var(--navy)] to-transparent p-6">
                        <p className="font-display text-xl font-bold text-white sm:text-3xl">
                          {b.titulo}
                        </p>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="grid aspect-[16/7] w-full place-items-center bg-[color:var(--navy-deep)] px-6 text-center">
            <div>
              <p className="font-display text-3xl font-black text-gold sm:text-5xl">
                Bem-vindo à Casa do Pai
              </p>
              <p className="mt-4 text-sm text-white/70 sm:text-base">
                Em breve, banners de avisos e eventos aparecerão aqui.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Boas-vindas</p>
        <h1 className="mt-4 font-display text-3xl font-black text-white sm:text-5xl">
          A PAZ DE CRISTO JESUS!
        </h1>
        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-white/80 sm:text-lg">
          <p>
            É com profunda alegria que recebemos você na <strong className="text-white">Igreja Assembleia
            de Deus — Ministério Vila Linda</strong>. Somos uma comunidade de fé comprometida com a
            pregação do evangelho de Jesus Cristo, com a edificação dos santos e com o amor ao próximo.
          </p>
          <p>
            Aqui você encontra cultos de ensino, momentos de oração, eventos da família e
            departamentos que vivem a missão da igreja em todas as fases da vida. Venha conhecer,
            participar e fazer parte desta família.
          </p>
          <p className="font-display text-lg font-bold text-gold">
            “Eu e a minha casa serviremos ao Senhor.” — Josué 24:15
          </p>
        </div>
      </section>
    </div>
  );
}
