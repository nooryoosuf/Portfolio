import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    isConfigured
        ? undefined
        : {
              global: {
                  fetch: async () =>
                      new Response(JSON.stringify({ message: 'Supabase env not configured' }), {
                          status: 404,
                          headers: { 'Content-Type': 'application/json' },
                      }),
              },
          }
);
