# Plan de Arquitectura Frontend - Mi Árbol en el Mundo

## Resumen Ejecutivo

Este documento presenta un plan de acción para profesionalizar la arquitectura del frontend, incluyendo la decisión sobre separar la landing page y reorganizar la estructura del código.

---

## IMPORTANTE: ¿Qué es un Monorepo?

**UN SOLO REPOSITORIO** que contiene múltiples aplicaciones y paquetes.

```
my-tree-in-the-world/          # 1 SOLO REPOSITORIO (no 2 repos separados)
├── apps/
│   ├── landing/               # App 1: Landing page (Astro)
│   └── app/                   # App 2: Dashboard (React + Vite)
├── packages/                  # Código compartido entre apps
│   ├── ui/                    # Componentes UI (Button, Card, etc.)
│   └── shared/                # Utils, constantes, tipos
├── pnpm-workspace.yaml        # Define que es un monorepo
└── package.json               # Scripts globales
```

**Beneficios del monorepo:**
- Un solo `git clone`, un solo repo en GitHub
- Código compartido sin publicar a npm
- Cambios atómicos (modificas UI y ambas apps lo ven)
- Un solo PR puede tocar landing + app + packages

**NO es lo mismo que repos separados:**
- Repos separados = 2 URLs de GitHub diferentes
- Monorepo = 1 URL de GitHub, múltiples carpetas

---

## Parte 1: Decisión sobre Landing Page Separada

### Análisis de Opciones

| Aspecto | Opción A: Mismo Repo | Opción B: Monorepo | Opción C: Repos Separados |
|---------|---------------------|-------------------|--------------------------|
| **Complejidad** | Baja | Media | Alta |
| **SEO** | Limitado (CSR) | Excelente (SSR/SSG) | Excelente (SSR/SSG) |
| **Performance Landing** | ~200KB bundle | ~50KB bundle | ~50KB bundle |
| **Código compartido** | Directo | Via packages | Via npm/duplicado |
| **Deploy** | 1 deploy | 2 deploys, 1 repo | 2 deploys, 2 repos |
| **Equipos** | 1 equipo | 1-2 equipos | 2 equipos |

### Mi Recomendación: **Opción B - Monorepo con pnpm workspaces**

**Razones:**
1. SEO profesional para landing (crítico para atraer usuarios)
2. Código compartido sin duplicación (UI components, tipos, utils)
3. Un solo repo = fácil de mantener
4. Deploys independientes cuando los necesites
5. Escalable si el equipo crece

### Estructura Propuesta del Monorepo

```
my-tree-in-the-world/
├── apps/
│   ├── landing/                 # Astro (SSG) - Landing page
│   │   ├── src/
│   │   │   ├── pages/           # /, /sobre-nosotros, /empresas, /contacto
│   │   │   ├── components/      # Componentes específicos de landing
│   │   │   └── layouts/
│   │   ├── public/
│   │   ├── astro.config.mjs
│   │   └── package.json
│   │
│   └── app/                     # React + Vite - Aplicación principal
│       ├── src/
│       │   ├── core/            # Contextos, configuración, rutas
│       │   ├── features/        # Funcionalidades por dominio
│       │   ├── modules/         # Dashboards por rol
│       │   └── shared/          # Componentes compartidos de la app
│       ├── vite.config.js
│       └── package.json
│
├── packages/
│   ├── ui/                      # Componentes UI compartidos (Shadcn)
│   │   ├── src/
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── shared/                  # Utilidades compartidas
│   │   ├── src/
│   │   │   ├── utils/
│   │   │   ├── constants/
│   │   │   └── types/
│   │   └── package.json
│   │
│   └── config/                  # Configuraciones compartidas
│       ├── tailwind/
│       ├── eslint/
│       └── package.json
│
├── pnpm-workspace.yaml
├── package.json
└── turbo.json                   # Turborepo para builds
```

---

## Parte 2: Plan de Acción por Fases

### Fase 0: Preparación (Pre-requisitos)
**Duración estimada: 1-2 horas**

- [ ] 0.1 Hacer backup del proyecto actual
- [ ] 0.2 Crear branch `feature/arquitectura-v2`
- [ ] 0.3 Instalar pnpm globalmente: `npm install -g pnpm`
- [ ] 0.4 Documentar estado actual de la app (qué funciona, qué no)

