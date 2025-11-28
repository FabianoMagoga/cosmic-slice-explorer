// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

// ===== CONFIGURAÇÃO CORS =====
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ======== FUNÇÃO EDGE PRINCIPAL ========
serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { usuario, senha } = await req.json();

    if (!usuario || !senha) {
      return new Response(
        JSON.stringify({ error: "Usuário e senha são obrigatórios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== 1. Buscar administrador =====
    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, usuario, senha_hash, nome")
      .eq("usuario", usuario)
      .maybeSingle();

    if (error || !admin) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== 2. Verificar senha =====
    const senhaOk = await bcrypt.compare(senha, admin.senha_hash);

    if (!senhaOk) {
      return new Response(
        JSON.stringify({ error: "Senha incorreta." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== 3. Gerar Token Simples =====
    const token = crypto.randomUUID();

    // Salva o token em tabela (opcional, mas recomendado)
    await supabase.from("admin_sessoes").insert({
      admin_id: admin.id,
      token,
    });

    // ===== 4. Retorno =====
    return new Response(
      JSON.stringify({
        ok: true,
        token,
        admin: {
          id: admin.id,
          nome: admin.nome,
          usuario: admin.usuario,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Erro interno.", detalhe: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
