import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/**
 * Upload a file to a private bucket and return a long-lived signed URL.
 * We store the signed URL in the DB; it stays valid for ~10 years.
 */
export async function uploadEAssinar(
  bucket: "banners" | "lideres" | "aniversariantes" | "eventos" | "galeria",

  file: File,
): Promise<string> {

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, TEN_YEARS);
  if (error || !data) throw error ?? new Error("Falha ao gerar URL");
  return data.signedUrl;
}

export function extrairCaminhoDeUrl(bucket: string, url: string): string | null {
  // signed URL format: /storage/v1/object/sign/<bucket>/<path>?token=...
  const m = url.match(new RegExp(`/object/sign/${bucket}/([^?]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export async function removerDoStorage(
  bucket: "banners" | "lideres" | "aniversariantes" | "eventos",
  url: string,
) {

  const path = extrairCaminhoDeUrl(bucket, url);
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}
