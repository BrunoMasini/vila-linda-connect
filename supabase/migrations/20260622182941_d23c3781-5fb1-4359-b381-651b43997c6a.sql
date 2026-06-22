
-- Public read for content buckets
CREATE POLICY "Public read content buckets" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('banners', 'lideres', 'aniversariantes'));

CREATE POLICY "Admins upload content buckets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('banners', 'lideres', 'aniversariantes') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update content buckets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('banners', 'lideres', 'aniversariantes') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete content buckets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('banners', 'lideres', 'aniversariantes') AND public.has_role(auth.uid(), 'admin'));
