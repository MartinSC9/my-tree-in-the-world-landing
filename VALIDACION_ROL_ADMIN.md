# VALIDACIÓN ROL ADMIN - My Tree in the World

**Fecha**: 2025-01-10
**Estado**: Análisis Completo
**Prioridad**: Alta

---

## RESUMEN EJECUTIVO

El rol admin tiene una **implementación desbalanceada**: el backend está robusto y completo con endpoints funcionales, autorización, auditoría y schedulers automáticos, pero el frontend está mayormente desconectado usando datos mock. La arquitectura backend es sólida y solo requiere integración con la UI existente.

### Estado General

| Componente | Estado | Completitud |
|------------|--------|-------------|
| **Backend API** | ✅ Funcional | 90% |
| **Frontend UI** | ⚠️ Mock Data | 30% |
| **Integración** | ❌ Desconectado | 10% |
| **Documentación** | ✅ Completa | 100% |

---

## 1. DOCUMENTACIÓN DEL ROL ADMIN

### Responsabilidades Documentadas

**Filosofía**: Admin es un rol **SUPERVISOR**, no operador. El sistema es 100% automático y el admin solo interviene en excepciones (~5% de órdenes).

#### Principales Responsabilidades:

1. **Dashboard de Monitoreo**
   - Visualización de alertas automáticas
   - Estadísticas en tiempo real
   - Detección de anomalías

2. **Aprobación de Perfiles** (Una sola vez)
   - Aprobación inicial de viveros (nurseries)
   - Aprobación inicial de plantadores
   - Verificación de documentación

3. **Moderación de Contenido**
   - Revisión de posts reportados
   - Ocultación de contenido inapropiado
   - Gestión de disputas

4. **Manejo de Excepciones**
   - Órdenes estancadas >48h sin plantador
   - Disputas entre usuarios y plantadores
   - Alertas de fraude
   - Problemas técnicos

5. **Estadísticas y Reportes**
   - Métricas del sistema
   - Reportes de rendimiento
   - Análisis de patrones

6. **Resolución de Problemas**
   - Intermediación entre partes
   - Decisiones en casos complejos
   - Ajustes manuales cuando necesario

---

## 2. BACKEND - ANÁLISIS DETALLADO

### ✅ IMPLEMENTADO COMPLETAMENTE

#### 2.1 Gestión de Usuarios

**Archivo**: `my-tree-in-the-world-back/src/controllers/userController.js`

```javascript
// Línea 5-93: Crear usuario
exports.createUser = async (req, res) => {
  // Validación completa
  // Hash de contraseña
  // Asignación de rol
  // Audit logging
}

// Línea 97-115: Listar todos los usuarios
exports.getAllUsers = async (req, res) => {
  // Filtra soft-deleted (WHERE deleted_at IS NULL)
  // Incluye todos los roles
  // Solo admin puede ejecutar
}

// Línea 119-135: Obtener usuario por ID
exports.getUserById = async (req, res)

// Línea 139-182: Actualizar usuario
exports.updateUser = async (req, res) => {
  // Validación de permisos (admin o mismo usuario)
  // Audit logging de cambios
}

// Línea 315-349: Cambiar rol de usuario
exports.updateUserRole = async (req, res) => {
  // Solo admin
  // Valida roles permitidos
  // Audit log completo
}

// Línea 272-311: Activar/Desactivar cuenta
exports.toggleUserActive = async (req, res) => {
  // Alterna is_active
  // Bloquea login si inactivo
  // Audit logging
}

// Línea 186-225: Soft Delete
exports.deleteUser = async (req, res) => {
  // Establece deleted_at y deleted_by
  // Marca is_active = FALSE
  // Audit log completo
}

// Línea 229-268: Restaurar usuario eliminado
exports.restoreUser = async (req, res) => {
  // Limpia deleted_at
  // Reactiva cuenta
  // Audit logging
}
```

**Rutas**: `my-tree-in-the-world-back/src/routes/user.routes.js`
```
POST   /api/users                   - Crear usuario (admin)
GET    /api/users                   - Listar usuarios (admin)
GET    /api/users/:id               - Ver usuario (auth)
PUT    /api/users/:id               - Actualizar (admin/self)
PUT    /api/users/:id/role          - Cambiar rol (admin)
PUT    /api/users/:id/toggle-active - Activar/Desactivar (admin)
DELETE /api/users/:id               - Soft delete (admin)
POST   /api/users/:id/restore       - Restaurar (admin)
```

**Estado**: ✅ **COMPLETO** - Todas las operaciones CRUD con audit trail

---

#### 2.2 Estadísticas del Sistema

**Archivo**: `my-tree-in-the-world-back/src/controllers/statsController.js`

```javascript
// Línea 135-178: Estadísticas del sistema
exports.getSystemStats = async (req, res) => {
  // Usuarios por rol (user, company, vivero, plantador, admin)
  // Árboles por estado (sin_plantar, en_proceso, plantado, verificado)
  // Órdenes por estado (todas las transiciones)
  // Plantadores activos
  // Query optimizada con COUNT y GROUP BY
}

// Línea 4-44: Estadísticas de plantador individual
exports.getPlanterStats = async (planterId) => {
  // Total árboles plantados
  // Rating promedio
  // Órdenes completadas
  // Ganancias totales
}

// Línea 48-67: Ranking de plantadores
exports.getPlantersRanking = async () => {
  // Ordenado por árboles plantados
  // Incluye rating y completados
  // Vista de base de datos: v_planter_ranking
}

// Línea 71-92: Historial de orden de trabajo
exports.getWorkOrderHistory = async (workOrderId) => {
  // Todas las transiciones de estado
  // Con timestamps y responsables
  // Audit trail completo
}

// Línea 96-103: Resumen de órdenes
exports.getWorkOrdersSummary = async () => {
  // Vista: v_work_orders_summary
  // Métricas agregadas
}

// Línea 107-131: Árboles físicos completos
exports.getPhysicalTreesFull = async () => {
  // Vista: v_physical_trees_full
  // Información completa de árboles
  // JOIN con usuarios, especies, ubicaciones
}

// Línea 202-237: Historial múltiple para usuario
exports.getAllHistoriesForUser = async (userId) => {
  // Árboles plantados
  // Certificados generados
  // Órdenes asignadas
  // Carga batch optimizada
}
```

