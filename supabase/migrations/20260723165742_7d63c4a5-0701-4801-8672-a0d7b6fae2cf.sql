
-- Álbuns
CREATE TABLE public.galeria_albuns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID NOT NULL UNIQUE REFERENCES public.eventos(id) ON DELETE CASCADE,
  publicado BOOLEAN NOT NULL DEFAULT false,
  capa_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.galeria_albuns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_albuns TO authenticated;
GRANT ALL ON public.galeria_albuns TO service_role;
ALTER TABLE public.galeria_albuns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Álbuns publicados são públicos"
  ON public.galeria_albuns FOR SELECT
  USING (publicado = true);

CREATE POLICY "Admins veem todos os álbuns"
  ON public.galeria_albuns FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins gerenciam álbuns"
  ON public.galeria_albuns FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_galeria_albuns_updated_at
  BEFORE UPDATE ON public.galeria_albuns
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Fotos
CREATE TABLE public.galeria_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.galeria_albuns(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_galeria_fotos_album ON public.galeria_fotos(album_id, ordem);
GRANT SELECT ON public.galeria_fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_fotos TO authenticated;
GRANT ALL ON public.galeria_fotos TO service_role;
ALTER TABLE public.galeria_fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fotos de álbuns publicados são públicas"
  ON public.galeria_fotos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.galeria_albuns a
    WHERE a.id = galeria_fotos.album_id AND a.publicado = true
  ));

CREATE POLICY "Admins veem todas as fotos"
  ON public.galeria_fotos FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins gerenciam fotos"
  ON public.galeria_fotos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_galeria_fotos_updated_at
  BEFORE UPDATE ON public.galeria_fotos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage policies para bucket 'galeria'
CREATE POLICY "Galeria: leitura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galeria');

CREATE POLICY "Galeria: admins fazem upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'galeria' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Galeria: admins atualizam"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'galeria' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Galeria: admins removem"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'galeria' AND public.has_role(auth.uid(), 'admin'));
