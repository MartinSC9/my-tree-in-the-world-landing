# 🚀 Próximos Pasos - My Tree in the World

Documentación de mejoras y funcionalidades futuras para el sistema de catálogo de árboles disponibles.

---

## 📋 Tabla de Contenidos

1. [Gestión de Catálogo para Viveros](#1-gestión-de-catálogo-para-viveros)
2. [Sistema de Pagos](#2-sistema-de-pagos)
3. [Sistema de Notificaciones Mejorado](#3-sistema-de-notificaciones-mejorado)
4. [Wishlist y Favoritos](#4-wishlist-y-favoritos)
5. [Sistema de Reviews y Ratings](#5-sistema-de-reviews-y-ratings)
6. [Mejoras de UX](#6-mejoras-de-ux)
7. [Analytics y Reportes](#7-analytics-y-reportes)
8. [Funcionalidades Avanzadas](#8-funcionalidades-avanzadas)

---

## 1. Gestión de Catálogo para Viveros

### Objetivo
Permitir que los viveros administren su propio catálogo de árboles disponibles desde su dashboard.

### Funcionalidades

#### 1.1 Panel de Catálogo (Vivero Dashboard)
```
Ubicación: /vivero/catalogo
```

**Características:**
- Lista completa de árboles del vivero
- Filtros por especie, stock, estado activo/inactivo
- Acciones rápidas: Editar, Activar/Desactivar, Ver detalles

**Vista de tabla:**
| Foto | Nombre | Especie | Precio | Stock | Estado | Acciones |
|------|--------|---------|--------|-------|--------|----------|
| 🌳   | Ceibo  | Ceibo   | $25    | 50    | Activo | ⚙️ |

#### 1.2 Formulario de Crear/Editar Árbol
```
Ubicación: /vivero/catalogo/nuevo
           /vivero/catalogo/editar/:id
```

**Campos:**
- Información básica:
  - Nombre común *
  - Nombre científico
  - Especie *
  - Descripción *

- Información comercial:
  - Precio (USD) *
  - Stock inicial *
  - Ubicación del vivero
  - Coordenadas GPS (auto-detectar)

- Multimedia:
  - Subir imagen (hasta 5 fotos)
  - Galería de imágenes

- Estado:
  - Activo/Inactivo
  - Destacado (aparece primero en catálogo)

**Validaciones:**
- Precio > 0
- Stock >= 0
- Al menos 1 imagen
- Nombre único por vivero

#### 1.3 Gestión de Stock

**Auto-actualización:**
- Decrementar automáticamente al venderse
- Notificar cuando stock < 10
- Deshabilitar automáticamente cuando stock = 0

**Acciones manuales:**
- Ajustar stock
- Historial de movimientos de stock
- Reabastecimiento masivo

**Dashboard de stock:**
```
┌─────────────────────────────────┐
│ Resumen de Inventario           │
├─────────────────────────────────┤
│ 📦 Total árboles: 15            │
│ ✅ En stock: 12                 │
│ ⚠️  Stock bajo (<10): 3         │
│ ❌ Agotados: 0                  │
└─────────────────────────────────┘
```

### Implementación Backend

**Nuevos endpoints:**
```javascript
// Vivero-specific routes
GET    /api/vivero/my-trees        // Mis árboles
POST   /api/vivero/trees           // Crear árbol
PUT    /api/vivero/trees/:id       // Actualizar árbol
DELETE /api/vivero/trees/:id       // Soft delete
PATCH  /api/vivero/trees/:id/stock // Ajustar stock
GET    /api/vivero/stats           // Estadísticas de ventas
```

**Controlador:** `src/controllers/viveroController.js`

### Implementación Frontend

**Componentes nuevos:**
- `ViveroTreeList.jsx` - Lista de árboles del vivero
- `ViveroTreeForm.jsx` - Formulario crear/editar
- `StockManager.jsx` - Gestión de inventario
- `ImageUploader.jsx` - Subir múltiples imágenes

**Páginas nuevas:**
- `pages/vivero/CatalogoPage.jsx`
- `pages/vivero/NuevoArbolPage.jsx`
- `pages/vivero/EditarArbolPage.jsx`

---

## 2. Sistema de Pagos

### Objetivo
Integrar procesamiento de pagos real para compras de árboles del catálogo.

### Opciones de Integración

#### 2.1 MercadoPago (Recomendado para LATAM)

**Por qué MercadoPago:**
- ✅ Popular en Argentina y LATAM
- ✅ Acepta tarjetas locales
- ✅ Múltiples métodos de pago
- ✅ SDK bien documentado

**Flujo de pago:**
```
Usuario selecciona árbol
    ↓
Crea preferencia de pago (backend)
    ↓
Redirige a MercadoPago Checkout
    ↓
Usuario paga
    ↓
Webhook notifica al backend
    ↓
Backend actualiza payment_status
    ↓
Crea árbol + orden de trabajo
```

**Implementación Backend:**

```javascript
// src/config/mercadopago.js
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// src/controllers/paymentController.js
exports.createPreference = async (req, res) => {
  const { available_tree_id, name, latitude, longitude } = req.body;

  // Get tree details
  const tree = await getAvailableTreeById(available_tree_id);

  const preference = {
    items: [{
      title: tree.name,
      unit_price: tree.price,
      quantity: 1,
    }],
    back_urls: {
      success: `${FRONTEND_URL}/pago/exito`,
      failure: `${FRONTEND_URL}/pago/fallo`,
      pending: `${FRONTEND_URL}/pago/pendiente`
    },
    auto_return: 'approved',
    external_reference: JSON.stringify({
      user_id: req.user.id,
      available_tree_id,
      name,
      latitude,
      longitude
    })
  };

  const response = await mercadopago.preferences.create(preference);
  res.json({ init_point: response.body.init_point });
};

// Webhook handler
exports.webhook = async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    const payment = await mercadopago.payment.get(data.id);

    if (payment.body.status === 'approved') {
      const { user_id, available_tree_id, name, latitude, longitude } =
        JSON.parse(payment.body.external_reference);

      // Create tree
      await createTreeFromPayment({
        user_id,
        available_tree_id,
        name,
        latitude,
        longitude,
        payment_id: data.id,
        payment_amount: payment.body.transaction_amount
      });
    }
  }

  res.sendStatus(200);
};
```

**Nuevas rutas:**
```javascript
POST   /api/payments/create-preference
POST   /api/payments/webhook
GET    /api/payments/:id/status
```

**Tabla nueva en BD:**
```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  tree_id INT,
  payment_provider VARCHAR(50) NOT NULL, -- 'mercadopago', 'stripe'
  payment_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'approved', 'rejected', 'refunded') NOT NULL,
  payment_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tree_id) REFERENCES trees(id)
);
```

#### 2.2 Stripe (Alternativa Internacional)

**Por qué Stripe:**
- ✅ Líder mundial en pagos
- ✅ Excelente documentación
- ✅ Soporte para suscripciones
- ✅ Checkout embebido

**Similar implementación pero usando Stripe SDK**

### Implementación Frontend

**Nuevos componentes:**
- `CheckoutButton.jsx` - Botón de pago
- `PaymentSuccess.jsx` - Página de éxito
- `PaymentPending.jsx` - Página pendiente
- `PaymentError.jsx` - Página de error

**Flujo en AvailableTreeDetailPage:**
```javascript
const handlePurchase = async () => {
  // Crear preferencia de pago
  const { init_point } = await paymentService.createPreference({
    available_tree_id: tree.id,
    name: treeName,
    latitude: location.lat,
    longitude: location.lng
  });

  // Redirigir a MercadoPago
  window.location.href = init_point;
};
```

### Variables de entorno necesarias

```env
# .env backend
MERCADOPAGO_ACCESS_TOKEN=your_access_token
MERCADOPAGO_PUBLIC_KEY=your_public_key
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret
```

---

## 3. Sistema de Notificaciones Mejorado

### Objetivo
Notificar a viveros, usuarios y admins sobre eventos del catálogo.

### Nuevos Tipos de Notificaciones

#### 3.1 Para Viveros
```javascript
// Cuando se vende un árbol de su catálogo
{
  type: 'tree_sold',
  title: '¡Venta realizada!',
  message: 'Juan Pérez compró un Ceibo por $25 USD',
  data: {
    tree_id: 5,
    buyer_name: 'Juan Pérez',
    amount: 25
  }
}

// Cuando stock está bajo
{
  type: 'low_stock',
  title: 'Stock bajo',
  message: 'El stock de "Ceibo Argentino" está bajo (5 unidades)',
  data: {
    available_tree_id: 1,
    current_stock: 5
  }
}

// Cuando un árbol se agota
{
  type: 'out_of_stock',
  title: 'Producto agotado',
  message: 'El "Lapacho Rosado" se ha agotado',
  data: {
    available_tree_id: 7
  }
}
```

#### 3.2 Para Usuarios
```javascript
// Confirmación de compra
{
  type: 'purchase_confirmed',
  title: '¡Compra exitosa!',
  message: 'Tu árbol "Ceibo de la Familia" ha sido comprado exitosamente',
  data: {
    tree_id: 42,
    tree_name: 'Ceibo de la Familia'
  }
}

// Cuando el vivero prepara el árbol
{
  type: 'tree_preparing',
  title: 'Preparando tu árbol',
  message: 'El vivero está preparando tu Ceibo para plantación',
  data: {
    tree_id: 42,
    nursery_name: 'Vivero Central'
  }
}
```

#### 3.3 Para Admins
```javascript
// Nueva orden de catálogo para autorizar
{
  type: 'catalog_order',
  title: 'Nueva orden del catálogo',
  message: 'Orden #123 requiere autorización (Ceibo - Vivero Central)',
  data: {
    work_order_id: 123,
    tree_species: 'Ceibo',
    nursery_name: 'Vivero Central'
  }
}
```

### Implementación

**Backend - Función helper:**
```javascript
// src/utils/notifications.js
async function notifyTreePurchase(tree, user, nursery) {
  // Notificar al usuario
  await createNotification(user.id, {
    type: 'purchase_confirmed',
    title: '¡Compra exitosa!',
    message: `Tu árbol "${tree.name}" ha sido comprado exitosamente`
  });

  // Notificar al vivero
  await createNotification(nursery.id, {
    type: 'tree_sold',
    title: '¡Venta realizada!',
    message: `${user.username} compró un ${tree.species} por $${tree.price}`
  });

  // Notificar a admins
  const admins = await getAdminUsers();
  for (const admin of admins) {
    await createNotification(admin.id, {
      type: 'catalog_order',
      title: 'Nueva orden del catálogo',
      message: `Orden requiere autorización (${tree.species} - ${nursery.username})`
    });
  }
}
```

### Notificaciones en Tiempo Real

**Opción 1: Server-Sent Events (SSE)**
```javascript
// Backend
app.get('/api/notifications/stream', auth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Guardar conexión
  connections.set(req.user.id, res);

  req.on('close', () => {
    connections.delete(req.user.id);
  });
});

// Frontend
const eventSource = new EventSource('/api/notifications/stream');
eventSource.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  showToast(notification.message);
};
```

**Opción 2: Socket.io**
```javascript
// Backend
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  socket.join(`user-${userId}`);
});

// Emitir notificación
io.to(`user-${userId}`).emit('notification', notification);

// Frontend
socket.on('notification', (notification) => {
  showToast(notification.message);
});
```

---

## 4. Wishlist y Favoritos

### Objetivo
Permitir a usuarios guardar árboles favoritos para comprar después.

### Funcionalidades

#### 4.1 Agregar a Favoritos
- Botón ❤️ en AvailableTreeCard
- Botón ❤️ en AvailableTreeDetailPage
- Toggle visual (corazón lleno/vacío)

#### 4.2 Página de Favoritos
```
Ubicación: /usuario/:userId/favoritos
```

**Vista:**
- Grid de árboles favoritos
- Botón "Comprar ahora"
- Botón "Quitar de favoritos"
- Indicador si el árbol está agotado

### Implementación

**Tabla nueva:**
```sql
CREATE TABLE user_favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  available_tree_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (available_tree_id) REFERENCES available_trees(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, available_tree_id)
);
```

**Endpoints:**
```javascript
POST   /api/favorites              // Agregar favorito
DELETE /api/favorites/:id          // Quitar favorito
GET    /api/favorites              // Mis favoritos
GET    /api/favorites/check/:treeId // Verificar si es favorito
```

**Frontend - Hook personalizado:**
```javascript
// hooks/useFavorites.js
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = async (treeId) => {
    await favoriteService.add(treeId);
    setFavorites([...favorites, treeId]);
    toast.success('Agregado a favoritos');
  };

  const removeFavorite = async (treeId) => {
    await favoriteService.remove(treeId);
    setFavorites(favorites.filter(id => id !== treeId));
    toast.success('Removido de favoritos');
  };

  const isFavorite = (treeId) => favorites.includes(treeId);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
```

---

## 5. Sistema de Reviews y Ratings

### Objetivo
Permitir a usuarios calificar árboles comprados y viveros.

### Funcionalidades

#### 5.1 Calificar Árbol Comprado

**Cuándo:** Después de que el árbol es plantado (status = 'plantado')

**Formulario:**
- Calificación de especie (1-5 ⭐)
- Calificación del vivero (1-5 ⭐)
- Comentario opcional
- Fotos opcionales (progreso del árbol)

**Ubicación:** Modal en "Mis Árboles"

#### 5.2 Ver Reviews en Catálogo

**En AvailableTreeDetailPage:**
```
┌─────────────────────────────────────┐
│ ⭐⭐⭐⭐⭐ 4.8/5 (24 opiniones)      │
├─────────────────────────────────────┤
│ María G.        ⭐⭐⭐⭐⭐           │
│ "Excelente calidad, llegó perfecto" │
│ 📷📷                                │
│ Hace 2 días                          │
├─────────────────────────────────────┤
│ Juan P.         ⭐⭐⭐⭐             │
│ "Muy bueno, recomendado"            │
│ Hace 1 semana                        │
└─────────────────────────────────────┘
```

### Implementación

**Tablas nuevas:**
```sql
-- Reviews de árboles comprados
CREATE TABLE tree_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tree_id INT NOT NULL,
  user_id INT NOT NULL,
  available_tree_id INT NOT NULL,
  species_rating INT NOT NULL CHECK (species_rating BETWEEN 1 AND 5),
  nursery_rating INT NOT NULL CHECK (nursery_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tree_id) REFERENCES trees(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (available_tree_id) REFERENCES available_trees(id),
  UNIQUE KEY unique_review (tree_id, user_id)
);

-- Fotos de reviews
CREATE TABLE review_photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_id INT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES tree_reviews(id) ON DELETE CASCADE
);
```

**Endpoints:**
```javascript
POST   /api/reviews                   // Crear review
GET    /api/reviews/tree/:treeId      // Reviews de un árbol
GET    /api/reviews/available/:id     // Reviews de available_tree
PUT    /api/reviews/:id                // Actualizar review
DELETE /api/reviews/:id                // Eliminar review
```

**Calcular rating promedio:**
```javascript
// Agregar campo a available_trees
ALTER TABLE available_trees ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE available_trees ADD COLUMN total_reviews INT DEFAULT 0;

// Actualizar al crear review
async function updateAverageRating(availableTreeId) {
  const [result] = await db.query(`
    SELECT
      AVG(species_rating) as avg_rating,
      COUNT(*) as total
    FROM tree_reviews
    WHERE available_tree_id = ?
  `, [availableTreeId]);

  await db.query(`
    UPDATE available_trees
    SET average_rating = ?, total_reviews = ?
    WHERE id = ?
  `, [result.avg_rating, result.total, availableTreeId]);
}
```

---

## 6. Mejoras de UX

### 6.1 Comparador de Árboles

**Funcionalidad:**
- Seleccionar hasta 3 árboles
- Comparar lado a lado:
  - Precio
  - Especie
  - Características
  - Rating
  - Stock disponible

**Ubicación:** `/catalogo/comparar`

**UI:**
```
┌──────────────┬──────────────┬──────────────┐
│ Ceibo        │ Jacarandá    │ Lapacho      │
│ 🌳           │ 🌳           │ 🌳           │
├──────────────┼──────────────┼──────────────┤
│ $25 USD      │ $30 USD      │ $50 USD      │
│ ⭐ 4.8/5     │ ⭐ 4.5/5     │ ⭐ 5.0/5     │
│ Stock: 50    │ Stock: 75    │ Stock: 45    │
│              │              │              │
│ [Comprar]    │ [Comprar]    │ [Comprar]    │
└──────────────┴──────────────┴──────────────┘
```

### 6.2 Vista Rápida (Quick View)

**Funcionalidad:**
- Modal que se abre desde el card
- Ver detalles sin salir del catálogo
- Agregar a favoritos
- Comprar directamente

### 6.3 Recomendaciones

**"Árboles similares"** en detalle:
- Misma especie
- Rango de precio similar
- Del mismo vivero

**"Usuarios también compraron":**
- Basado en historial de compras
- Machine learning básico

### 6.4 Filtros Avanzados

**Agregar filtros:**
- Por rating (⭐ 4+ estrellas)
- Por vivero específico
- Por ubicación (cercanía)
- Por temporada de plantación
- Árboles destacados/promocionados

### 6.5 Vista de Galería

**Múltiples vistas del catálogo:**
- Grid (actual)
- Lista detallada
- Mapa interactivo (árboles por ubicación de vivero)

---

## 7. Analytics y Reportes

### Objetivo
Proporcionar métricas de ventas y popularidad.

### 7.1 Dashboard de Vivero - Analytics

**Métricas a mostrar:**

**Ventas:**
- Total vendido (USD) - Hoy, Semana, Mes, Año
- Cantidad de árboles vendidos
- Ticket promedio
- Gráfico de ventas (Line chart)

**Productos:**
- Árbol más vendido
- Árbol mejor calificado
- Árboles con bajo stock
- Productos más vistos

**Clientes:**
- Total de clientes únicos
- Clientes recurrentes
- Rating promedio del vivero

**Ejemplo de vista:**
```
┌────────────────────────────────────────┐
│ 📊 Resumen del Mes                     │
├────────────────────────────────────────┤
│ 💰 $1,250 USD en ventas                │
│ 🌳 42 árboles vendidos                 │
│ ⭐ 4.7/5 rating promedio               │
│ 👥 28 clientes únicos                  │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🏆 Top 3 Árboles                       │
├────────────────────────────────────────┤
│ 1. Ceibo Argentino - 12 ventas        │
│ 2. Jacarandá - 9 ventas               │
│ 3. Lapacho Rosado - 8 ventas          │
└────────────────────────────────────────┘
```

### 7.2 Tabla de Analytics

```sql
CREATE TABLE analytics_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'favorite', 'purchase'
  available_tree_id INT,
  user_id INT,
  session_id VARCHAR(100),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_type (event_type),
  INDEX idx_tree (available_tree_id),
  INDEX idx_created (created_at)
);
```

**Eventos a trackear:**
- `tree_view` - Usuario vio el árbol
- `tree_detail_view` - Usuario entró al detalle
- `tree_favorite` - Usuario agregó a favoritos
- `tree_purchase_started` - Usuario empezó compra
- `tree_purchase_completed` - Compra exitosa

### 7.3 Reportes Exportables

**Para viveros:**
- PDF de ventas mensuales
- CSV de transacciones
- Reporte de impuestos

---

## 8. Funcionalidades Avanzadas

### 8.1 Plantar Árbol en Casa

#### Objetivo
Permitir a los usuarios plantar árboles en su propia casa/propiedad, guardando la ubicación personal de forma privada.

#### Funcionalidades

**8.1.1 Opción de Ubicación al Comprar**

En `AvailableTreeDetailPage` y `PlantTreePage`, agregar selector:

```
┌─────────────────────────────────────┐
│ ¿Dónde quieres plantar tu árbol?    │
├─────────────────────────────────────┤
│ ○ En ubicación pública              │
│   (Visible en el mapa global)       │
│                                      │
│ ● En mi casa/propiedad 🏠           │
│   (Ubicación privada)               │
└─────────────────────────────────────┘
```

**8.1.2 Tipos de Ubicación**

**Ubicación Pública:**
- Aparece en mapa global
- Otros usuarios pueden ver
- Para proyectos comunitarios
- Bosques, parques, áreas públicas

**Ubicación Privada (Casa):**
- No aparece en mapa público
- Solo visible para el dueño
- Para jardín, patio, terreno personal
- Coordenadas encriptadas

**8.1.3 Ingresar Dirección de Casa**

**Opción 1: Auto-detectar ubicación**
```javascript
// Frontend
const getUserLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setHomeLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
    },
    (error) => {
      // Fallback to manual input
      setUseManualLocation(true);
    }
  );
};
```

**Opción 2: Ingresar dirección manualmente**
```
┌─────────────────────────────────────┐
│ Dirección de tu casa                │
├─────────────────────────────────────┤
│ Calle: [_______________]            │
│ Número: [____]  Piso: [__]          │
│ Ciudad: [_______________]           │
│ Provincia: [_______________]        │
│ País: [_______________]             │
│ Código Postal: [______]             │
│                                      │
│ [📍 Usar mi ubicación actual]       │
└─────────────────────────────────────┘
```

**Opción 3: Click en mapa (más preciso)**
```
┌─────────────────────────────────────┐
│ Haz click en el mapa donde quieres  │
│ plantar el árbol                     │
├─────────────────────────────────────┤
│ [    Mapa Interactivo    ]          │
│                                      │
│ 📍 Tu ubicación seleccionada:       │
│ Lat: -34.603722                     │
│ Lng: -58.381592                     │
│                                      │
│ [✓ Confirmar ubicación]             │
└─────────────────────────────────────┘
```

**8.1.4 Implementación Backend**

**Modificar tabla `trees`:**
```sql
ALTER TABLE trees ADD COLUMN location_type
  ENUM('public', 'private_home', 'private_property')
  DEFAULT 'public' AFTER longitude;

ALTER TABLE trees ADD COLUMN address TEXT
  COMMENT 'Dirección completa (solo para ubicaciones privadas)';

ALTER TABLE trees ADD COLUMN is_public_location BOOLEAN
  DEFAULT TRUE
  COMMENT 'Si FALSE, no mostrar en mapa público';
```

**Controlador actualizado:**
```javascript
// src/controllers/treeController.js
exports.createTree = async (req, res) => {
  const {
    name,
    available_tree_id,
    latitude,
    longitude,
    location_type, // 'public' | 'private_home'
    address,       // Dirección si es casa
    message
  } = req.body;

  // Validar ubicación
  if (!latitude || !longitude) {
    return res.status(400).json({
      error: 'Se requiere ubicación para plantar el árbol'
    });
  }

  // Si es ubicación privada, validar dirección
  if (location_type === 'private_home' && !address) {
    return res.status(400).json({
      error: 'Se requiere dirección para árboles en casa'
    });
  }

  // Crear árbol
  const [result] = await db.query(`
    INSERT INTO trees (
      user_id, available_tree_id, nursery_id, name, species,
      latitude, longitude, location_type, address,
      is_public_location, message, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sin_plantar')
  `, [
    user_id,
    available_tree_id,
    nursery_id,
    name,
    species,
    latitude,
    longitude,
    location_type || 'public',
    location_type === 'private_home' ? address : null,
    location_type === 'public', // Solo público si location_type es 'public'
    message
  ]);

  // ... resto del código
};
```

**8.1.5 Frontend - Componente HomeLocationPicker**

```javascript
// components/HomeLocationPicker.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import TreeMap from './TreeMap';

const HomeLocationPicker = ({ onLocationSelect }) => {
  const [locationType, setLocationType] = useState('public');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    number: '',
    floor: '',
    city: '',
    province: '',
    country: 'Argentina',
    zipCode: ''
  });

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(newLocation);
        onLocationSelect({
          ...newLocation,
          locationType,
          address: locationType === 'private_home' ? address : null
        });
      },
      (error) => {
        toast.error('No se pudo obtener tu ubicación');
      }
    );
  };

  const handleMapClick = (lat, lng) => {
    setLocation({ lat, lng });
  };

  const handleConfirm = () => {
    if (!location) {
      toast.error('Por favor selecciona una ubicación');
      return;
    }

    if (locationType === 'private_home') {
      // Validar dirección
      if (!address.street || !address.city) {
        toast.error('Por favor completa la dirección');
        return;
      }
    }

    onLocationSelect({
      ...location,
      locationType,
      address: locationType === 'private_home' ?
        `${address.street} ${address.number}, ${address.city}, ${address.province}, ${address.country}` :
        null
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>¿Dónde quieres plantar tu árbol?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selector de tipo */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="radio"
              name="locationType"
              value="public"
              checked={locationType === 'public'}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">🌍 Ubicación pública</div>
              <div className="text-sm text-gray-500">
                Visible en el mapa global (parques, bosques, áreas comunitarias)
              </div>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="radio"
              name="locationType"
              value="private_home"
              checked={locationType === 'private_home'}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">🏠 Mi casa/propiedad</div>
              <div className="text-sm text-gray-500">
                Ubicación privada (solo tú puedes verlo)
              </div>
            </div>
          </label>
        </div>

        {/* Dirección (solo si es casa) */}
        {locationType === 'private_home' && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">
              Ingresa la dirección de tu casa
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Calle"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              <Input
                placeholder="Número"
                value={address.number}
                onChange={(e) => setAddress({ ...address, number: e.target.value })}
              />
              <Input
                placeholder="Piso/Depto (opcional)"
                value={address.floor}
                onChange={(e) => setAddress({ ...address, floor: e.target.value })}
              />
              <Input
                placeholder="Código Postal"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
              />
              <Input
                placeholder="Ciudad"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <Input
                placeholder="Provincia"
                value={address.province}
                onChange={(e) => setAddress({ ...address, province: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Botón de ubicación actual */}
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          className="w-full"
        >
          📍 Usar mi ubicación actual
        </Button>

        {/* Mapa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            O haz click en el mapa para seleccionar la ubicación exacta
          </label>
          <div className="h-80 rounded-lg overflow-hidden border">
            <TreeMap
              trees={[]}
              onMapClick={handleMapClick}
              center={location ? [location.lat, location.lng] : [-34.6037, -58.3816]}
              zoom={15}
            />
          </div>
          {location && (
            <p className="text-xs text-gray-500 mt-2">
              📍 Ubicación seleccionada: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}
        </div>

        {/* Botón confirmar */}
        <Button
          onClick={handleConfirm}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!location}
        >
          Confirmar ubicación
        </Button>
      </CardContent>
    </Card>
  );
};

export default HomeLocationPicker;
```

**8.1.6 Integrar en AvailableTreeDetailPage**

```javascript
import HomeLocationPicker from '../components/HomeLocationPicker';

const AvailableTreeDetailPage = () => {
  const [locationData, setLocationData] = useState(null);

  const handleLocationSelect = (data) => {
    setLocationData(data);
    toast.success('Ubicación seleccionada');
  };

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!locationData) {
      toast.error('Por favor selecciona una ubicación');
      return;
    }

    const purchaseData = {
      available_tree_id: tree.id,
      name: treeName,
      latitude: locationData.lat,
      longitude: locationData.lng,
      location_type: locationData.locationType,
      address: locationData.address,
      message: message.trim() || null
    };

    await availableTreeService.purchaseTree(purchaseData);
  };

  return (
    // ... resto del componente
    <form onSubmit={handlePurchase}>
      {/* Nombre y mensaje */}

      {/* Selector de ubicación */}
      <HomeLocationPicker onLocationSelect={handleLocationSelect} />

      {/* Botón de compra */}
    </form>
  );
};
```

**8.1.7 Filtrar Mapa Público**

**Modificar MapPage para solo mostrar árboles públicos:**

```javascript
// pages/MapPage.jsx
const MapPage = () => {
  const loadTrees = async () => {
    // Solo obtener árboles con ubicación pública
    const allTrees = await treeService.getTrees();
    const publicTrees = allTrees.filter(tree => tree.is_public_location);
    setTrees(publicTrees);
  };
};
```

**Endpoint del backend:**
```javascript
// GET /api/trees?public_only=true
exports.getAllTrees = async (req, res) => {
  const { public_only } = req.query;

  let query = 'SELECT * FROM trees WHERE deleted_at IS NULL';

  if (public_only === 'true') {
    query += ' AND is_public_location = TRUE';
  }

  // ... resto del código
};
```

**8.1.8 Vista "Mis Árboles" Mejorada**

En UserDashboard, mostrar indicador de ubicación:

```javascript
{tree.location_type === 'private_home' && (
  <Badge variant="secondary" className="gap-1">
    🏠 En mi casa
  </Badge>
)}

{tree.location_type === 'public' && (
  <Badge variant="default" className="gap-1">
    🌍 Ubicación pública
  </Badge>
)}
```

**8.1.9 Privacidad y Seguridad**

**Encriptar coordenadas privadas:**
```javascript
// src/utils/encryption.js
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.LOCATION_ENCRYPTION_KEY, 'hex');

exports.encryptLocation = (latitude, longitude) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const data = JSON.stringify({ latitude, longitude });
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted: encrypted,
    iv: iv.toString('hex')
  };
};

exports.decryptLocation = (encrypted, iv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
};
```

**Guardar encriptado:**
```javascript
if (location_type === 'private_home') {
  const { encrypted, iv } = encryptLocation(latitude, longitude);

  await db.query(`
    INSERT INTO trees (..., encrypted_location, location_iv)
    VALUES (..., ?, ?)
  `, [..., encrypted, iv]);
}
```

**8.1.10 Beneficios de la Funcionalidad**

**Para Usuarios:**
- ✅ Plantar árboles en su jardín
- ✅ Privacidad de ubicación garantizada
- ✅ Seguimiento personal de sus árboles
- ✅ Crear su propio "bosque casero"

**Para el Negocio:**
- ✅ Más casos de uso (no solo espacios públicos)
- ✅ Mayor adopción en zonas urbanas
- ✅ Producto diferenciador
- ✅ Fidelización de usuarios

**Casos de uso:**
1. Usuario con jardín grande quiere reforestar
2. Condominio planta árboles en áreas comunes
3. Escuela planta en patio interno
4. Usuario regala árbol para jardín de familiar

---

### 8.2 Suscripciones / Membresías

**Planes para usuarios:**

**Plan Básico (Gratis):**
- Comprar árboles individuales
- Ver catálogo completo
- Certificados básicos

**Plan Premium ($9.99/mes):**
- 10% descuento en todos los árboles
- Prioridad en plantación
- Certificados premium con diseño especial
- Acceso a especies exclusivas
- Reporte mensual de impacto

**Plan Empresa ($49.99/mes):**
- Todo lo de Premium
- 20% descuento
- Reportes de sostenibilidad
- API access para integración
- Gestor de cuenta dedicado

### 8.2 Gift Cards / Regalos

**Funcionalidad:**
- Comprar árbol como regalo
- Generar código de regalo
- Enviar por email con mensaje personalizado
- Receptor canjea código y elige ubicación

**Flujo:**
```
Comprador selecciona árbol
    ↓
Marca como "Regalo"
    ↓
Ingresa email y mensaje del destinatario
    ↓
Paga
    ↓
Sistema genera código único
    ↓
Envía email al destinatario
    ↓
Destinatario canjea código
    ↓
Elige ubicación de plantación
```

### 8.3 Programa de Referidos

**Sistema de afiliados:**
- Usuario invita amigos
- Recibe 10% de comisión por ventas
- Dashboard de referidos
- Links de afiliado únicos

**Tabla:**
```sql
CREATE TABLE referrals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  referrer_id INT NOT NULL,
  referred_id INT NOT NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_earned DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referred_id) REFERENCES users(id)
);
```

### 8.4 Árboles NFT (Blockchain)

**Concepto:**
- Cada árbol plantado genera un NFT único
- NFT prueba de propiedad inmutable
- Incluye coordenadas GPS, foto, certificado
- Transferible a otras wallets

**Implementación:**
- Smart contract en Ethereum/Polygon
- Mintear NFT al plantar árbol
- Metadata en IPFS
- Wallet integration en frontend

### 8.5 Carbon Credits / Créditos de Carbono

**Calcular CO2 capturado:**
- Cada especie captura X kg CO2/año
- Generar créditos de carbono vendibles
- Marketplace de créditos
- Certificación internacional

**Ejemplo:**
```
1 Roble adulto = ~22 kg CO2/año
10 años = 220 kg CO2
= 0.22 toneladas métricas
= $X USD en créditos de carbono
```

### 8.6 API Pública

**Para desarrolladores:**
- API REST pública
- Documentación con Swagger
- Rate limiting
- API keys

**Casos de uso:**
- Integrar catálogo en sitios externos
- Apps móviles de terceros
- Widgets embebibles
- Estadísticas públicas

**Endpoints públicos:**
```javascript
GET /api/public/trees              // Catálogo público
GET /api/public/trees/:id          // Detalle
GET /api/public/stats              // Estadísticas globales
GET /api/public/impact             // Impacto ambiental total
```

---

## 📅 Roadmap Sugerido

### Fase 1 (1-2 semanas) - MVP Mejorado
- ✅ Sistema de pagos básico (MercadoPago)
- ✅ Panel de gestión para viveros
- ✅ Notificaciones mejoradas

### Fase 2 (2-3 semanas) - Engagement
- ✅ Wishlist/Favoritos
- ✅ Sistema de reviews
- ✅ Analytics básico

### Fase 3 (3-4 semanas) - Growth
- ✅ Comparador de árboles
- ✅ Recomendaciones
- ✅ Gift cards
- ✅ Reportes exportables

### Fase 4 (1-2 meses) - Advanced
- ✅ Suscripciones/Membresías
- ✅ Programa de referidos
- ✅ API pública
- ✅ App móvil

### Fase 5 (Futuro) - Innovation
- 🔮 NFTs
- 🔮 Carbon credits marketplace
- 🔮 AI recommendations
- 🔮 Blockchain integration

---

## 🛠️ Stack Tecnológico Recomendado

**Para implementar estas funcionalidades:**

**Pagos:**
- MercadoPago SDK
- Stripe (alternativa)

**Analytics:**
- Google Analytics
- Mixpanel
- Segment

**Notificaciones:**
- Socket.io (real-time)
- Firebase Cloud Messaging (push móvil)
- SendGrid (email)

**Almacenamiento de imágenes:**
- AWS S3
- Cloudinary
- Firebase Storage

**Caching:**
- Redis (sesiones, cache)
- CDN para imágenes

**Testing:**
- Jest (unit tests)
- Cypress (E2E tests)
- Postman (API tests)

---

## 📞 Contacto y Contribuciones

Para implementar estas funcionalidades o sugerir nuevas:
- Crear issue en GitHub
- Pull requests bienvenidos
- Documentación en `/docs`

---

**Última actualización:** 2025-10-25
**Versión:** 1.0.0
