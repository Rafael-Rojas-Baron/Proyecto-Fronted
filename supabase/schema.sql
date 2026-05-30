-- Heladería FrostBite — Script completo para Supabase SQL Editor
-- Ejecutar en orden (todo el archivo de una vez)

-- Usuarios (autenticación por correo y contraseña según el taller)
create table if not exists public.users (
  id bigserial primary key,
  nombre text not null,
  correo text unique not null,
  password text not null,
  rol text check (rol in ('admin', 'empleado', 'cliente')) not null default 'cliente'
);

-- Ingredientes
create table if not exists public.ingredientes (
  id bigserial primary key,
  nombre text not null,
  precio numeric(10,2) not null,
  calorias integer not null,
  inventario integer not null default 0,
  es_vegetariano boolean not null default false,
  es_sano boolean not null default true,
  tipo text check (tipo in ('base', 'complemento')) not null,
  sabor text
);

-- Productos
create table if not exists public.productos (
  id bigserial primary key,
  nombre text not null,
  precio_publico numeric(10,2) not null,
  tipo text check (tipo in ('copa', 'malteada')) not null,
  vaso text,
  volumen_onzas integer
);

-- Relación productos - ingredientes (3 por producto)
create table if not exists public.producto_ingrediente (
  id bigserial primary key,
  producto_id bigint not null references public.productos(id) on delete cascade,
  ingrediente_id bigint not null references public.ingredientes(id) on delete cascade,
  unique (producto_id, ingrediente_id)
);

-- Ventas
create table if not exists public.ventas (
  id bigserial primary key,
  producto_id bigint not null references public.productos(id),
  user_id bigint references public.users(id),
  fecha timestamptz default now(),
  cantidad integer not null default 1,
  total numeric(10,2) not null
);

-- Vistas analíticas
create or replace view public.v_calorias_producto as
select p.id as producto_id, p.nombre,
  coalesce(sum(i.calorias), 0) as total_calorias
from public.productos p
left join public.producto_ingrediente pi on p.id = pi.producto_id
left join public.ingredientes i on pi.ingrediente_id = i.id
group by p.id, p.nombre;

create or replace view public.v_costo_producto as
select p.id as producto_id, p.nombre,
  coalesce(sum(i.precio), 0) as costo
from public.productos p
left join public.producto_ingrediente pi on p.id = pi.producto_id
left join public.ingredientes i on pi.ingrediente_id = i.id
group by p.id, p.nombre;

create or replace view public.v_rentabilidad_producto as
select p.id as producto_id, p.nombre,
  p.precio_publico,
  c.costo,
  (p.precio_publico - c.costo) as rentabilidad
from public.productos p
join public.v_costo_producto c on p.id = c.producto_id;

-- Políticas permisivas para desarrollo (API REST con anon key)
alter table public.users enable row level security;
alter table public.ingredientes enable row level security;
alter table public.productos enable row level security;
alter table public.producto_ingrediente enable row level security;
alter table public.ventas enable row level security;

create policy "users_all" on public.users for all using (true) with check (true);
create policy "ingredientes_all" on public.ingredientes for all using (true) with check (true);
create policy "productos_all" on public.productos for all using (true) with check (true);
create policy "pi_all" on public.producto_ingrediente for all using (true) with check (true);
create policy "ventas_all" on public.ventas for all using (true) with check (true);

-- Datos iniciales (solo si las tablas están vacías)
insert into public.ingredientes (nombre, precio, calorias, inventario, es_vegetariano, es_sano, tipo, sabor)
select * from (values
  ('Vainilla', 1000, 150, 50, true, true, 'base', 'vainilla'),
  ('Fresa', 1200, 100, 40, true, true, 'base', 'fresa'),
  ('Chocolate', 1500, 200, 30, true, true, 'base', 'chocolate'),
  ('Chispas de Chocolate', 500, 50, 25, true, false, 'complemento', null),
  ('Crema Batida', 300, 70, 20, true, false, 'complemento', null),
  ('Sirope de Fresa', 400, 60, 15, true, false, 'complemento', null),
  ('Oreo', 800, 110, 25, true, false, 'complemento', null)
) as v(nombre, precio, calorias, inventario, es_vegetariano, es_sano, tipo, sabor)
where not exists (select 1 from public.ingredientes limit 1);

insert into public.productos (nombre, precio_publico, tipo, vaso, volumen_onzas)
select * from (values
  ('Copa Vainilla Deluxe', 5000, 'copa', 'mediano', null::integer),
  ('Copa ChocoFresa', 6000, 'copa', 'grande', null::integer),
  ('Malteada de Fresa', 7000, 'malteada', null::text, 16),
  ('Malteada Oreo', 7500, 'malteada', null::text, 20)
) as v(nombre, precio_publico, tipo, vaso, volumen_onzas)
where not exists (select 1 from public.productos limit 1);

insert into public.producto_ingrediente (producto_id, ingrediente_id)
select * from (values
  (1::bigint, 1::bigint), (1, 5), (1, 4),
  (2, 3), (2, 2), (2, 6),
  (3, 2), (3, 1), (3, 5),
  (4, 3), (4, 7), (4, 5)
) as v(producto_id, ingrediente_id)
where not exists (select 1 from public.producto_ingrediente limit 1);

insert into public.ventas (producto_id, cantidad, total)
select * from (values
  (1::bigint, 2, 10000::numeric),
  (2, 1, 6000::numeric),
  (3, 3, 21000::numeric),
  (4, 1, 7500::numeric)
) as v(producto_id, cantidad, total)
where not exists (select 1 from public.ventas limit 1);

insert into public.users (nombre, correo, password, rol)
select * from (values
  ('Administrador', 'admin@admin.co', 'admin', 'admin'),
  ('Empleado', 'empleado@empleado.co', 'empleado', 'empleado'),
  ('Cliente', 'cliente@cliente.co', 'cliente', 'cliente')
) as v(nombre, correo, password, rol)
where not exists (select 1 from public.users limit 1);