**Rutas**: `my-tree-in-the-world-back/src/routes/stats.routes.js`
```
GET /api/stats/system                       - Estadísticas generales (admin)
GET /api/stats/planter/:planterId           - Stats de plantador
GET /api/stats/planters/ranking             - Ranking
GET /api/stats/work-order/:id/history       - Historial de orden
GET /api/stats/work-orders/summary          - Resumen órdenes
GET /api/stats/physical-trees/full          - Datos completos árboles
```

**Estado**: ✅ **COMPLETO** - API robusta con vistas optimizadas

---

#### 2.3 Auditoría del Sistema

**Archivo**: `my-tree-in-the-world-back/src/controllers/auditController.js`

```javascript
// Línea 4-34: Obtener logs de auditoría
exports.getAllAuditLogs = async (req, res) => {
  // Filtros: userId, eventType
  // Paginación con LIMIT y OFFSET
  // Ordenado por fecha descendente
  // Query: SELECT * FROM audit_logs WHERE ... ORDER BY created_at DESC
}

// Línea 38-57: Log individual
exports.getAuditLogById = async (req, res) => {
  // Detalles completos de evento
  // Metadata en formato JSON
}

// Sistema automático de logging (utils/audit.js):
logAuditEvent(userId, eventType, eventDescription, metadata = {})
```

**Rutas**: `my-tree-in-the-world-back/src/routes/audit.routes.js`
```
GET /api/audit/logs     - Todos los logs (admin, con filtros)
GET /api/audit/logs/:id - Log individual (admin)
```

**Eventos Auditados**:
- `user_created`, `user_updated`, `user_deleted`, `user_restored`
- `user_role_changed`, `user_activated`, `user_deactivated`
- `work_order_created`, `work_order_updated`, `work_order_deleted`
- `tree_created`, `tree_updated`, `tree_deleted`
- `post_created`, `post_flagged`, `post_hidden`
- `login_attempt`, `password_changed`

**Estado**: ✅ **COMPLETO** - Trail de auditoría exhaustivo

---

#### 2.4 Autorización de Órdenes de Trabajo

**Archivo**: `my-tree-in-the-world-back/src/controllers/workOrderController.js`

```javascript
// Línea 73-135: Actualizar estado de orden
exports.updateWorkOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  // Línea 82-84: Tracking de autorización admin
  if (status === 'autorizada') {
    await connection.query(
      'UPDATE work_orders SET status = ?, authorized_by = ?, authorized_at = NOW() WHERE id = ?',
      [status, userId, id]
    );
  }

  // Línea 104-123: Actualización automática de estado de árbol
  if (['plantador_en_camino', 'plantando', 'plantada'].includes(status)) {
    const newTreeStatus =
      status === 'plantada' ? 'plantado' : 'en_proceso';

    await connection.query(
      'UPDATE trees SET status = ? WHERE id = ?',
      [newTreeStatus, workOrder.tree_id]
    );
  }
}
```

**Base de Datos** (schema.sql, línea 437-438):
```sql
authorized_by INT DEFAULT NULL,
authorized_at TIMESTAMP NULL,
FOREIGN KEY (authorized_by) REFERENCES users(id)
```

**Flujo de Autorización**:
1. Usuario planta árbol → Estado: `sin_plantar`
2. Sistema crea orden → Estado: `pendiente_autorizacion`
3. **Admin autoriza** → Estado: `autorizada` (authorized_by = admin_id)
4. Sistema asigna a vivero → Estado: `asignada_vivero`
5. Flujo automático continúa...

**Estado**: ✅ **COMPLETO** - Sistema de autorización funcional

---

#### 2.5 Moderación de Contenido

**Archivo**: `my-tree-in-the-world-back/src/controllers/moderationController.js`

```javascript
// Línea 4-34: Listar posts para moderación
exports.getAllPosts = async (req, res) => {
  const { flagged, hidden } = req.query;

  let query = 'SELECT * FROM community_posts WHERE deleted_at IS NULL';

  if (flagged === 'true') {
    query += ' AND is_flagged = TRUE';
  }
  if (hidden === 'true') {
    query += ' AND is_hidden = TRUE';
  }

  query += ' ORDER BY created_at DESC';

  const posts = await connection.query(query);
  return res.json(posts);
}

// Línea 37-47: Reportar post
exports.flagPost = async (req, res) => {
  const { id } = req.params;

  await connection.query(
    'UPDATE community_posts SET is_flagged = TRUE WHERE id = ?',
    [id]
  );

  // Cualquier usuario autenticado puede reportar
}

// Línea 51-62: Ocultar post (admin)
exports.hidePost = async (req, res) => {
  const { id } = req.params;

  await connection.query(
    'UPDATE community_posts SET is_hidden = TRUE WHERE id = ?',
    [id]
  );

  // Solo admin puede ocultar
}
```

**Rutas**: `my-tree-in-the-world-back/src/routes/moderation.routes.js`
```
GET /api/moderation/posts         - Listar posts (admin, filtros: flagged, hidden)
PUT /api/moderation/posts/:id/flag - Reportar (cualquier usuario)
PUT /api/moderation/posts/:id/hide - Ocultar (admin)
```

**Base de Datos** (community_posts):
```sql
is_flagged BOOLEAN DEFAULT FALSE,
is_hidden BOOLEAN DEFAULT FALSE,
flagged_at TIMESTAMP NULL,
hidden_at TIMESTAMP NULL,
hidden_by INT NULL
```

