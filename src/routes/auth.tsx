import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acesso Administrativo — AD Vila Linda" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/eventos" });
    });
  }, [navigate]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível entrar", { description: error.message });
      return;
    }
    navigate({ to: "/admin/eventos" });
  }

  return (
    <div className="grid min-h-[calc(100vh-9rem)] place-items-center px-4">
      <form
        onSubmit={login}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[color:var(--card)] p-8"
      >
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Painel</p>
        <h1 className="mt-2 text-center font-display text-2xl font-black text-white">
          Acesso Administrativo
        </h1>

        <label className="mt-6 block text-xs font-bold uppercase tracking-widest text-white/70">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white focus:border-gold focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-xs font-bold uppercase tracking-widest text-white/70">
          Senha
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/15 bg-[color:var(--navy-deep)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white focus:border-gold focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-gold py-2.5 text-sm font-black text-[color:var(--navy)] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
