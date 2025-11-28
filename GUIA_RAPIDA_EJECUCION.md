# 🚀 GUÍA RÁPIDA DE EJECUCIÓN - Rol Vivero

## ⚡ QUICK START (15 minutos)

### PASO 1: Ejecutar Migración SQL (5 min)

```bash
# Si usas MySQL local
cd my-tree-in-the-world-back
mysql -u root -p defaultdb < database/migrations/add_vivero_features.sql

# Si usas Aiven (cloud) - usa las credenciales del .env
mysql -h <HOST> -P <PORT> -u <USER> -p<PASSWORD> defaultdb < database/migrations/add_vivero_features.sql
```

**Verificar que funcionó:**
```sql
mysql -u root -p

USE defaultdb;

-- Debe mostrar 4 tablas nuevas
SHOW TABLES LIKE 'nursery%';

-- Debe mostrar las nuevas columnas
DESC work_orders;

-- Debe tener stats del vivero (user id 4)
SELECT * FROM nursery_stats WHERE nursery_id = 4;
```

### PASO 2: Reiniciar Backend (2 min)

```bash
cd my-tree-in-the-world-back

# Detener servidor si está corriendo (Ctrl+C)

# Iniciar
npm run dev
```

**Busca en consola:**
```
🚀 Servidor corriendo en puerto 5000
🕐 [Timeout Scheduler] Started - Checking every 1 minute
⏰ [Timeout Scheduler] No timed out orders found
```

### PASO 3: Probar API (5 min)

**Abrir Postman o Thunder Client:**

1. **Login como vivero:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "vivero@miarbol.com",
  "password": "admin123"
}
```

Copia el `token` de la respuesta.

2. **Ver stats del vivero:**
```http
GET http://localhost:5000/api/vivero/stats/4
Authorization: Bearer <tu-token>
```

**Respuesta esperada:**
```json
{
  "stats": {
    "nursery_id": 4,
    "total_orders_received": 0,
    "total_orders_accepted": 0,
    "acceptance_rate": 0,
    "average_rating": 0
  },
  "pendingOrders": {
    "count": 0,
    "urgentDeadline": null
  },
  "revenue": {
    "completedThisMonth": 0,
    "grossRevenue": 0,
    "netRevenue": 0
  }
}
```

### PASO 4: Probar Frontend (3 min)

```bash
cd my-tree-in-the-world-front
npm run dev
```

**Navegar a:** http://localhost:5173

1. Login:
   - Email: `vivero@miarbol.com`
   - Password: `admin123`

2. Ir a: **Órdenes** (en sidebar)

3. Verás: "No hay órdenes pendientes"

---

## 🧪 TEST COMPLETO (30 minutos)

### Test 1: Crear Orden de Prueba

```sql
-- Conectar a MySQL
mysql -u root -p defaultdb

-- Crear un árbol si no existe
INSERT INTO trees (user_id, name, species, status, created_at)
VALUES (1, 'Roble de Prueba', 'Roble', 'sin_plantar', NOW());

-- Obtener el ID del árbol (último insertado)
SET @tree_id = LAST_INSERT_ID();

-- Crear work order pendiente de respuesta
INSERT INTO work_orders (
  tree_id,
  status,
  nursery_id,
  nursery_response_deadline,
  created_at
)
VALUES (
  @tree_id,
  'pendiente_respuesta_vivero',
  4,  -- ID del vivero
  DATE_ADD(NOW(), INTERVAL 2 HOUR),  -- 2 horas desde ahora
  NOW()
);

-- Verificar que se creó
SELECT * FROM work_orders WHERE status = 'pendiente_respuesta_vivero';
```

### Test 2: Ver Orden en Frontend

1. Recargar página `/vivero/4/ordenes`
2. Verás la orden con countdown de 2 horas
3. Intentar aceptar:
   - Seleccionar 3 días
   - Ver cálculo de ganancia (85% del precio)
   - Click "Confirmar"

**Verificar en DB:**
```sql
SELECT
  id,
  status,
  nursery_accepted_at,
  preparation_days_promised,
  preparation_deadline
FROM work_orders
WHERE status = 'aceptada_por_vivero';

