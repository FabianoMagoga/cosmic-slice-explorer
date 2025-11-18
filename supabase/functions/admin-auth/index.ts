import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
        .eq('usuario', usuario)
        .eq('ativo', true)
        .single();

      if (error || !funcionario) {
        return new Response(
          JSON.stringify({ success: false, error: 'Usuário ou senha inválidos' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Verificar senha (suporta texto plano legado e bcrypt)
      let senhaValida = false;
      if (funcionario.senha.startsWith('$2')) {
        // Senha hasheada com bcrypt
        senhaValida = await bcrypt.compare(senha, funcionario.senha);
      } else {
        // Senha em texto plano (legado - inseguro)
        senhaValida = funcionario.senha === senha;
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

      // Hashear senha com bcrypt
      const senhaHasheada = await bcrypt.hash(senha);

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