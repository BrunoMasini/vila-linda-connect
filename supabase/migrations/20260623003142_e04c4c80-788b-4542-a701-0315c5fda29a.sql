
-- contatos_igreja (singleton)
CREATE TABLE public.contatos_igreja (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  endereco text NOT NULL DEFAULT '',
  telefone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  youtube text NOT NULL DEFAULT '',
  mapa_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contatos_singleton_chk CHECK (singleton = true)
);
GRANT SELECT ON public.contatos_igreja TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.contatos_igreja TO authenticated;
GRANT ALL ON public.contatos_igreja TO service_role;
ALTER TABLE public.contatos_igreja ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contatos públicos" ON public.contatos_igreja FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam contatos" ON public.contatos_igreja FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- pagina_textos (key/value)
CREATE TABLE public.pagina_textos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  valor text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pagina_textos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pagina_textos TO authenticated;
GRANT ALL ON public.pagina_textos TO service_role;
ALTER TABLE public.pagina_textos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Textos públicos" ON public.pagina_textos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam textos" ON public.pagina_textos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- obra_cards
CREATE TABLE public.obra_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icone text NOT NULL DEFAULT 'heart',
  titulo text NOT NULL,
  texto text NOT NULL DEFAULT '',
  detalhe text NOT NULL DEFAULT '',
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.obra_cards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.obra_cards TO authenticated;
GRANT ALL ON public.obra_cards TO service_role;
ALTER TABLE public.obra_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Obra cards públicos" ON public.obra_cards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam obra cards" ON public.obra_cards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_contatos_updated BEFORE UPDATE ON public.contatos_igreja FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_textos_updated BEFORE UPDATE ON public.pagina_textos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_obracards_updated BEFORE UPDATE ON public.obra_cards FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed
INSERT INTO public.contatos_igreja (singleton, endereco, telefone, email, mapa_url)
VALUES (true, 'Vila Linda — atualize com o endereço completo da igreja', '(00) 0000-0000', 'contato@advilalinda.com.br',
'https://www.google.com/maps?q=Vila+Linda+Santo+Andre&output=embed');

INSERT INTO public.pagina_textos (chave, valor) VALUES
('home_titulo', 'A PAZ DE CRISTO JESUS!'),
('home_paragrafo1', 'É com profunda alegria que recebemos você na Igreja Assembleia de Deus — Ministério Vila Linda. Somos uma comunidade de fé comprometida com a pregação do evangelho de Jesus Cristo, com a edificação dos santos e com o amor ao próximo.'),
('home_paragrafo2', 'Aqui você encontra cultos de ensino, momentos de oração, eventos da família e departamentos que vivem a missão da igreja em todas as fases da vida. Venha conhecer, participar e fazer parte desta família.'),
('home_versiculo', '"Eu e a minha casa serviremos ao Senhor." — Josué 24:15'),
('ministerial_subtitulo', 'Conheça os pastores, dirigentes e líderes que servem a esta casa com amor e dedicação.'),
('obra_versiculo_topo', '"Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." — 2 Coríntios 9:7');

INSERT INTO public.obra_cards (icone, titulo, texto, detalhe, ordem) VALUES
('heart', 'Dízimos & Ofertas', '"Trazei todos os dízimos à casa do tesouro… e provai-me nisto, diz o Senhor dos Exércitos." (Malaquias 3:10)', E'PIX: contato@advilalinda.com.br\n(em nome da igreja)', 1),
('send', 'Missões', 'Apoie o envio de missionários e a expansão do Reino através do Departamento de Missões.', 'Reuniões: 1º domingo do mês, após o culto', 2),
('handheart', 'Voluntariado', 'Sirva ao Senhor com os dons que recebeu. Temos áreas em louvor, recepção, ensino infantil, ação social e mídia.', 'Procure um diácono ou pastor para se inscrever', 3);
