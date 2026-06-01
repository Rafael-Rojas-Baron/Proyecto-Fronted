# Heladería FrostBite

Aplicación web para gestionar productos, ingredientes y ventas de una heladería.  
Stack: React, Vite, Tailwind CSS, Supabase y despliegue en Vercel.

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [GitHub](https://github.com) (opcional, para clonar o publicar el repo)
- Cuenta en [Vercel](https://vercel.com) (opcional, para publicar en internet)

## Estructura del proyecto

```
├── public/              # Archivos estáticos (logo, etc.)
├── src/
│   ├── components/      # UI reutilizable
│   ├── context/         # Sesión de usuario
│   ├── lib/             # Cliente Supabase
│   ├── pages/           # Vistas por ruta
│   ├── services/        # Llamadas a la API
│   └── utils/           # Permisos y utilidades
├── supabase/
│   └── schema.sql       # Script de base de datos
└── package.json
```

## 1. Clonar e instalar

```bash
git clone <url-del-repositorio>
cd Proyecto_Final
npm install
```

## 2. Configurar Supabase

### Crear el proyecto

1. En [supabase.com](https://supabase.com), crea un proyecto nuevo.
2. Cuando esté listo, abre **SQL Editor** y ejecuta el contenido completo de `supabase/schema.sql`.
3. Si todo salió bien, verás las tablas `users`, `ingredientes`, `productos`, `ventas` y datos de ejemplo.

### Credenciales de conexión

En **Project Settings → API** (o **Data API**, según la versión del panel):

- **Project URL** → algo como `https://xxxxx.supabase.co` (sin `/rest/v1/` al final)
- **Clave pública** → **Publishable key** (`sb_publishable_...`) o, en la pestaña legacy, **anon public** (`eyJ...`)

No uses la **Secret key** (`sb_secret_...`) en el frontend.

### Archivo `.env` local

En la raíz del proyecto crea un archivo `.env` (no se sube a Git):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_aqui
```

Reinicia el servidor de desarrollo después de guardar el `.env`.

## 3. Ejecutar en local

```bash
npm run dev
```

Abre en el navegador la URL que muestra la terminal (por defecto `http://localhost:5173`).

Otros comandos:

```bash
npm run build    # Generar versión de producción
npm run preview  # Probar el build localmente
```

## 4. Publicar en Vercel

1. Sube el proyecto a un repositorio en GitHub.
2. En [vercel.com](https://vercel.com), importa ese repositorio.
3. Deja el framework en **Vite** y la carpeta raíz en `./`.
4. En **Environment Variables**, agrega las mismas dos variables del `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Despliega. Cada `git push` a `main` puede generar un nuevo deploy automático.

Usa la URL de **Production** (por ejemplo `https://tu-proyecto.vercel.app`). Las URLs largas de preview pueden pedir login de Vercel y no son ideales para compartir.

## Usuarios de prueba

Disponibles después de ejecutar `schema.sql`:

| Rol       | Correo                 | Contraseña |
|-----------|------------------------|------------|
| Admin     | admin@admin.co         | admin      |
| Empleado  | empleado@empleado.co   | empleado   |
| Cliente   | cliente@cliente.co     | cliente    |

Sin iniciar sesión solo se muestra el listado público de productos.

## Permisos por rol

| Rol      | Acceso |
|----------|--------|
| Público  | Menú de productos |
| Cliente  | Productos, calorías y venta |
| Empleado | Ingredientes, ventas y panel (sin rentabilidad) |
| Admin    | Todas las funciones |

## Problemas frecuentes

**“Supabase no configurado”**  
Falta el `.env` local o las variables en Vercel. Revisa nombre y valor de las dos variables.

**“Forbidden use of secret API key in browser”**  
En `VITE_SUPABASE_ANON_KEY` pusiste la clave secreta. Cambia por la publishable o la anon public y vuelve a desplegar.

**“Invalid path specified in request URL”**  
La URL de Supabase incluye `/rest/v1/`. Debe ser solo `https://xxxxx.supabase.co`.

**No cargan productos o falla el login**  
Vuelve a ejecutar `supabase/schema.sql` y confirma que las tablas tienen datos.

**Venta rechazada por inventario**  
Reabastece ingredientes desde la sección Ingredientes (roles admin o empleado).

## Logo

Coloca tu imagen en `public/logo-capy.png`. Si no existe, el encabezado mostrará un icono roto hasta que agregues el archivo.

## Licencia y autor

Proyecto académico realizado por Rafael Rojas — Heladería FrostBite.
