import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Cliente padrão para o lado do cliente (usa a chave anônima)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente Admin para o lado do servidor/painel (usa a chave de serviço)
// Isso bypassa as políticas de RLS para dar acesso total ao admin.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // Impede que este cliente interfira na sessão de autenticação do navegador
    persistSession: false,
  },
});
