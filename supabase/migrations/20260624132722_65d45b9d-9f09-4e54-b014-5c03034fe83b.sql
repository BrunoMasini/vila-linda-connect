
-- Enum igreja
DO $$ BEGIN
  CREATE TYPE public.igreja_tipo AS ENUM ('sede','filial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tabela cultos
CREATE TABLE public.cultos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  igreja public.igreja_tipo NOT NULL,
  hora_inicio time,
  hora_fim time,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cultos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cultos TO authenticated;
GRANT ALL ON public.cultos TO service_role;

ALTER TABLE public.cultos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cultos_select_public" ON public.cultos FOR SELECT USING (true);
CREATE POLICY "cultos_admin_all" ON public.cultos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER cultos_touch_updated_at BEFORE UPDATE ON public.cultos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed
INSERT INTO public.cultos (titulo, descricao, igreja, hora_inicio, hora_fim, ordem) VALUES
  ('Culto na Direção das Irmãs','Todo primeiro sábado do mês','sede','18:30','20:30',1),
  ('Culto de Santa Ceia','Último domingo do mês','sede','09:30','11:30',2),
  ('Culto de Oração','Semanal','sede','19:30','20:30',3),
  ('Culto de Ensino','Todas as quartas-feiras','sede','19:30','21:00',4),
  ('Culto de Cura e Libertação','Todas as sextas-feiras','sede','19:30','21:00',5),
  ('Culto com a Família','Todos os domingos (exceto o último do mês)','sede','19:30','21:00',6),
  ('Culto de Oração','Todas as segundas-feiras','filial','19:30','20:30',1),
  ('Culto de Cura e Libertação','Todas as sextas-feiras','filial','19:30','21:00',2),
  ('Culto com a Família','Todos os domingos','filial','19:30','21:00',3);

-- Foto em eventos
ALTER TABLE public.eventos ADD COLUMN IF NOT EXISTS foto_url text;
