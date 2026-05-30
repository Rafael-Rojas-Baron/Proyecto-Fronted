import { supabase } from '../lib/supabase';

export async function getVentasDelDia() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from('ventas')
    .select('*, productos(nombre)')
    .gte('fecha', start.toISOString())
    .order('fecha', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getContadorVentasDelDia() {
  const ventas = await getVentasDelDia();
  const unidades = ventas.reduce((acc, v) => acc + v.cantidad, 0);
  const ingresos = ventas.reduce((acc, v) => acc + Number(v.total), 0);
  return { cantidadVentas: ventas.length, unidades, ingresos, ventas };
}
