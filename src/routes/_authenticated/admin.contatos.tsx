import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/contatos")({
  component: AdminContatos,
});

type Contatos = {
  id: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  mapa_url: string;
};

const CAMPOS: { key: keyof Omit<Contatos, "id">; label: string; multiline?: boolean; placeholder?: string }[] = [
  { key: "endereco", label: "Endereço", multiline: true },
  { key: "telefone", label: "Telefone" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "Ex.: 5511999999999" },
  { key: "email", label: "E-mail" },
  { key: "instagram", label: "Instagram (URL completa)", placeholder: "https://instagram.com/..." },
  { key: "facebook", label: "Facebook (URL completa)", placeholder: "https://facebook.com/..." },
  { key: "youtube", label: "YouTube (URL completa)", placeholder: "https://youtube.com/..." },
  { key: "mapa_url", label: "URL do mapa (Google Maps embed)", multiline: true, placeholder: "https://www.google.com/maps?q=...&output=embed" },
];

function AdminContatos() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-contatos"],
    queryFn: async (): Promise<Contatos | null> => {
      const { data, error } = await supabase.from("contatos_igreja").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data as Contatos | null;
    },
  });

  const [form, setForm] = useState<Omit<Contatos, "id">>({
    endereco: "", telefone: "", whatsapp: "", email: "",
    instagram: "", facebook: "", youtube: "", mapa_url: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        endereco: data.endereco, telefone: data.telefone, whatsapp: data.whatsapp,
        email: data.email, instagram: data.instagram, facebook: data.facebook,
        youtube: data.youtube, mapa_url: data.mapa_url,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (data?.id) {
        const { error } = await supabase.from("contatos_igreja").update(form).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("contatos_igreja").insert({ ...form, singleton: true });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Contatos atualizados");
      qc.invalidateQueries({ queryKey: ["admin-contatos"] });
      qc.invalidateQueries({ queryKey: ["site-contatos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-white/60">Carregando...</p>;

  return (
    <section>
      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="space-y-4 rounded-xl border border-white/10 bg-[color:var(--card)] p-5"
      >
        <h2 className="font-display text-lg font-black text-white">Dados de contato e redes sociais</h2>
        <p className="text-xs text-white/60">Deixe em branco qualquer campo que não queira exibir no site.</p>

        {CAMPOS.map((c) => (
          <label key={c.key} className="block text-xs font-bold uppercase tracking-widest text-white/70">
            {c.label}
            {c.multiline ? (
              <textarea
                rows={3}
                value={form[c.key]}
                placeholder={c.placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [c.key]: e.target.value }))}
                className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white focus:border-gold focus:outline-none"
              />
            ) : (
              <input
                value={form[c.key]}
                placeholder={c.placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [c.key]: e.target.value }))}
                className="mt-1 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white focus:border-gold focus:outline-none"
              />
            )}
          </label>
        ))}

        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-md bg-gold px-4 py-2 text-sm font-black text-[color:var(--navy)] disabled:opacity-60"
        >
          {save.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </section>
  );
}
