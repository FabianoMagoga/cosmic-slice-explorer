-- 1. Criar enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'atendente');

-- 2. Criar tabela de roles de usuários
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar função security definer para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Criar função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT has_role(_user_id, 'admin')
$$;

-- 6. Políticas RLS para user_roles
CREATE POLICY "Usuários podem ver seus próprios roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Apenas admins podem gerenciar roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 7. PROTEGER DADOS SENSÍVEIS: Remover todas as políticas que expõem senhas
DROP POLICY IF EXISTS "Funcionários podem ver a si mesmos" ON public.funcionarios;
DROP POLICY IF EXISTS "Apenas admins podem atualizar funcionários" ON public.funcionarios;
DROP POLICY IF EXISTS "Apenas admins podem criar funcionários" ON public.funcionarios;

-- Bloquear acesso completo à tabela funcionarios (contém senhas em texto plano)
CREATE POLICY "Bloquear acesso público a credenciais"
ON public.funcionarios
FOR ALL
TO public, anon, authenticated
USING (false)
WITH CHECK (false);

-- 8. Atualizar políticas de produtos para usar função de admin
DROP POLICY IF EXISTS "Admins podem gerenciar produtos" ON public.produtos;

CREATE POLICY "Admins podem gerenciar produtos"
ON public.produtos
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 9. Comentários de segurança
COMMENT ON TABLE public.funcionarios IS 'TABELA LEGADA COM SENHAS EM TEXTO PLANO - NÃO USAR! Migrar para auth.users + user_roles';
COMMENT ON COLUMN public.funcionarios.senha IS 'INSEGURO: senha em texto plano. Não expor via API.';
COMMENT ON FUNCTION public.has_role IS 'Verifica role usando security definer para evitar recursão RLS';
COMMENT ON FUNCTION public.is_admin IS 'Verifica se usuário é admin via user_roles';