-- Script de migração de senhas em texto plano para bcrypt
-- IMPORTANTE: Este script deve ser executado para garantir que todas as senhas estejam hasheadas

-- Criar extensão pgcrypto se não existir
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar função para hashear senha se não estiver hasheada
CREATE OR REPLACE FUNCTION hash_plaintext_passwords()
RETURNS void AS $$
DECLARE
  func RECORD;
BEGIN
  FOR func IN 
    SELECT id, senha FROM funcionarios 
    WHERE NOT senha LIKE '$2%' AND ativo = true
  LOOP
    -- Avisar que senha em texto plano foi encontrada
    RAISE NOTICE 'Hasheando senha do funcionário ID: %', func.id;
    
    -- Atualizar com hash bcrypt
    -- Nota: Esta é uma migração única. Em produção, usuários deveriam resetar suas senhas
    UPDATE funcionarios 
    SET senha = crypt(senha, gen_salt('bf'))
    WHERE id = func.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar a função de migração
SELECT hash_plaintext_passwords();

-- Remover a função após uso
DROP FUNCTION hash_plaintext_passwords();

-- Adicionar constraint para garantir que apenas senhas bcrypt sejam aceitas no futuro
ALTER TABLE funcionarios
ADD CONSTRAINT senha_must_be_bcrypt 
CHECK (senha LIKE '$2%' OR senha LIKE '$2a$%' OR senha LIKE '$2b$%' OR senha LIKE '$2y$%');

COMMENT ON CONSTRAINT senha_must_be_bcrypt ON funcionarios IS 
'Garante que todas as senhas sejam hasheadas com bcrypt. Senhas em texto plano não são mais aceitas.';