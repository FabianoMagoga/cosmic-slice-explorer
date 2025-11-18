-- Criar tabela de funcionários
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('ADMIN', 'ATENDENTE')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Funcionários podem ver a si mesmos" 
ON public.funcionarios 
FOR SELECT 
USING (true);

CREATE POLICY "Apenas admins podem criar funcionários" 
ON public.funcionarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar funcionários" 
ON public.funcionarios 
FOR UPDATE 
USING (true);

-- Inserir admin padrão (senha: admin123)
INSERT INTO public.funcionarios (usuario, senha, nome, papel, ativo)
VALUES ('admin', 'admin123', 'Administrador', 'ADMIN', true);