**Estado**: ⚠️ **PARCIAL** - Funciona pero limitado
- ✅ Marcar posts como reportados
- ✅ Ocultar contenido inapropiado
- ❌ Falta: Sistema de reportes (razones, descripción)
- ❌ Falta: Tabla de reportes con detalles
- ❌ Falta: Suspensión de usuarios infractores
- ❌ Falta: Sistema de apelaciones

---

#### 2.6 Sistema de Alertas Automáticas

**Archivo**: `my-tree-in-the-world-back/src/schedulers/viveroTimeoutScheduler.js`

```javascript
// Línea 1-217: Scheduler de timeouts de vivero
class ViveroTimeoutScheduler {
  constructor() {
    this.intervalMinutes = 1; // Revisa cada 1 minuto
    this.timeoutMinutes = 120; // Timeout de 2 horas
  }

  start() {
    console.log('🕐 Vivero Timeout Scheduler iniciado');

    this.intervalId = setInterval(async () => {
      await this.checkTimeouts();
    }, this.intervalMinutes * 60 * 1000);

    // Ejecución inmediata al inicio
    this.checkTimeouts();
  }

  async checkTimeouts() {
    // Línea 30-44: Query de órdenes pendientes
    const query = `
      SELECT wo.*, u.id as user_id, u.email, u.name as user_name
      FROM work_orders wo
      JOIN trees t ON wo.tree_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE wo.status = 'pendiente_respuesta_vivero'
      AND wo.assigned_vivero_at IS NOT NULL
      AND TIMESTAMPDIFF(MINUTE, wo.assigned_vivero_at, NOW()) >= ?
    `;

    const timedOutOrders = await connection.query(query, [this.timeoutMinutes]);

    // Línea 49-215: Para cada orden con timeout
    for (const order of timedOutOrders) {
      await this.handleTimeout(order);
    }
  }

  async handleTimeout(order) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Cambiar estado de orden a 'timeout_vivero'
      await connection.query(
        'UPDATE work_orders SET status = ?, timeout_at = NOW() WHERE id = ?',
        ['timeout_vivero', order.id]
      );

      // 2. Aplicar penalización al vivero (-0.3 puntos)
      await connection.query(
        `UPDATE users
         SET rating = GREATEST(0, rating - 0.3)
         WHERE id = ?`,
        [order.vivero_id]
      );

      // 3. Notificar al usuario
      await this.createNotification(
        order.user_id,
        'timeout_vivero',
        `El vivero no respondió a tiempo para tu orden #${order.id}. Se asignará a otro vivero.`
      );

      // 4. Notificar al vivero
      await this.createNotification(
        order.vivero_id,
        'timeout_penalty',
        `Timeout en orden #${order.id}. Penalización: -0.3 puntos de rating.`
      );

      // 5. Restaurar stock del árbol disponible
      await connection.query(
        'UPDATE available_trees SET stock = stock + 1 WHERE id = ?',
        [order.available_tree_id]
      );

      // 6. SUSPENSIÓN AUTOMÁTICA: Si 3+ timeouts en 30 días
      const [recentTimeouts] = await connection.query(
        `SELECT COUNT(*) as timeout_count
         FROM work_orders
         WHERE vivero_id = ?
         AND status = 'timeout_vivero'
         AND timeout_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        [order.vivero_id]
      );

      if (recentTimeouts[0].timeout_count >= 3) {
        // Suspender vivero por 7 días
        await connection.query(
          `UPDATE users
           SET is_active = FALSE,
               suspended_until = DATE_ADD(NOW(), INTERVAL 7 DAY),
               suspension_reason = 'Múltiples timeouts (>=3 en 30 días)'
           WHERE id = ?`,
          [order.vivero_id]
        );

        // Notificar suspensión
        await this.createNotification(
          order.vivero_id,
          'account_suspended',
          `Tu cuenta ha sido suspendida por 7 días debido a múltiples timeouts. Contacta con soporte.`
        );

        console.log(`⚠️ VIVERO SUSPENDIDO: ID ${order.vivero_id} (${recentTimeouts[0].timeout_count} timeouts en 30 días)`);
      }

      // 7. Audit log
      await connection.query(
        `INSERT INTO audit_logs (user_id, event_type, event_description, metadata)
         VALUES (?, 'work_order_timeout', 'Timeout de vivero en orden', ?)`,
        [order.vivero_id, JSON.stringify({
          work_order_id: order.id,
          vivero_id: order.vivero_id,
          penalty: -0.3,
          timeout_minutes: this.timeoutMinutes
        })]
      );

      await connection.commit();
      console.log(`✅ Timeout procesado: Orden #${order.id}, Vivero #${order.vivero_id}`);

    } catch (error) {
      await connection.rollback();
      console.error('Error procesando timeout:', error);
    } finally {
      connection.release();
    }
  }
}