### Fase 1: Limpieza del Código Actual
**Duración estimada: 2-3 horas**

Antes de reestructurar, hay que limpiar inconsistencias actuales:

- [ ] 1.1 Eliminar archivos duplicados:
  - `src/pages/EmpresasPage.jsx` (duplicado de `src/pages/landing/EmpresasPage.jsx`)
  - `src/pages/HomePage.jsx` (duplicado de `src/pages/landing/LandingHome.jsx`)

- [ ] 1.2 Consolidar carpeta `components/shared/` en `shared/components/`
  - Mover `src/components/shared/LoginForm.jsx` → `src/features/auth/components/`
  - Mover `src/components/shared/StatCard.jsx` → `src/shared/components/`

- [ ] 1.3 Mover `src/layouts/` a `src/shared/components/layout/` (ya existe parcialmente)

- [ ] 1.4 Mover `src/pages/ProfileSettingsPage.jsx` → `src/features/auth/pages/`
- [ ] 1.5 Mover `src/pages/ContactoPage.jsx` → `src/pages/landing/`

- [ ] 1.6 Verificar que el build funciona después de la limpieza

### Fase 2: Configurar Monorepo Base
**Duración estimada: 2-3 horas**

- [ ] 2.1 Crear estructura de carpetas del monorepo (sin mover código aún)
  ```
  mkdir -p apps/landing apps/app packages/ui packages/shared packages/config
  ```

- [ ] 2.2 Crear `pnpm-workspace.yaml` en la raíz:
  ```yaml
  packages:
    - 'apps/*'
    - 'packages/*'
  ```

- [ ] 2.3 Crear `package.json` raíz con scripts de monorepo

- [ ] 2.4 Instalar Turborepo: `pnpm add -D turbo -w`

- [ ] 2.5 Crear `turbo.json` básico

### Fase 3: Extraer Paquetes Compartidos
**Duración estimada: 3-4 horas**

- [ ] 3.1 Crear `packages/ui/`:
  - Mover todos los componentes de `src/shared/components/ui/`
  - Configurar exports en `package.json`
  - Configurar Tailwind para el paquete

- [ ] 3.2 Crear `packages/shared/`:
  - Extraer `src/lib/utils.js`
  - Extraer constantes compartidas
  - Extraer tipos/interfaces si los hay

- [ ] 3.3 Crear `packages/config/`:
  - Configuración de Tailwind base
  - Configuración de ESLint
  - Configuración de PostCSS

- [ ] 3.4 Verificar que los paquetes se pueden importar correctamente

### Fase 4: Migrar App Principal
**Duración estimada: 2-3 horas**

- [ ] 4.1 Mover contenido de `my-tree-in-the-world-front/` a `apps/app/`
  - Excluir: páginas de landing, archivos que van a packages

- [ ] 4.2 Actualizar imports para usar paquetes:
  ```javascript
  // Antes
  import { Button } from '@shared/components/ui/button';

  // Después
  import { Button } from '@my-tree/ui';
  ```

- [ ] 4.3 Actualizar `vite.config.js` con nuevos aliases

- [ ] 4.4 Actualizar `package.json` con dependencias de workspace:
  ```json
  {
    "dependencies": {
      "@my-tree/ui": "workspace:*",
      "@my-tree/shared": "workspace:*"
    }
  }
  ```

- [ ] 4.5 Verificar que `pnpm dev` funciona en `apps/app/`

### Fase 5: Crear Landing con Astro
**Duración estimada: 4-5 horas**

- [ ] 5.1 Inicializar proyecto Astro en `apps/landing/`:
  ```bash
  cd apps/landing
  pnpm create astro@latest . --template minimal
  pnpm add @astrojs/react @astrojs/tailwind
  ```

- [ ] 5.2 Configurar Astro para usar React y Tailwind

- [ ] 5.3 Migrar páginas de landing:
  - `LandingHome.jsx` → `pages/index.astro`
  - `AboutPage.jsx` → `pages/sobre-nosotros.astro`
  - `EmpresasPage.jsx` → `pages/empresas.astro`
  - `ContactoPage.jsx` → `pages/contacto.astro`

