-- Atualizar política de pedidos para exigir autenticação (anônima ou real)
DROP POLICY IF EXISTS "Todos podem criar pedidos" ON public.pedidos;

CREATE POLICY "Usuários autenticados podem criar pedidos"
ON public.pedidos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Atualizar política de itens_pedido também
DROP POLICY IF EXISTS "Todos podem criar itens" ON public.itens_pedido;

CREATE POLICY "Usuários autenticados podem criar itens"
ON public.itens_pedido
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Atualizar política de clientes para proteger dados pessoais
DROP POLICY IF EXISTS "Todos podem visualizar clientes" ON public.clientes;

CREATE POLICY "Apenas usuários autenticados podem ver clientes"
ON public.clientes
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);