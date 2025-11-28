# 📋 MI ÁRBOL EN EL MUNDO

## ¿Qué es?
Es una **plataforma web interactiva** que permite a las personas plantar árboles virtuales y contribuir a la conservación del medio ambiente. Es como un juego serio donde cada usuario puede plantar su propio árbol digital y ver su impacto en un mapa mundial.

## ¿Para quién es?
El sistema tiene **5 tipos de usuarios diferentes**:

1. **👤 Usuarios comunes**: Personas que quieren plantar sus árboles virtuales
2. **🏢 Empresas**: Compañías que quieren calcular y compensar su huella de carbono
3. **👨‍💼 Administradores**: Personas que gestionan todo el sistema
4. **🌱 Viveros**: Encargados de preparar los árboles físicos
5. **🌳 Plantadores**: Personas que plantan los árboles reales en el campo

## ¿Qué puedes hacer?

### Como Usuario Común:
- Plantar tu árbol virtual con un nombre personalizado
- Ver tu árbol en un mapa interactivo mundial
- Obtener un certificado digital de tu árbol
- Seguir el crecimiento y estado de tus árboles

### Como Empresa:
- Calcular la huella de carbono de tu compañía
- Compensar emisiones plantando árboles corporativos
- Gestionar los árboles de la empresa
- Ver estadísticas y reportes ambientales

### Como Administrador:
- Controlar todo el sistema
- Gestionar usuarios, empresas y árboles
- Ver auditorías y estadísticas globales
- Supervisar el proceso completo

### Como Vivero/Plantador:
- Gestionar el proceso de plantación física de árboles reales
- Actualizar el estado de los árboles
- Coordinar la logística de plantación

## 🚀 Cómo Empezar

### Requisitos Previos
- Node.js instalado en tu computadora
- Un navegador web moderno

### Instalación
```bash
# 1. Instalar las dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# Normalmente en: http://localhost:5173
```

### Construir para Producción
```bash
npm run build
```

## 🔐 Usuarios de Prueba

Para probar el sistema, puedes usar las siguientes credenciales:

### Administrador
- **Email**: `administrador@miarbol.com`
- **Contraseña**: `admin123`
- **URL**: `/admin/dashboard`

### Empresa
- **Email**: `empresa@miarbol.com`
- **Contraseña**: `Password123!`
- **URL**: `/empresa/dashboard`

### Plantador
- **Email**: `plantador@miarbol.com`
- **Contraseña**: `admin123`
- **URL**: `/plantador/dashboard`

### Vivero
- **Email**: `vivero@miarbol.com`
- **Contraseña**: `admin123`
- **URL**: `/vivero/dashboard`

> **Nota**: Más usuarios de prueba disponibles en el archivo `USUARIOS_PRUEBA.md`

## 🛠️ Tecnologías Utilizadas

- **React 18**: Librería para construir la interfaz de usuario
- **React Router**: Navegación entre páginas
- **Tailwind CSS**: Estilos y diseño moderno
- **Leaflet**: Mapas interactivos para visualizar árboles
- **Framer Motion**: Animaciones fluidas
- **Radix UI**: Componentes de interfaz accesibles
- **Vite**: Herramienta de desarrollo rápida

## 📁 Estructura del Proyecto

```
miarbol2/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── contexts/       # Gestión de estado global
│   ├── lib/            # Utilidades y configuración
│   └── utils/          # Funciones auxiliares
├── public/             # Archivos estáticos
└── plugins/            # Plugins personalizados
```

## 🌍 Funcionalidades Principales

1. **Mapa Interactivo Global**: Visualiza todos los árboles plantados en el mundo
2. **Certificados Digitales**: Cada árbol tiene su certificado único descargable
3. **Calculadora de Huella de Carbono**: Para empresas que quieren medir su impacto
4. **Panel Multi-Rol**: Diferentes dashboards según el tipo de usuario
5. **Gestión de Árboles**: Sistema completo de seguimiento desde vivero hasta plantación

## 📝 Estado del Proyecto

- **Versión**: 0.0.0 (Desarrollo)
- **Base de Datos**: Actualmente usa datos hardcodeados
- **Próximos Pasos**: Migración a MySQL para datos persistentes
- **Seguridad**: Las credenciales de prueba deben ser reemplazadas en producción

## 🤝 Contribuir

Este es un proyecto de conservación ambiental. Si quieres contribuir:
1. Revisa el código
2. Identifica mejoras
3. Crea una rama para tus cambios
4. Envía tus propuestas

## 📧 Contacto

Para más información sobre el proyecto, consulta la página de contacto dentro de la aplicación.

---

**Hecho con ❤️ para ayudar al planeta**