- [ ] 5.4 Crear layout base de Astro con:
  - Meta tags SEO
  - Open Graph
  - Schema.org JSON-LD
  - Sitemap automático

- [ ] 5.5 Configurar botón "Iniciar Sesión" que redirige a `app.tudominio.com/login`

- [ ] 5.6 Optimizar imágenes y assets para performance

- [ ] 5.7 Verificar Lighthouse score > 90 en todas las métricas

### Fase 6: Configurar Deploys
**Duración estimada: 1-2 horas**

- [ ] 6.1 Configurar Vercel para monorepo:
  - Landing: `apps/landing` → `www.miarbolenelmundo.com`
  - App: `apps/app` → `app.miarbolenelmundo.com`

- [ ] 6.2 Configurar variables de entorno por proyecto

- [ ] 6.3 Configurar dominios y redirecciones:
  - `miarbolenelmundo.com` → redirige a `www.miarbolenelmundo.com`
  - `/login` en landing → redirige a `app.miarbolenelmundo.com/login`

- [ ] 6.4 Probar deploys de preview en PRs

### Fase 7: Optimizaciones Finales
**Duración estimada: 2-3 horas**

- [ ] 7.1 Implementar lazy loading por módulo en la app:
  ```javascript
  const AdminDashboard = lazy(() => import('@modules/admin/pages/AdminDashboard'));
  ```

- [ ] 7.2 Configurar code splitting por rol (cada dashboard en su chunk)

- [ ] 7.3 Agregar prefetch de rutas comunes

- [ ] 7.4 Configurar Service Worker para la app (PWA básico)

- [ ] 7.5 Agregar Google Analytics / Plausible para tracking

- [ ] 7.6 Documentar arquitectura final en CLAUDE.md

---

## Parte 3: Archivos de Configuración Clave

### 3.1 pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 3.2 package.json (raíz)
```json
{
  "name": "my-tree-in-the-world",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "dev:landing": "turbo dev --filter=landing",
    "dev:app": "turbo dev --filter=app",
    "build:landing": "turbo build --filter=landing",
    "build:app": "turbo build --filter=app",
    "lint": "turbo lint",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### 3.3 turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".astro/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 3.4 apps/landing/astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.miarbolenelmundo.com',
  integrations: [
    react(),
    tailwind(),
    sitemap()
  ],
  output: 'static', // SSG para mejor performance
  build: {
    inlineStylesheets: 'auto'
  }
});
```

### 3.5 packages/ui/package.json
```json
{
  "name": "@my-tree/ui",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./button": "./src/button.jsx",
    "./card": "./src/card.jsx",
    "./styles.css": "./src/styles.css"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  }
}
```

---

## Parte 4: Consideraciones Importantes

### SEO para Landing (Crítico)

Con Astro, implementaremos:

