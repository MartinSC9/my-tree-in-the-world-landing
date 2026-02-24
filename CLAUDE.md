# CLAUDE.md - Mi Arbol en el Mundo Landing Page

## Proyecto
Landing page institucional para la plataforma de plantacion de arboles "Mi Arbol en el Mundo". Pagina publica de presentacion, no requiere autenticacion.

## Comandos
```bash
npm install && npm run dev    # Dev server
npm run build                 # Build produccion
npm run preview               # Preview build
```

## Stack
React 18 + Vite + Tailwind CSS

## Estructura
Landing page simple, sin roles ni autenticacion. Secciones:
- Hero / Banner principal
- Como funciona (flujo de plantacion)
- Beneficios / Impacto ambiental
- Planes / Precios
- Testimonios
- FAQ
- CTA / Registro
- Footer

## Despliegue
Vercel (produccion). Ver `docs/setup/deploy-manual.md` en el frontend.

## Notas
- Esta es una app independiente, NO comparte codigo con el frontend principal
- No tiene backend propio, es estatica
- Para info de negocio/precios consultar: `../my-tree-in-the-world-front/docs/business/`
