import { supabase } from '../lib/supabase';

export async function loginByEmailPassword(correo, password) {
  const { data, error } = await supabase
    .from('users')
    .select('id, nombre, correo, rol')
    .eq('correo', correo.trim().toLowerCase())
    .eq('password', password)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Correo o contraseña incorrectos.');
  return data;
}

export async function getUserByEmail(correo) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('correo', correo.trim().toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}
