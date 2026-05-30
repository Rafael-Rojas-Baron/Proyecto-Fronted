import { supabase } from '../lib/supabase';

export async function getAllProductos() {
  const { data, error } = await supabase.from('productos').select('*').order('nombre');
  if (error) throw error;
  return data;
}

export async function getProductoById(id) {
  const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getProductoByNombre(nombre) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .ilike('nombre', `%${nombre}%`);
  if (error) throw error;
  return data;
}

export async function getProductosConIngredientes() {
  const { data: productos, error: pErr } = await supabase.from('productos').select('*').order('nombre');
  if (pErr) throw pErr;

  const { data: links, error: lErr } = await supabase
    .from('producto_ingrediente')
    .select('producto_id, ingrediente_id, ingredientes(*)');
  if (lErr) throw lErr;

  const { data: calorias } = await supabase.from('v_calorias_producto').select('*');
  const { data: costos } = await supabase.from('v_costo_producto').select('*');
  const { data: rentabilidad } = await supabase.from('v_rentabilidad_producto').select('*');

  return productos.map((p) => {
    const ings = links
      .filter((l) => l.producto_id === p.id)
      .map((l) => l.ingredientes)
      .filter(Boolean);
    const cal = calorias?.find((c) => c.producto_id === p.id);
    const cost = costos?.find((c) => c.producto_id === p.id);
    const rent = rentabilidad?.find((r) => r.producto_id === p.id);
    return {
      ...p,
      ingredientes: ings,
      total_calorias: cal?.total_calorias ?? 0,
      costo: cost?.costo ?? 0,
      rentabilidad: rent?.rentabilidad ?? 0,
    };
  });
}

export async function getCaloriasByProductoId(id) {
  const { data, error } = await supabase
    .from('v_calorias_producto')
    .select('*')
    .eq('producto_id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCostoByProductoId(id) {
  const { data, error } = await supabase
    .from('v_costo_producto')
    .select('*')
    .eq('producto_id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRentabilidadByProductoId(id) {
  const { data, error } = await supabase
    .from('v_rentabilidad_producto')
    .select('*')
    .eq('producto_id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProductoMasRentable() {
  const { data, error } = await supabase
    .from('v_rentabilidad_producto')
    .select('*')
    .order('rentabilidad', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getIngredientesDeProducto(productoId) {
  const { data, error } = await supabase
    .from('producto_ingrediente')
    .select('ingredientes(*)')
    .eq('producto_id', productoId);
  if (error) throw error;
  return data.map((r) => r.ingredientes).filter(Boolean);
}

export async function venderProducto(productoId, userId, cantidad = 1) {
  const producto = await getProductoById(productoId);
  const ingredientes = await getIngredientesDeProducto(productoId);

  if (ingredientes.length !== 3) {
    throw new Error('El producto debe tener exactamente 3 ingredientes configurados.');
  }

  const sinStock = ingredientes.filter((i) => i.inventario < cantidad);
  if (sinStock.length > 0) {
    throw new Error(
      `Sin inventario suficiente: ${sinStock.map((i) => i.nombre).join(', ')}`
    );
  }

  for (const ing of ingredientes) {
    const { error } = await supabase
      .from('ingredientes')
      .update({ inventario: ing.inventario - cantidad })
      .eq('id', ing.id);
    if (error) throw error;
  }

  const total = Number(producto.precio_publico) * cantidad;
  const { data, error } = await supabase
    .from('ventas')
    .insert({
      producto_id: productoId,
      user_id: userId ?? null,
      cantidad,
      total,
    })
    .select()
    .single();
  if (error) throw error;
  return { venta: data, producto, total };
}
