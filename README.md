# Web Consulting Lenses

Aplicación web para gestión y cotización de lentes ópticos, construida con React, TypeScript, Vite y TanStack Router.

## 🚀 Deploy en Vercel

Esta aplicación está configurada para deploy en Vercel.

### Configuración de Variables de Entorno

En el dashboard de Vercel, agrega las siguientes variables de entorno:

- `VITE_API_BASE_URL` (opcional): URL base de la API. Si no se define, se usará el fallback: `https://optic-management-api.onrender.com`

### Deploy Manual

1. Conecta tu repositorio con Vercel
2. Vercel detectará automáticamente la configuración desde `vercel.json`
3. Agrega las variables de entorno en el dashboard
4. El deploy se ejecutará automáticamente

### Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 🛠️ Desarrollo Local

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm

### Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview
```

## 📦 Stack Tecnológico

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TanStack Router** - Routing
- **TanStack Query** - Gestión de estado del servidor
- **TanStack Table** - Tablas de datos
- **Zod** - Validación de schemas
- **Tailwind CSS** - Estilos
- **React Hook Form** - Formularios

## 🔧 Configuración

### React Compiler

El React Compiler está habilitado en este proyecto. Ver [documentación](https://react.dev/learn/react-compiler) para más información.

Nota: Esto puede impactar el rendimiento de Vite dev & build.

## 📝 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── features/       # Features de la aplicación
├── hooks/         # Custom hooks
├── lib/           # Utilidades y helpers
├── routes/        # Rutas de la aplicación
└── config/        # Configuración
```

## 🔐 Variables de Entorno

Crea un archivo `.env.local` para desarrollo local:

```env
VITE_API_BASE_URL=https://tu-api-url.com
```

### Variables en Vercel

1. Ve a tu proyecto en el dashboard de Vercel
2. Settings → Environment Variables
3. Agrega `VITE_API_BASE_URL` con la URL de tu API
4. Selecciona los entornos donde aplicará (Production, Preview, Development)