// Inicialización en server.js (línea 151-152)
const viveroTimeoutScheduler = new ViveroTimeoutScheduler();
viveroTimeoutScheduler.start();
```

**Características**:
- ✅ Monitoreo automático cada 1 minuto
- ✅ Timeout de 2 horas para respuesta de vivero
- ✅ Penalización automática (-0.3 puntos)
- ✅ Suspensión automática (3+ timeouts en 30 días → 7 días)
- ✅ Notificaciones a usuario y vivero
- ✅ Restauración de stock
- ✅ Audit logging completo

**Estado**: ✅ **COMPLETO** - Scheduler robusto funcionando

---

#### 2.7 Sistema de Notificaciones

**Archivo**: `my-tree-in-the-world-back/src/controllers/notification.controller.js`

```javascript
// Sistema de notificaciones para alertas
exports.createNotification = async (userId, type, message)
exports.getMyNotifications = async (req, res)
exports.markAsRead = async (req, res)
```

**Tipos de Notificación**:
- `timeout_vivero` - Vivero no respondió a tiempo
- `timeout_penalty` - Penalización aplicada
- `account_suspended` - Cuenta suspendida
- `work_order_assigned` - Orden asignada
- `tree_planted` - Árbol plantado exitosamente
- `payment_received` - Pago recibido

**Estado**: ✅ **COMPLETO** - Sistema funcional

---

### ❌ FALTANTE EN BACKEND

#### 2.8 Alertas de Órdenes Estancadas (48h sin plantador)

**Documentación**: Admin debe recibir alertas de órdenes sin plantador por >48 horas

**Estado Actual**: NO IMPLEMENTADO

**Implementación Necesaria**:
```javascript
// Nuevo archivo: src/schedulers/stuckOrderScheduler.js
class StuckOrderScheduler {
  async checkStuckOrders() {
    // Query: órdenes en 'planta_lista' sin plantador por >48h
    const query = `
      SELECT wo.*, t.*, u.email, u.name
      FROM work_orders wo
      JOIN trees t ON wo.tree_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE wo.status = 'planta_lista'
      AND wo.ready_at IS NOT NULL
      AND TIMESTAMPDIFF(HOUR, wo.ready_at, NOW()) >= 48
      AND wo.alerted_admin_at IS NULL
    `;

    for (const order of stuckOrders) {
      // 1. Notificar a TODOS los admins
      // 2. Marcar orden como alerted_admin_at = NOW()
      // 3. Crear log de alerta
    }
  }
}
```

**Prioridad**: 🔴 ALTA

---

#### 2.9 Sistema de Reportes Detallado

**Documentación**: Admin debe ver reportes de usuarios sobre posts/perfiles

**Estado Actual**: Solo flag básico (sin razón, sin descripción)

**Faltante**:
- Tabla `content_reports` con razón, descripción, evidencia
- Endpoint `POST /api/moderation/report` para crear reporte
- Endpoint `GET /api/moderation/reports` para listar reportes pendientes
- Endpoint `PUT /api/moderation/reports/:id/resolve` para cerrar reporte

**Prioridad**: 🟡 MEDIA

---

#### 2.10 Aprobación de Perfiles

**Documentación**: Admin aprueba viveros y plantadores en su primera vez

**Estado Actual**: No hay workflow explícito
- Probablemente se usa `toggleUserActive()` o cambio de rol
- No hay campo `profile_approved_by` o `profile_approved_at`

**Faltante**:
- Campo `profile_verified` en users
- Campo `verified_by` (admin ID)
- Campo `verified_at` (timestamp)
- Endpoint `POST /api/users/:id/verify-profile`

**Prioridad**: 🟡 MEDIA (se puede simular con is_active)

---

## 3. FRONTEND - ANÁLISIS DETALLADO

### ⚠️ PROBLEMA CRÍTICO: TODO USA MOCK DATA

**Ubicación**: `my-tree-in-the-world-front/src/modules/admin/`

Todos los componentes tienen UI completa y hermosa, pero **NINGUNO** está conectado al backend.

---

#### 3.1 Dashboard Principal

**Archivo**: `AdminDashboardContent.jsx` (Líneas 1-244)

```javascript
// Línea 16-39: Mock data hardcoded
const [stats, setStats] = useState({
  totalUsers: 1234,
  totalTrees: 5678,
  totalWorkOrders: 432,
  totalCompanies: 45,
  monthlyRevenue: 125000,
  systemHealth: 98
});

const [recentActivity] = useState([
  {
    id: 1,
    type: 'user_registration',
    description: 'Nuevo usuario registrado: Juan Pérez',
    timestamp: '2025-01-10 10:30:00',
    user: 'Juan Pérez'
  },
  // ... más datos mock
]);

const [alerts] = useState([
  {
    id: 1,
    type: 'warning',
    message: 'Orden de trabajo #234 sin plantador asignado hace 48 horas',
    severity: 'high',
    timestamp: '2025-01-10 09:00:00'
  },
  // ... más alertas mock
]);
```

**Lo que DEBERÍA hacer**:
```javascript
useEffect(() => {
  loadDashboardData();
}, []);

const loadDashboardData = async () => {
  try {
    // 1. Estadísticas del sistema
    const statsData = await statsService.getSystemStats();
    setStats(statsData);

    // 2. Actividad reciente (últimos audit logs)
    const logs = await auditService.getRecentLogs({ limit: 10 });
    setRecentActivity(logs);

    // 3. Alertas activas
    const alertsData = await alertService.getActiveAlerts();
    setAlerts(alertsData);

  } catch (error) {
    toast({ title: "Error", description: "No se pudieron cargar los datos" });
  }
};
```

**Estado**: ❌ **NO CONECTADO** - Solo UI

---

#### 3.2 Gestión de Usuarios

**Archivo**: `AdminUsersContent.jsx` (Líneas 1-300)

```javascript
// Línea 10-41: Mock users
const [users, setUsers] = useState([
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'user',
    status: 'active',
    trees_planted: 12,
    joined: '2024-01-15',
    last_login: '2025-01-10'
  },
  // ... 20+ usuarios mock
]);

// Línea 90-100: Funciones vacías
const handleEditUser = (user) => {
  console.log('Edit user:', user);
  // NO HACE NADA
};

const handleDeleteUser = (userId) => {
  console.log('Delete user:', userId);
  // NO HACE NADA
};

const handleToggleStatus = (userId) => {
  // Solo actualiza estado local (no persiste)
  setUsers(users.map(u =>
    u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
  ));
};
```

**Lo que DEBERÍA hacer**:
```javascript
useEffect(() => {
  loadUsers();
}, []);

const loadUsers = async () => {
  try {
    const data = await userService.getAllUsers();
    setUsers(data);
  } catch (error) {
    toast({ title: "Error", description: "No se pudieron cargar los usuarios" });
  }
};

