// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos no .env");
  throw new Error("Supabase não configurado corretamente");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
