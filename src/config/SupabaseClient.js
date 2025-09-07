import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ogjqrfnmwddhylokgppi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nanFyZm5td2RkaHlsb2tncHBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzEwOTM5MCwiZXhwIjoyMDcyNjg1MzkwfQ.Foe45vvtwAuPFTRBrOHBeHdYPKNp7jwiWsWa0BrrQJQ';
export const supabase = createClient(supabaseUrl, supabaseKey);

export const AUTH_REQUIRED = import.meta.env.VITE_AUTH_REQUIRED === 'true';
