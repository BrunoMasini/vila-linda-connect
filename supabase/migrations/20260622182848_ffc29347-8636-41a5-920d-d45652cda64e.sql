
-- Enum de papéis e tabela user_roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Eventos
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  data DATE NOT NULL,
  hora TIME,
  preletor TEXT,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.eventos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.eventos TO authenticated;
GRANT ALL ON public.eventos TO service_role;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eventos públicos" ON public.eventos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam eventos" ON public.eventos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Aniversariantes
CREATE TABLE public.aniversariantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.aniversariantes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.aniversariantes TO authenticated;
GRANT ALL ON public.aniversariantes TO service_role;
ALTER TABLE public.aniversariantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Aniversariantes públicos" ON public.aniversariantes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam aniversariantes" ON public.aniversariantes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Lideres
CREATE TABLE public.lideres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  foto_url TEXT,
  biografia TEXT,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lideres TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lideres TO authenticated;
GRANT ALL ON public.lideres TO service_role;
ALTER TABLE public.lideres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lideres públicos" ON public.lideres FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam lideres" ON public.lideres FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Banners (carrossel)
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imagem_url TEXT NOT NULL,
  titulo TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Banners públicos" ON public.banners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam banners" ON public.banners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