1. **Meta tags dinámicos** por página
2. **Open Graph** para compartir en redes
3. **Schema.org** para rich snippets en Google
4. **Sitemap.xml** automático
5. **robots.txt** optimizado
6. **Core Web Vitals** optimizados (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Flujo de Usuario

```
Usuario nuevo:
www.miarbolenelmundo.com → Explora landing → Click "Registrarme"
→ app.miarbolenelmundo.com/registro → Completa registro → Dashboard

Usuario existente:
www.miarbolenelmundo.com → Click "Iniciar Sesión"
→ app.miarbolenelmundo.com/login → Dashboard
```

### Comunicación entre Landing y App

- **Shared cookies** para detectar si usuario está logueado
- **Redirect automático** si usuario logueado visita landing
- **Deep linking** para acciones específicas (ej: `/plantar?especie=jacaranda`)

---

## Parte 5: Alternativa Simplificada (Si el monorepo parece mucho)

Si prefieres algo más simple por ahora:

### Opción A-Plus: Mismo Repo, Mejor Organizado

Mantener todo en un repo pero con:

1. **Lazy loading agresivo** por módulo
2. **Prerenderizado de landing** con `vite-plugin-ssr` o `react-snap`
3. **Rutas separadas**: `/` para landing, `/app/*` para la aplicación

```javascript
// App.jsx con lazy loading
const LandingHome = lazy(() => import('./pages/landing/LandingHome'));
const AdminDashboard = lazy(() => import('./modules/admin/pages/AdminDashboard'));
// etc...
```

Esta opción es menos trabajo pero sacrifica SEO óptimo.

---

---

## Parte 6: Ejecución Automática con Claude Code

### Opción 1: Ejecución Fase por Fase (Recomendado)

Ejecutar cada fase manualmente para verificar que todo funciona:

```bash
# En una nueva terminal, ejecutar Claude Code para una fase específica
claude --dangerously-skip-permissions

# Luego pedir:
# "Ejecuta la Fase 1 del plan en docs/PLAN_ARQUITECTURA_FRONTEND.md"
```

### Opción 2: Ejecución Automática Completa

Para ejecutar todo el plan automáticamente (más riesgoso, menos control):

```bash
# Crear archivo de prompt para ejecución automática
# En: my-tree-in-the-world-front/.claude/prompts/ejecutar-plan.md
```

**Contenido del prompt:**
```markdown
Ejecuta el plan de arquitectura frontend siguiendo estas reglas:

1. Lee el archivo docs/PLAN_ARQUITECTURA_FRONTEND.md
2. Ejecuta las fases en orden (0 → 7)
3. Después de cada fase, ejecuta `npm run build` para verificar
4. Si el build falla, corrige los errores antes de continuar
5. Haz commit después de cada fase completada exitosamente
6. Si hay un error crítico que no puedes resolver, detente y reporta

Comienza con la Fase 0 y continúa hasta completar todas las fases.
```

**Ejecutar:**
```bash
cd my-tree-in-the-world-front
claude --dangerously-skip-permissions -p "$(cat .claude/prompts/ejecutar-plan.md)"
```

### Opción 3: Script de Ejecución por Fases

Crear un script que ejecute fase por fase con confirmación:

```bash
# Archivo: scripts/ejecutar-fase.sh

#!/bin/bash
FASE=$1

if [ -z "$FASE" ]; then
  echo "Uso: ./scripts/ejecutar-fase.sh <numero_fase>"
  echo "Ejemplo: ./scripts/ejecutar-fase.sh 1"
  exit 1
fi

echo "Ejecutando Fase $FASE..."
claude --dangerously-skip-permissions -p "Ejecuta SOLO la Fase $FASE del plan en docs/PLAN_ARQUITECTURA_FRONTEND.md. Después de completar, ejecuta 'npm run build' para verificar. Si hay errores, corrígelos. Haz commit con mensaje 'feat: completar fase $FASE de arquitectura'"
```

**Uso:**
```bash
chmod +x scripts/ejecutar-fase.sh
./scripts/ejecutar-fase.sh 1  # Ejecuta solo Fase 1
./scripts/ejecutar-fase.sh 2  # Después de verificar, ejecuta Fase 2
# etc...
```

### Comandos Útiles Durante la Ejecución

```bash
# Ver progreso del build
npm run build

# Ver errores de TypeScript/ESLint
npm run lint

# Verificar que la app funciona
npm run dev

# Ver cambios realizados
git status
git diff

# Revertir si algo sale mal
git checkout .
git clean -fd
```

### Checkpoints de Verificación

Después de cada fase, verificar:

| Fase | Verificación |
|------|--------------|
| 0 | Branch creado, pnpm instalado |
| 1 | `npm run build` exitoso, sin archivos duplicados |
| 2 | Estructura de carpetas creada, `pnpm install` funciona |
| 3 | Packages importables, `pnpm build` en packages funciona |
| 4 | `pnpm dev --filter=app` funciona |
| 5 | `pnpm dev --filter=landing` funciona, Lighthouse > 90 |
| 6 | Deploy preview funciona en Vercel |
| 7 | Lazy loading activo, bundle sizes optimizados |

---

## Próximos Pasos

1. **Lee este documento completo**
2. **Decide qué opción prefieres** (Monorepo vs. Simplificada)
3. **Elige método de ejecución** (Manual, Por fases, o Automático)
4. **Avísame qué fase quieres comenzar**
5. **Trabajamos fase por fase**, verificando que todo funciona

### Comando para Empezar

```bash
# Opción recomendada: ejecutar fase por fase con supervisión
claude --dangerously-skip-permissions
# Luego: "Ejecuta la Fase 0 del plan de arquitectura"
```

¿Listo para comenzar?
