GRANT SELECT ON public.galeria_albuns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_albuns TO authenticated;
GRANT ALL ON public.galeria_albuns TO service_role;

GRANT SELECT ON public.galeria_fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_fotos TO authenticated;
GRANT ALL ON public.galeria_fotos TO service_role;