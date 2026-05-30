# Heladería FrostBite — Guía de configuración

Proyecto final: React + Vite + TailwindCSS + Supabase + Vercel.

---

## Lo que necesitas tener listo

| Recurso | Para qué |
|---------|----------|
| Cuenta en [Supabase](https://supabase.com) | Base de datos y API REST |
| Cuenta en [GitHub](https://github.com) | Subir el código (entrega) |
| Cuenta en [Vercel](https://vercel.com) | Desplegar la app en internet |
| [Node.js](https://nodejs.org) (v18+) | Ejecutar el proyecto en tu PC |

---

## PARTE 1 — Supabase (base de datos)

### Paso 1: Crear cuenta y proyecto

1. Entra a https://supabase.com y regístrate (GitHub o correo).
2. Clic en **New project**.
3. Elige organización, nombre del proyecto (ej. `heladeria-frostbite`), contraseña de base de datos y región cercana.
4. Espera 1–2 minutos a que el proyecto esté listo.

### Paso 2: Ejecutar el script SQL

1. En el menú lateral: **SQL Editor** → **New query**.
2. Abre el archivo `supabase/schema.sql` de este proyecto.
3. Copia **todo** el contenido y pégalo en el editor.
4. Clic en **Run** (debe decir Success).

Eso crea tablas, vistas, políticas RLS y datos de prueba (ingredientes, productos, usuarios).

### Paso 3: Obtener las credenciales (esto me lo das tú)

1. Ve a **Project Settings** (engranaje) → **API**.
2. Copia estos dos valores:

| Variable | Dónde está en Supabase |
|----------|-------------------------|
| `VITE_SUPABASE_URL` | **Project URL** |
| `VITE_SUPABASE_ANON_KEY` | **anon public** (clave pública) |

3. En la carpeta `Proyecto_Final`, crea un archivo `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **No compartas** la clave `service_role` en el frontend; solo usa la `anon`.

### Usuarios de prueba (después del SQL)

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Admin | admin@admin.co | admin |
| Empleado | empleado@empleado.co | empleado |
| Cliente | cliente@cliente.co | cliente |

---

## PARTE 2 — Ejecutar en tu computador

```powershell
cd "c:\Users\Rafael.Rojas\Desktop\Proyecto de grado Frontend\Proyecto_Final"
npm install
npm run dev
```

Abre **http://localhost:5173**

---

## PARTE 3 — GitHub (entrega de código)

### Paso 1: Crear repositorio

1. https://github.com/new
2. Nombre: `proyecto-final-heladeria` (o el que pida tu docente).
3. Público o privado según indiquen.
4. **No** marques “Add README” si ya tienes código local.

### Paso 2: Subir el proyecto

En PowerShell (ajusta tu usuario de GitHub):

```powershell
cd "c:\Users\Rafael.Rojas\Desktop\Proyecto de grado Frontend\Proyecto_Final"
git init
git add .
git commit -m "Proyecto final Heladería FrostBite - React Supabase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/proyecto-final-heladeria.git
git push -u origin main
```

> El archivo `.env` **no** se sube (está en `.gitignore`). Eso es correcto.

---

## PARTE 4 — Vercel (despliegue)

### Paso 1: Crear cuenta

1. https://vercel.com → **Sign Up** (con la misma cuenta de GitHub es lo más fácil).

### Paso 2: Importar el repositorio

1. **Add New…** → **Project**.
2. Importa el repo de GitHub que creaste.
3. Framework: **Vite** (se detecta solo).
4. Root Directory: `Proyecto_Final` si el repo es la carpeta padre; si el repo es solo `Proyecto_Final`, déjalo en `/`.

### Paso 3: Variables de entorno en Vercel

En **Environment Variables**, agrega:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | La misma URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | La misma anon key |

Aplícalas a **Production**, **Preview** y **Development**.

### Paso 4: Deploy

Clic en **Deploy**. Al terminar tendrás una URL como:

`https://proyecto-final-heladeria.vercel.app`

Esa URL es la que entregas como proyecto desplegado.

---

## Qué debes enviarme / usar tú para completar todo

Para que la app funcione al 100% en local y en Vercel, necesitas:

1. **`VITE_SUPABASE_URL`** — de Supabase → Settings → API  
2. **`VITE_SUPABASE_ANON_KEY`** — misma sección (clave `anon public`)  
3. Confirmación de que ejecutaste **`supabase/schema.sql`** sin errores  
4. (Opcional) URL del repo GitHub y URL de Vercel cuando despliegues  

Con (1) y (2) puedes crear el `.env` y probar login, productos, ventas e inventario.

---

## Roles y permisos implementados

| Rol | Permisos |
|-----|----------|
| **Público** | Solo lista de productos (sin calorías ni venta) |
| **Cliente** | Productos + calorías + venta |
| **Empleado** | Todo excepto rentabilidad y panel admin de rentabilidad |
| **Admin** | Acceso completo incl. rentabilidad y producto más rentable |

---

## Operaciones de API del taller

Implementadas en `src/services/`:

- Usuarios: login por correo y contraseña  
- Productos: listar, buscar, calorías, costo, rentabilidad, vender  
- Ingredientes: CRUD, reabastecer, renovar complemento a 0, consultar si es sano  

---

## Solución de problemas

| Problema | Solución |
|----------|----------|
| Pantalla “Supabase no configurado” | Crear `.env` con las dos variables |
| Error 401 / RLS | Volver a ejecutar las políticas del `schema.sql` |
| Login falla | Verificar que existan filas en tabla `users` |
| Venta dice sin inventario | Reabastecer ingredientes en /ingredientes |
| Build en Vercel falla | Revisar que las env vars estén en el dashboard de Vercel |

---

## Comandos útiles

```powershell
npm run dev      # desarrollo
npm run build    # compilar para producción
npm run preview  # probar build local
```
