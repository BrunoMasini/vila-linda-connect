
CREATE POLICY "eventos_storage_select_auth" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'eventos');
CREATE POLICY "eventos_storage_select_anon" ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'eventos');
CREATE POLICY "eventos_storage_admin_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'eventos' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "eventos_storage_admin_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'eventos' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "eventos_storage_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'eventos' AND public.has_role(auth.uid(),'admin'));
