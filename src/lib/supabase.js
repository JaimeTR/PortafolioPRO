import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cliente público para lectura de datos en el frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente de servicio para operaciones de escritura en el servidor (salta RLS)
export const createServiceRoleClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