const handleToggleStatus = async (userId) => {
  try {
    await userService.toggleUserActive(userId);
    await loadUsers(); // Recargar lista
    toast({ title: "Éxito", description: "Estado actualizado" });
  } catch (error) {
    toast({ title: "Error", description: "No se pudo cambiar el estado" });
  }
};

const handleDeleteUser = async (userId) => {
  if (!confirm('¿Estás seguro?')) return;

  try {
    await userService.deleteUser(userId);
    await loadUsers();
    toast({ title: "Éxito", description: "Usuario eliminado" });
  } catch (error) {
    toast({ title: "Error", description: "No se pudo eliminar el usuario" });
  }
};
```

**Estado**: ❌ **NO CONECTADO** - Botones no funcionales

---

#### 3.3 Gestión de Órdenes de Trabajo

**Archivo**: `AdminWorkOrdersContent.jsx` (Líneas 1-310)

```javascript
// Línea 12-50: Mock orders
const [workOrders, setWorkOrders] = useState([
  {
    id: 1,
    tree_id: 101,
    user_name: 'María García',
    species: 'Algarrobo',
    status: 'pendiente_autorizacion',
    created: '2025-01-09',
    priority: 'high',
    vivero: null,
    plantador: null
  },
  // ... 30+ órdenes mock
]);

// Línea 95-105: Función vacía
const handleManageOrder = (orderId) => {
  console.log('Manage order:', orderId);
  // NO HACE NADA
};
```

**Lo que DEBERÍA hacer**:
```javascript
useEffect(() => {
  loadWorkOrders();
}, [statusFilter]); // Recargar cuando cambia filtro

const loadWorkOrders = async () => {
  try {
    const params = statusFilter !== 'all' ? { status: statusFilter } : {};
    const data = await workOrderService.getAllWorkOrders(params);
    setWorkOrders(data);
  } catch (error) {
    toast({ title: "Error", description: "No se pudieron cargar las órdenes" });
  }
};

const handleAuthorizeOrder = async (orderId) => {
  try {
    await workOrderService.updateWorkOrderStatus(orderId, { status: 'autorizada' });
    await loadWorkOrders();
    toast({ title: "Éxito", description: "Orden autorizada" });
  } catch (error) {
    toast({ title: "Error", description: "No se pudo autorizar la orden" });
  }
};
```

**Estado**: ❌ **NO CONECTADO** - Botones placeholder

---

#### 3.4 Reportes y Estadísticas

**Archivo**: `AdminReportsContent.jsx` (Líneas 1-233)

```javascript
// Línea 12-40: Mock chart data
const [chartData, setChartData] = useState({
  plantingTrends: [
    { month: 'Ene', arboles: 120, usuarios: 45 },
    { month: 'Feb', arboles: 150, usuarios: 60 },
    // ... datos inventados
  ],
  roleDistribution: [
    { name: 'Usuarios', value: 1200 },
    { name: 'Empresas', value: 45 },
    // ... datos inventados
  ]
});

// Línea 80-90: Funciones vacías
const handleGenerateReport = () => {
  console.log('Generate report for range:', dateRange);
  // NO HACE NADA
};

const handleDownloadReport = () => {
  console.log('Download report');
  // NO HACE NADA
};
```

**Lo que DEBERÍA hacer**:
```javascript
useEffect(() => {
  loadChartData();
}, [dateRange]);

const loadChartData = async () => {
  try {
    const stats = await statsService.getSystemStats();

    // Transformar datos para gráficos
    setChartData({
      plantingTrends: formatPlantingTrends(stats),
      roleDistribution: formatRoleDistribution(stats),
      // ...
    });
  } catch (error) {
    toast({ title: "Error", description: "No se pudieron cargar las estadísticas" });
  }
};

