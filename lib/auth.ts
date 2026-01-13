import { supabase } from './supabase';

export async function checkAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const profile = data as { role: string } | null;
  
  return profile?.role === 'admin';
}