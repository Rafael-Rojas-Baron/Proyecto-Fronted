import { supabase } from '../lib/supabase';

export async function getAllIngredientes() {
  const { data, error } = await supabase.from('ingredientes').select('*').order('nombre');
  if (error) throw error;
  return data;
}

export async function getIngredienteById(id) {
  const { data, error } = await supabase.from('ingredientes').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getIngredienteByNombre(nombre) {
  const { data, error } = await supabase
    .from('ingredientes')
    .select('*')
    .ilike('nombre', `%${nombre}%`);
  if (error) throw error;
  return data;
}

export async function isIngredienteSano(id) {
  const ing = await getIngredienteById(id);
  return ing.es_sano;
}

export async function createIngrediente(payload) {
  const { data, error } = await supabase.from('ingredientes').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateIngrediente(id, payload) {
  const { data, error } = await supabase
    .from('ingredientes')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteIngrediente(id) {
  const { error } = await supabase.from('ingredientes').delete().eq('id', id);
  if (error) throw error;
}

export async function reabastecerIngrediente(id, cantidad) {
  const current = await getIngredienteById(id);
  return updateIngrediente(id, { inventario: current.inventario + cantidad });
}

export async function renovarInventarioComplemento(id) {
  const ing = await getIngredienteById(id);
  if (ing.tipo !== 'complemento') {
    throw new Error('Solo los complementos pueden renovarse a 0 con una instrucción.');
  }
  return updateIngrediente(id, { inventario: 0 });
}
