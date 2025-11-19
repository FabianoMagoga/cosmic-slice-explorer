import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const encoder = new TextEncoder();

function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password: string, salt?: string): Promise<string> {
  const actualSalt = salt ?? generateSalt(16);
  const data = encoder.encode(password + actualSalt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `sha256$${actualSalt}$${hashHex}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith('sha256$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;

    const [, salt, hash] = parts;
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex === hash;
  }

  // Legacy: senhas antigas em texto plano
  return storedHash === password;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, usuario, senha, nome } = await req.json();

    // Login: verifica credenciais contra tabela funcionarios
    if (action === 'login') {
      const { data: funcionario, error } = await supabaseClient
        .from('funcionarios')
        .select('*')
        .eq('ativo', true)
        .ilike('usuario', usuario)
        .single();

      if (error || !funcionario) {
        return new Response(
          JSON.stringify({ success: false, error: 'Usuário ou senha inválidos' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Verificar senha (suporta texto plano legado e hash SHA-256 com salt)
      const senhaValida = await verifyPassword(senha, funcionario.senha);

      // Se a senha estava em texto plano e for válida, atualiza para hash seguro
      if (senhaValida && !funcionario.senha.startsWith('sha256$')) {
        const novaSenhaHasheada = await hashPassword(senha);
        await supabaseClient
          .from('funcionarios')
          .update({ senha: novaSenhaHasheada })
          .eq('id', funcionario.id);
      }

      if (!senhaValida) {
        return new Response(
          JSON.stringify({ success: false, error: 'Usuário ou senha inválidos' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          funcionario: {
            id: funcionario.id,
            usuario: funcionario.usuario,
            nome: funcionario.nome,
            papel: funcionario.papel,
            ativo: funcionario.ativo
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar funcionário (apenas admins)
    if (action === 'criar-funcionario') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Não autorizado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Verificar se usuário é admin
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Não autorizado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Hashear senha com SHA-256 + salt
      const senhaHasheada = await hashPassword(senha);

      const { data: novoFuncionario, error: createError } = await supabaseClient
        .from('funcionarios')
        .insert({
          usuario,
          senha: senhaHasheada,
          nome,
          papel: 'ATENDENTE',
          ativo: true
        })
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, funcionario: novoFuncionario }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Ação inválida' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});