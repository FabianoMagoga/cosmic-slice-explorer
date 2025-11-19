-- Corrigir políticas de segurança para proteger dados dos clientes

-- 1. Remover políticas públicas inseguras da tabela clientes
DROP POLICY IF EXISTS "Todos podem criar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Apenas usuários autenticados podem ver clientes" ON public.clientes;

-- 2. Criar políticas seguras para clientes (apenas usuários autenticados podem criar e ver seus próprios dados)
CREATE POLICY "Usuários autenticados podem criar clientes"
ON public.clientes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem ver todos os clientes"
ON public.clientes
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- 3. Remover política pública insegura da tabela pedidos
DROP POLICY IF EXISTS "Todos podem visualizar pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Usuários autenticados podem criar pedidos" ON public.pedidos;

-- 4. Criar políticas seguras para pedidos
CREATE POLICY "Usuários podem ver seus próprios pedidos"
ON public.pedidos
FOR SELECT
TO authenticated
USING (auth.uid() = cliente_id OR is_admin(auth.uid()));

CREATE POLICY "Usuários autenticados podem criar pedidos"
ON public.pedidos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem atualizar pedidos"
ON public.pedidos
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()));

-- 5. Adicionar política segura para itens_pedido
DROP POLICY IF EXISTS "Todos podem visualizar itens" ON public.itens_pedido;

CREATE POLICY "Usuários podem ver itens de seus pedidos"
ON public.itens_pedido
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos
    WHERE pedidos.id = itens_pedido.pedido_id
    AND (pedidos.cliente_id = auth.uid() OR is_admin(auth.uid()))
  )
);