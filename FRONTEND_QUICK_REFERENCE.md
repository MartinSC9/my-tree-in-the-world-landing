# ⚡ Frontend Quick Reference - My Tree In The World

> **Consulta rápida**: Lee este archivo ANTES de trabajar en el frontend

## 🎯 Búsqueda Rápida por Keyword

| Busco... | Ubicación | Archivo clave |
|----------|-----------|---------------|
| Login / Auth | `features/auth/` | `authService.js`, `UniversalLoginPage.jsx` |
| Árboles | `features/trees/` | `treeService.js`, `TreeCard.jsx` |
| Árboles colaborativos | `features/collaborative-trees/` | `collaborativeTreeService.js` |
| Certificados | `features/certificates/` | `CertificatePDF.jsx` |
| Catálogo de árboles | `features/available-trees/` | `AvailableTreesPage.jsx` |
| Dashboard Usuario | `modules/user/` | `UserDashboard.jsx` (⚠️ 130KB) |
| Dashboard Empresa | `modules/company/` | `CompanyDashboard.jsx` |
| Dashboard Admin | `modules/admin/` | `AdminDashboard.jsx` |
| Dashboard Plantador | `modules/plantador/` | `PlantadorDashboard.jsx` |
| Dashboard Vivero | `modules/vivero/` | `ViveroDashboard.jsx` |
| Dashboard Cadete | `modules/cadete/` | `CadeteDashboard.jsx` |
| Botones/Inputs/UI | `shared/components/ui/` | shadcn components |
| Navbar/Footer | `shared/components/layout/` | `Navbar.jsx`, `Footer.jsx` |
| Sidebar | `shared/components/navigation/` | `Sidebar.jsx` |
| Hooks compartidos | `shared/hooks/` | `useToast.js`, `useDebounce.js` |
| Utils | `shared/utils/` | formatters, validators, constants |
| AuthContext | `core/contexts/` | `AuthContext.jsx` |
| Rutas | `core/routes/` | `AppRoutes.jsx` |
| API Config | `core/config/` | `apiConfig.js` |

---

## 📁 Estructura Simplificada

```
src/
├── features/               # Funcionalidades completas
│   ├── auth/              → Login, registro
│   ├── trees/             → Árboles normales
│   ├── collaborative-trees/ → Árboles colaborativos
│   ├── available-trees/   → Catálogo
│   └── certificates/      → Certificados
│
├── modules/               # Dashboards por rol
│   ├── user/             → Usuario regular
│   ├── company/          → Empresa
│   ├── admin/            → Administrador
│   ├── plantador/        → Plantador
│   ├── vivero/           → Vivero
│   └── cadete/           → Cadete
│
├── shared/               # Componentes compartidos
│   ├── components/
│   │   ├── ui/          → Botones, inputs, cards (shadcn)
│   │   ├── layout/      → Navbar, Footer
│   │   ├── navigation/  → Sidebar, BottomNav
│   │   └── feedback/    → Loading, Toast
│   ├── hooks/           → useToast, useDebounce
│   ├── services/        → userService, notificationService
│   └── utils/           → formatters, validators
│
└── core/                 # Núcleo
    ├── contexts/        → AuthContext, TreeContext
    ├── routes/          → AppRoutes, ProtectedRoute
    └── config/          → apiConfig, appConfig
```

---

## 🔗 Alias de Imports

```javascript
'@'         → './src'
'@features' → './src/features'
'@modules'  → './src/modules'
'@shared'   → './src/shared'
'@core'     → './src/core'
```

### Ejemplos

```javascript
import { TreeCard } from '@features/trees/components'
import { Button } from '@shared/components/ui'
import { AuthContext } from '@core/contexts'
```

---

## 🎯 Reglas de Decisión

```
¿Qué tipo de código es?

┌─ Funcionalidad completa (ej: collaborative-trees)
│  → features/
│
┌─ Dashboard específico de rol (ej: admin, company)
│  → modules/[rol]/
│
┌─ Componente UI reutilizable (Button, Card)
│  → shared/components/ui/
│
┌─ Layout (Navbar, Footer)
│  → shared/components/layout/
│
┌─ Hook reutilizable (useToast, useDebounce)
│  → shared/hooks/
│
┌─ Servicio compartido (user, posts, notifications)
│  → shared/services/
│
└─ Contexto global, rutas, config
   → core/
```

---

## 🔍 Servicios API por Ubicación

```
features/auth/services/authService.js
features/trees/services/treeService.js
features/collaborative-trees/services/collaborativeTreeService.js
features/available-trees/services/availableTreeService.js
features/certificates/services/certificateService.js

modules/company/services/carbonService.js
modules/admin/services/workOrderService.js
modules/plantador/services/plantadorService.js
modules/vivero/services/viveroService.js
modules/cadete/services/cadeteService.js

shared/services/userService.js
shared/services/postService.js
shared/services/notificationService.js
```

---

## ⚠️ Notas Importantes

- **UserDashboard.jsx**: 130KB - Archivo muy grande, considerar componentes separados
- **shadcn/ui**: Los componentes UI están en `shared/components/ui/`
- **Contextos**: AuthContext está en `core/contexts/`
- **Rutas protegidas**: Ver `core/routes/ProtectedRoute.jsx`

---

## 📖 Guía Completa

Para más detalles, consulta: `GUIA_ESTRUCTURA_FRONTEND.md`

---

**Última actualización**: 2025-10-30