-- Stats debe actualizarse
SELECT * FROM nursery_stats WHERE nursery_id = 4;
-- total_orders_accepted debe ser 1
```

### Test 3: Probar Timeout Automático

```sql
-- Crear orden con deadline PASADO
INSERT INTO work_orders (
  tree_id,
  status,
  nursery_id,
  nursery_response_deadline,
  created_at
)
VALUES (
  @tree_id,
  'pendiente_respuesta_vivero',
  4,
  DATE_SUB(NOW(), INTERVAL 1 HOUR),  -- 1 hora ATRÁS
  DATE_SUB(NOW(), INTERVAL 3 HOUR)   -- Creada hace 3 horas
);
```

**Esperar 1 minuto** (el scheduler ejecuta cada minuto)

**Verificar en logs del backend:**
```
⏰ [Timeout Scheduler] Found 1 timed out orders
✅ [Timeout Scheduler] Processed order #X - Nursery: vivero_test
```

**Verificar en DB:**
```sql
-- Orden debe estar timeout
SELECT * FROM work_orders WHERE status = 'timeout_vivero';

-- Debe existir penalización
SELECT * FROM nursery_penalties WHERE nursery_id = 4 AND penalty_type = 'timeout';

-- Stats debe actualizarse
SELECT total_orders_timeout FROM nursery_stats WHERE nursery_id = 4;
-- Debe ser 1

-- Notificaciones deben existir
SELECT * FROM notifications WHERE user_id = 4 AND title LIKE '%Timeout%';
```

---

## 🐛 TROUBLESHOOTING

### Error: "Table 'nursery_stats' doesn't exist"
```bash
# Ejecutar migración de nuevo
mysql -u root -p defaultdb < database/migrations/add_vivero_features.sql
```

### Error: "Column 'nursery_response_deadline' doesn't exist"
```sql
-- Verificar si las columnas existen
DESC work_orders;

-- Si no existen, ejecutar manualmente cada ALTER TABLE del archivo de migración
```

### Scheduler no ejecuta
```javascript
// Verificar en src/server.js que está esta línea:
startViveroTimeoutScheduler();

// Debe estar después de app.listen()
```

### Frontend: "Cannot read property 'id' of undefined"
```javascript
// Asegurarte que ViveroOrdersContent recibe nurseryId
<ViveroOrdersContent nurseryId={user.id} />

// Verificar en el componente padre (ViveroDashboard.jsx)
```

### API retorna 401 Unauthorized
```bash
# Token expiró o es inválido
# Login de nuevo y obtener nuevo token
```

---

## 📊 ENDPOINTS DISPONIBLES

### Vivero Stats
```http
GET /api/vivero/stats/:nurseryId
Authorization: Bearer <token>
```

### Listar Órdenes
```http
GET /api/vivero/orders/:nurseryId?status=pendiente_respuesta_vivero&limit=50
Authorization: Bearer <token>
```

### Aceptar Orden
```http
POST /api/vivero/orders/:orderId/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "preparation_days": 3
}
```

### Rechazar Orden
```http
POST /api/vivero/orders/:orderId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "rejection_reason": "No tenemos stock disponible en este momento"
}
```

### Marcar como Listo
```http
PUT /api/vivero/orders/:orderId/mark-ready
Authorization: Bearer <token>
Content-Type: application/json

{
  "preparation_notes": "Árbol preparado y regado",
  "preparation_photos": ["url1.jpg", "url2.jpg"]
}
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de ejecutar todo:

- [ ] Migración ejecutada sin errores
- [ ] Backend inicia y muestra scheduler activo
- [ ] Endpoint `/api/vivero/stats/4` retorna JSON válido
- [ ] Frontend muestra dashboard del vivero
- [ ] Crear orden de prueba en DB funciona
- [ ] Orden aparece en frontend con countdown
- [ ] Aceptar orden funciona (estado cambia a `aceptada_por_vivero`)
- [ ] Stats se actualizan (`total_orders_accepted` incrementa)
- [ ] Orden con timeout se procesa automáticamente
- [ ] Penalización se crea en `nursery_penalties`
- [ ] Notificaciones se envían correctamente

---

## 🆘 SOPORTE

Si algo no funciona:

1. Revisar logs del backend en consola
2. Revisar console del navegador (F12)
3. Verificar estructura de DB con:
```sql
SHOW TABLES;
DESC work_orders;
SELECT * FROM nursery_stats;
```

4. Consultar documento completo: `IMPLEMENTACION_VIVERO_COMPLETA.md`

---

**Tiempo estimado total: 15-45 minutos**

¡Éxito! 🎉
