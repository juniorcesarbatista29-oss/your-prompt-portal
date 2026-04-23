
-- Restringe a listagem de objetos no bucket público "bike-media".
-- O Supabase Storage usa a mesma policy de SELECT para "list" (PostgREST/RPC list_objects)
-- e para download via URL pública. Para impedir enumeração mantendo o acesso direto
-- por URL, removemos a policy ampla. As URLs públicas continuam funcionando porque
-- o endpoint /object/public/<bucket>/<path> usa o service role internamente.

DROP POLICY IF EXISTS "Public can view bike media" ON storage.objects;

-- Admins continuam com acesso total para gerenciar pelo painel
CREATE POLICY "Admins can list bike media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'bike-media'
  AND has_role(auth.uid(), 'admin'::app_role)
);