const handleDownloadReport = async () => {
  try {
    const data = await statsService.generateReport(dateRange);

    // Generar CSV o PDF
    const csv = convertToCSV(data);
    downloadFile(csv, 'reporte-' + Date.now() + '.csv');

    toast({ title: "Éxito", description: "Reporte descargado" });
  } catch (error) {
    toast({ title: "Error", description: "No se pudo generar el reporte" });
  }
};
```

**Estado**: ❌ **NO CONECTADO** - Gráficos estáticos

---

#### 3.5 Moderación de Contenido

**Archivo**: `AdminModerationContent.jsx` (Líneas 1-26)

```javascript
const AdminModerationContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Moderación</h1>
      <p className="text-gray-600 mt-2">Sistema de moderación en desarrollo...</p>
    </div>
  );
};
```

**Estado**: ❌ **PLACEHOLDER COMPLETO** - Nada implementado

**Lo que NECESITA**:
```javascript
const AdminModerationContent = () => {
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlaggedPosts();
  }, []);

  const loadFlaggedPosts = async () => {
    try {
      const data = await moderationService.getAllPosts({ flagged: true });
      setFlaggedPosts(data);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los posts reportados" });
    } finally {
      setLoading(false);
    }
  };

  const handleHidePost = async (postId) => {
    try {
      await moderationService.hidePost(postId);
      await loadFlaggedPosts();
      toast({ title: "Éxito", description: "Post ocultado" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo ocultar el post" });
    }
  };

  const handleDismissReport = async (postId) => {
    try {
      await moderationService.unflagPost(postId);
      await loadFlaggedPosts();
      toast({ title: "Éxito", description: "Reporte descartado" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo descartar el reporte" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-800">Moderación de Contenido</h1>
        <p className="text-gray-600 mt-1">Revisar posts reportados por la comunidad</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger><SelectValue placeholder="Filtrar por..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los reportes</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="resolved">Resueltos</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Lista de Posts Reportados */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      ) : flaggedPosts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay reportes pendientes
            </h3>
            <p className="text-gray-500">
              Todos los contenidos reportados han sido revisados
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {flaggedPosts.map(post => (
            <Card key={post.id} className="border-2 border-orange-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{post.user_name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Reportado {formatDistanceToNow(new Date(post.flagged_at), { locale: es, addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="destructive">Reportado</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {post.image_url && (
                  <img src={post.image_url} alt="Contenido del post" className="rounded-lg max-h-64 mb-4" />
                )}

                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleHidePost(post.id)}
                    className="flex items-center gap-2"
                  >
                    <EyeOff className="h-4 w-4" />
                    Ocultar Post
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleDismissReport(post.id)}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Descartar Reporte
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Prioridad**: 🔴 ALTA

---

#### 3.6 Gestión de Base de Datos

**Archivo**: `AdminDatabaseContent.jsx` (Líneas 1-26)

```javascript
const AdminDatabaseContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Base de Datos</h1>
      <p className="text-gray-600 mt-2">Herramientas de gestión en desarrollo...</p>
    </div>
  );
};
```

**Estado**: ❌ **PLACEHOLDER COMPLETO**

**Prioridad**: 🟢 BAJA (No esencial, requiere cuidado de seguridad)

---

### 🔴 SERVICIOS FALTANTES EN FRONTEND

**Ubicación**: `my-tree-in-the-world-front/src/modules/admin/services/`

**Archivo Existente**: Solo `workOrderService.js` (básico)

**FALTANTES CRÍTICOS**:

#### 3.7.1 `userService.js`
```javascript
// Archivo: src/modules/admin/services/userService.js
import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const userService = {
  async getAllUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`${API_ENDPOINTS.USERS}?${params}`);
    return response.data;
  },

  async getUserById(userId) {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(userId));
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post(API_ENDPOINTS.USERS, userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await api.put(API_ENDPOINTS.USER_BY_ID(userId), userData);
    return response.data;
  },

  async updateUserRole(userId, newRole) {
    const response = await api.put(`${API_ENDPOINTS.USER_BY_ID(userId)}/role`, { role: newRole });
    return response.data;
  },

  async toggleUserActive(userId) {
    const response = await api.put(`${API_ENDPOINTS.USER_BY_ID(userId)}/toggle-active`);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(API_ENDPOINTS.USER_BY_ID(userId));
    return response.data;
  },

  async restoreUser(userId) {
    const response = await api.post(`${API_ENDPOINTS.USER_BY_ID(userId)}/restore`);
    return response.data;
  }
};
```

#### 3.7.2 `statsService.js`
```javascript
// Archivo: src/modules/admin/services/statsService.js
import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const statsService = {
  async getSystemStats() {
    const response = await api.get(API_ENDPOINTS.STATS_SYSTEM);
    return response.data;
  },

  async getPlanterStats(planterId) {
    const response = await api.get(API_ENDPOINTS.STATS_PLANTER(planterId));
    return response.data;
  },

  async getPlantersRanking() {
    const response = await api.get(API_ENDPOINTS.STATS_PLANTERS_RANKING);
    return response.data;
  },

  async getWorkOrderHistory(workOrderId) {
    const response = await api.get(API_ENDPOINTS.STATS_WORK_ORDER_HISTORY(workOrderId));
    return response.data;
  },

  async getWorkOrdersSummary() {
    const response = await api.get(API_ENDPOINTS.STATS_WORK_ORDERS_SUMMARY);
    return response.data;
  },

  async getPhysicalTreesFull() {
    const response = await api.get(API_ENDPOINTS.STATS_PHYSICAL_TREES_FULL);
    return response.data;
  }
};
```

#### 3.7.3 `auditService.js`
```javascript
// Archivo: src/modules/admin/services/auditService.js
import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const auditService = {
  async getAllLogs(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`${API_ENDPOINTS.AUDIT_LOGS}?${params}`);
    return response.data;
  },

  async getLogById(logId) {
    const response = await api.get(`${API_ENDPOINTS.AUDIT_LOGS}/${logId}`);
    return response.data;
  },

  async getRecentLogs(limit = 10) {
    const response = await api.get(`${API_ENDPOINTS.AUDIT_LOGS}?limit=${limit}`);
    return response.data;
  }
};
```

#### 3.7.4 `moderationService.js`
```javascript
// Archivo: src/modules/admin/services/moderationService.js
import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const moderationService = {
  async getAllPosts(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`${API_ENDPOINTS.MODERATION_POSTS}?${params}`);
    return response.data;
  },

  async flagPost(postId) {
    const response = await api.put(`${API_ENDPOINTS.MODERATION_POSTS}/${postId}/flag`);
    return response.data;
  },

  async hidePost(postId) {
    const response = await api.put(`${API_ENDPOINTS.MODERATION_POSTS}/${postId}/hide`);
    return response.data;
  }
};
```

---

## 4. INTEGRACIÓN FRONTEND-BACKEND

### Cambios Necesarios en `api.config.js`

**Archivo**: `my-tree-in-the-world-front/src/core/config/api.config.js`

```javascript
export const API_ENDPOINTS = {
  // ... endpoints existentes ...

  // AGREGAR: Admin Stats
  STATS_SYSTEM: '/stats/system',
  STATS_PLANTER: (id) => `/stats/planter/${id}`,
  STATS_PLANTERS_RANKING: '/stats/planters/ranking',
  STATS_WORK_ORDER_HISTORY: (id) => `/stats/work-order/${id}/history`,
  STATS_WORK_ORDERS_SUMMARY: '/stats/work-orders/summary',
  STATS_PHYSICAL_TREES_FULL: '/stats/physical-trees/full',

  // AGREGAR: Admin Audit
  AUDIT_LOGS: '/audit/logs',
  AUDIT_LOG_BY_ID: (id) => `/audit/logs/${id}`
};
```

---

## 5. PLAN DE IMPLEMENTACIÓN

### FASE 1: CRÍTICO (Implementar YA) - Estimado 12 horas

#### 5.1 Servicios Frontend (3 horas)
- [ ] Crear `userService.js` completo
- [ ] Crear `statsService.js` completo
- [ ] Crear `auditService.js` completo
- [ ] Crear `moderationService.js` completo
- [ ] Actualizar `api.config.js` con endpoints faltantes

#### 5.2 Conectar Dashboard Principal (2 horas)
- [ ] `AdminDashboardContent.jsx`: Conectar estadísticas reales
- [ ] Cargar actividad reciente desde audit logs
- [ ] Conectar alertas (por ahora vacío, fase 2)

#### 5.3 Conectar Gestión de Usuarios (3 horas)
- [ ] `AdminUsersContent.jsx`: Cargar usuarios desde API
- [ ] Implementar toggle de activación funcional
- [ ] Implementar eliminación (soft delete)
- [ ] Implementar edición de usuario (modal)
- [ ] Implementar cambio de rol

#### 5.4 Conectar Gestión de Órdenes (2 horas)
- [ ] `AdminWorkOrdersContent.jsx`: Cargar órdenes desde API
- [ ] Implementar autorización de órdenes
- [ ] Filtros por estado (usar query params)
- [ ] Ver detalles de orden (modal o página)

#### 5.5 Conectar Estadísticas/Reportes (2 horas)
- [ ] `AdminReportsContent.jsx`: Cargar stats reales
- [ ] Transformar datos para gráficos
- [ ] Implementar descarga CSV (conversión básica)
- [ ] Filtro por rango de fechas (backend ya lo soporta)

---

### FASE 2: IMPORTANTE (Implementar Pronto) - Estimado 10 horas

#### 5.6 Implementar UI de Moderación (5 horas)
- [ ] Crear interfaz completa en `AdminModerationContent.jsx`
- [ ] Cargar posts reportados (flagged = true)
- [ ] Botón "Ocultar Post" (hidePost)
- [ ] Botón "Descartar Reporte" (unflagPost)
- [ ] Modal para ver post completo con contexto
- [ ] Filtros: pendientes / resueltos

#### 5.7 Sistema de Alertas de Órdenes Estancadas (4 horas)
- [ ] Backend: Crear `stuckOrderScheduler.js`
- [ ] Detectar órdenes >48h sin plantador
- [ ] Crear notificaciones para admins
- [ ] Frontend: Sección de alertas en dashboard
- [ ] Botón para "Resolver Alerta" (asignar manual o cancelar)

#### 5.8 Aprobación de Perfiles (1 hora)
- [ ] Backend: Endpoint `POST /api/users/:id/verify-profile`
- [ ] Frontend: Sección "Perfiles Pendientes" en dashboard
- [ ] Botones "Aprobar" / "Rechazar" con razón

---

### FASE 3: MEJORABLE (Futuro) - Estimado 15 horas

#### 5.9 Sistema de Reportes Completo (5 horas)
- [ ] Backend: Tabla `content_reports`
- [ ] Backend: Endpoint `POST /api/moderation/report`
- [ ] Backend: Endpoint `GET /api/moderation/reports`
- [ ] Backend: Endpoint `PUT /api/moderation/reports/:id/resolve`
- [ ] Frontend: Formulario de reporte para usuarios
- [ ] Frontend: Dashboard de reportes para admin

#### 5.10 Dashboard de Base de Datos (3 horas)
- [ ] Visualizador de tablas (read-only)
- [ ] Métricas de rendimiento (query times, table sizes)
- [ ] Backup/Restore UI (solo trigger, ejecución manual)

#### 5.11 Analytics Avanzado (4 horas)
- [ ] Gráficos de tendencias (plantings por mes)
- [ ] Mapa de calor de actividad
- [ ] Métricas de engagement
- [ ] Exportar a PDF (no solo CSV)

#### 5.12 Notificaciones Email (3 horas)
- [ ] Integración con servicio de email (SendGrid, SES)
- [ ] Template de email para alertas críticas
- [ ] Configuración de notificaciones por admin

---

## 6. RESUMEN DE GAPS

| Componente | Backend | Frontend | Integración | Prioridad |
|------------|---------|----------|-------------|-----------|
| **Dashboard Estadísticas** | ✅ 100% | ⚠️ UI Only | ❌ 0% | 🔴 CRÍTICO |
| **Gestión Usuarios** | ✅ 100% | ⚠️ UI Only | ❌ 0% | 🔴 CRÍTICO |
| **Gestión Órdenes** | ✅ 100% | ⚠️ UI Only | ❌ 0% | 🔴 CRÍTICO |
| **Autorización Órdenes** | ✅ 100% | ⚠️ UI Only | ❌ 0% | 🔴 CRÍTICO |
| **Audit Logs** | ✅ 100% | ❌ Sin UI | ❌ 0% | 🟡 MEDIO |
| **Estadísticas/Reportes** | ✅ 100% | ⚠️ Mock Charts | ❌ 0% | 🔴 CRÍTICO |
| **Moderación Contenido** | ⚠️ 60% | ❌ Placeholder | ❌ 0% | 🟡 MEDIO |
| **Alertas Vivero Timeout** | ✅ 100% | ❌ Sin UI | ❌ 0% | 🟡 MEDIO |
| **Alertas Órdenes 48h** | ❌ 0% | ❌ 0% | ❌ 0% | 🟡 MEDIO |
| **Aprobación Perfiles** | ⚠️ Workaround | ❌ Sin UI | ❌ 0% | 🟢 BAJO |
| **Sistema Reportes Completo** | ❌ 0% | ❌ 0% | ❌ 0% | 🟢 BAJO |
| **Database Management** | ✅ SQL directo | ❌ Placeholder | ❌ 0% | 🟢 BAJO |

---

## 7. CÓDIGO DE EJEMPLO PARA INTEGRACIÓN

### Ejemplo: Conectar AdminDashboardContent.jsx

**ANTES** (Mock):
```javascript
const [stats, setStats] = useState({
  totalUsers: 1234,
  totalTrees: 5678,
  // ... hardcoded
});
```

**DESPUÉS** (Conectado):
```javascript
// 1. Importar servicio
import statsService from '@/modules/admin/services/statsService';
import auditService from '@/modules/admin/services/auditService';

const AdminDashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar en paralelo
      const [systemStats, auditLogs] = await Promise.all([
        statsService.getSystemStats(),
        auditService.getRecentLogs(10)
      ]);

      // Transformar datos para UI
      setStats({
        totalUsers: systemStats.users_by_role.reduce((sum, r) => sum + r.count, 0),
        totalTrees: systemStats.trees_by_status.reduce((sum, t) => sum + t.count, 0),
        totalWorkOrders: systemStats.work_orders_by_status.reduce((sum, w) => sum + w.count, 0),
        totalCompanies: systemStats.users_by_role.find(r => r.role === 'company')?.count || 0,
        monthlyRevenue: 0, // Calcular desde órdenes completadas
        systemHealth: 98 // Placeholder por ahora
      });

      // Formatear actividad reciente
      setRecentActivity(auditLogs.map(log => ({
        id: log.id,
        type: log.event_type,
        description: log.event_description,
        timestamp: log.created_at,
        user: log.user_name || 'Sistema'
      })));

    } catch (error) {
      console.error('Error cargando dashboard:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // ... resto del componente igual, pero ahora con datos reales
};
```

---

## 8. TESTING CHECKLIST

### Backend Testing

- [ ] `GET /api/users` retorna lista completa (admin token)
- [ ] `PUT /api/users/:id/toggle-active` cambia is_active
- [ ] `DELETE /api/users/:id` hace soft delete (deleted_at != NULL)
- [ ] `POST /api/users/:id/restore` limpia deleted_at
- [ ] `GET /api/stats/system` retorna stats correctas
- [ ] `GET /api/audit/logs` retorna logs con paginación
- [ ] `GET /api/moderation/posts?flagged=true` retorna posts reportados
- [ ] `PUT /api/moderation/posts/:id/hide` oculta post (is_hidden = TRUE)
- [ ] `PUT /api/work-orders/:id` con status=autorizada guarda authorized_by
- [ ] Vivero timeout scheduler ejecuta cada 1 minuto

### Frontend Testing

Después de implementar integraciones:

- [ ] Admin dashboard muestra estadísticas reales
- [ ] Tabla de usuarios carga desde API
- [ ] Botón "Desactivar" realmente desactiva usuario
- [ ] Botón "Eliminar" hace soft delete y desaparece de lista
- [ ] Filtros de órdenes funcionan (status query param)
- [ ] Autorizar orden cambia estado a "autorizada"
- [ ] Gráficos de reportes muestran datos reales
- [ ] Moderación carga posts reportados
- [ ] Ocultar post lo marca como hidden
- [ ] Toasts de éxito/error funcionan correctamente

---

## 9. ESTRUCTURA DE ARCHIVOS RECOMENDADA

```
my-tree-in-the-world-front/
└── src/
    └── modules/
        └── admin/
            ├── pages/
            │   └── AdminDashboard.jsx           ✅ Existe
            │
            ├── components/
            │   └── dashboard/
            │       ├── AdminDashboardContent.jsx    ⚠️ Desconcertado
            │       ├── AdminUsersContent.jsx        ⚠️ Desconectado
            │       ├── AdminWorkOrdersContent.jsx   ⚠️ Desconectado
            │       ├── AdminTreesContent.jsx        ⚠️ Desconectado
            │       ├── AdminReportsContent.jsx      ⚠️ Desconectado
            │       ├── AdminModerationContent.jsx   ❌ Placeholder
            │       └── AdminDatabaseContent.jsx     ❌ Placeholder
            │
            └── services/
                ├── workOrderService.js          ✅ Existe (básico)
                ├── userService.js               ❌ CREAR
                ├── statsService.js              ❌ CREAR
                ├── auditService.js              ❌ CREAR
                └── moderationService.js         ❌ CREAR
```

---

## 10. CONCLUSIÓN

### Estado Actual

**Backend**: Sistema robusto y bien arquitectado. API completa, autorización funcional, audit trail exhaustivo, schedulers automáticos corriendo. Solo faltan alertas de órdenes estancadas.

**Frontend**: UI hermosa y completa, pero completamente desconectada. Es una demo funcional sin datos reales.

**Gap Crítico**: La integración entre frontend y backend es prácticamente inexistente en el módulo admin.

### Esfuerzo de Implementación

| Fase | Horas | Prioridad | Descripción |
|------|-------|-----------|-------------|
| **Fase 1** | 12h | 🔴 CRÍTICO | Conectar UI existente con API |
| **Fase 2** | 10h | 🟡 IMPORTANTE | Moderación y alertas |
| **Fase 3** | 15h | 🟢 FUTURO | Features avanzados |
| **TOTAL** | 37h | - | Implementación completa |

### Próximos Pasos

1. **INMEDIATO**: Crear los 4 servicios faltantes (3 horas)
2. **CRÍTICO**: Conectar dashboard y usuarios (5 horas)
3. **CRÍTICO**: Conectar órdenes y reportes (4 horas)
4. **IMPORTANTE**: Implementar UI de moderación (5 horas)
5. **IMPORTANTE**: Sistema de alertas (4 horas)

### Impacto

Una vez completada **Fase 1** (12 horas):
- Admin podrá gestionar usuarios realmente
- Dashboard mostrará métricas en tiempo real
- Autorización de órdenes será funcional
- Reportes tendrán datos reales

El sistema pasará de ser una **demo bonita** a una **herramienta administrativa funcional**.

---

**Documento generado**: 2025-01-10
**Autor**: Análisis de Claude Code
**Versión**: 1.0
