# 💼 VALIDACIÓN ROL EMPRESA - My Tree in the World

**Fecha:** 2025-11-10
**Estado:** ANÁLISIS COMPLETADO
**Nivel de implementación:** ~40% (frontend mockups listos, backend parcial)

---

## 📋 RESUMEN EJECUTIVO

El rol **Empresa** tiene una arquitectura frontend **casi completa** con interfaces bien diseñadas, pero la mayoría son **mockups sin conexión a backend**. El backend tiene implementaciones parciales clave como la calculadora de carbono y proyectos colaborativos, pero le faltan features críticas como el sistema de sorteo de cupones, gestión de empleados y facturación.

### ✅ Lo que SÍ funciona:
- Calculadora de carbono (backend completo)
- Proyectos colaborativos (creación y contribución)
- Plantación de árboles individuales
- Servicios API básicos

### ⚠️ Lo que es mockup (UI lista, sin backend):
- Dashboard de estadísticas
- Reportes y certificados
- Gestión de equipo/empleados
- Historial de facturación
- Rankings corporativos

### ❌ Lo que falta completamente:
- Ejecución del sorteo de cupones
- Plantación masiva con descuentos por volumen
- Compensación automática (planes recurrentes)
- Generación de facturas B/C
- Sistema de badges y logros

---

## 🎯 FEATURES POR CATEGORÍA

### 1. CALCULADORA DE HUELLA DE CARBONO

#### ✅ Backend: 70% Completado

**Archivo:** `my-tree-in-the-world-back/src/controllers/carbonController.js`

**Endpoints implementados:**
```javascript
GET /api/carbon/config              // Obtener factores de emisión
POST /api/carbon/calculate          // Calcular CO₂
```

**Líneas 39-107:** Función `calculateCarbon`
```javascript
// Factores soportados (línea 48-54):
- electricity: Electricidad (kWh)
- gas: Gas natural (m³)
- vehicle: Transporte vehicular (km)
- flight: Vuelos (km)
- waste: Residuos (kg)
- paper: Papel (kg)
- employees: Empleados (número)
```

**Fórmula:** (línea 87-91)
```javascript
const totalCO2 = (
  electricity * electricityFactor +
  gas * gasFactor +
  ...
);
const treesNeeded = Math.ceil(totalCO2 / treeAbsorption);
```

**Base de datos:** Tabla `carbon_config` existe (schema.sql líneas 100-112)

#### ⚠️ Frontend: 40% Completado

**Archivo:** `my-tree-in-the-world-front/src/modules/company/components/dashboard/CompanyCarbonContent.jsx`

**Problema crítico (líneas 16-30):**
```javascript
// HARDCODED - No usa el backend API
const calculateEmissions = () => {
  const kwh = parseInt(formData.electricity) || 0;
  const km = parseInt(formData.transport) || 0;
  const flights = parseInt(formData.travel) || 0;

  // Factores hardcodeados (deberían venir de API)
  const co2 = (kwh * 0.5) + (km * 0.2) + (flights * 0.15);
  const trees = Math.ceil(co2 / 21.77);

  setResults({ co2, trees });
};
```

**Lo que falta:**
```javascript
// Debería ser:
const calculateEmissions = async () => {
  const result = await carbonService.calculate({
    electricity: formData.electricity,
    gas: formData.gas,
    vehicle: formData.transport,
    flight: formData.travel,
    waste: formData.waste,
    paper: formData.paper,
    employees: formData.employees
  });
  setResults(result);
};
```

**Missing inputs:** (líneas 57-92)
- ❌ Gas (m³) - documentación lo menciona
- ❌ Agua (m³) - documentación lo menciona
- ❌ Residuos (kg)
- ❌ Papel (kg)

**Service existe pero no se usa:** `carbonService.js` (25 líneas)

---

### 2. PLANTACIÓN DE ÁRBOLES CORPORATIVOS

#### ✅ Opción A: Árbol Individual - FUNCIONA

**Backend:** `treeService.createTree()` - completamente funcional
**Frontend:** Flujo de compra estándar implementado
**Estado:** ✅ Operativo

#### ❌ Opción B: Plantación Masiva (10-10,000+ árboles) - NO EXISTE

**Documentación especifica:**
```
Descuentos por volumen:
- 10-50 árboles: 5% descuento
- 51-100 árboles: 10% descuento
- 101-500 árboles: 15% descuento
- 501+ árboles: 20% descuento
```

**Realidad:**
```bash
grep -r "bulk" backend/   # 0 resultados
grep -r "volume_discount" backend/   # 0 resultados
grep -r "descuento" backend/   # 0 resultados
```

**Lo que falta implementar:**

1. **Nueva tabla de base de datos:**
```sql
CREATE TABLE bulk_pricing_tiers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  min_quantity INT NOT NULL,
  max_quantity INT,
  discount_percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO bulk_pricing_tiers (min_quantity, max_quantity, discount_percentage) VALUES
(10, 50, 5.00),
(51, 100, 10.00),
(101, 500, 15.00),
(501, NULL, 20.00);
```

2. **Nuevo endpoint backend:**
```javascript
// src/controllers/treeController.js

exports.createBulkOrder = async (req, res) => {
  const { quantity, species_id, locations } = req.body;
  const companyId = req.user.id;

  // 1. Validar que sea empresa
  if (req.user.role !== 'company') {
    return res.status(403).json({ error: 'Solo empresas pueden hacer pedidos masivos' });
  }

  // 2. Calcular descuento
  const [tiers] = await db.query(
    'SELECT discount_percentage FROM bulk_pricing_tiers WHERE min_quantity <= ? AND (max_quantity IS NULL OR max_quantity >= ?)',
    [quantity, quantity]
  );
  const discountPercentage = tiers[0]?.discount_percentage || 0;

  // 3. Obtener precio base
  const [tree] = await db.query('SELECT base_price FROM tree_catalog WHERE id = ?', [species_id]);
  const basePrice = tree[0].base_price;

  // 4. Calcular precios
  const subtotal = basePrice * quantity;
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;

  // 5. Crear work orders en lote
  const workOrders = [];
  for (let i = 0; i < quantity; i++) {
    // Crear work order para cada árbol
    // Asignar ubicación rotativa si hay múltiples
    const location = locations[i % locations.length];
    // ...
  }

  return res.json({
    order_id: bulkOrderId,
    quantity,
    discount_percentage: discountPercentage,
    discount_amount: discountAmount,
    subtotal,
    total,
    work_orders: workOrders
  });
};
```

3. **Rutas:**
```javascript
// src/routes/tree.routes.js
router.post('/bulk', auth, roleCheck(['company']), treeController.createBulkOrder);
router.get('/bulk-pricing', treeController.getBulkPricingTiers);
```

4. **Frontend UI:**
```jsx
// Nuevo componente: CompanyBulkPurchaseContent.jsx
const CompanyBulkPurchaseContent = () => {
  const [quantity, setQuantity] = useState(10);
  const [species, setSpecies] = useState(null);
  const [pricing, setPricing] = useState(null);

  // Calcular precio en tiempo real
  useEffect(() => {
    const calculatePricing = async () => {
      const result = await treeService.calculateBulkPricing(quantity, species);
      setPricing(result);
    };
    if (quantity >= 10 && species) {
      calculatePricing();
    }
  }, [quantity, species]);

  return (
    <div>
      <input
        type="number"
        min="10"
        max="10000"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      {pricing && (
        <div className="pricing-breakdown">
          <p>Subtotal: ${pricing.subtotal.toLocaleString()}</p>
          {pricing.discount_percentage > 0 && (
            <>
              <p className="discount">
                Descuento {pricing.discount_percentage}%:
                -${pricing.discount_amount.toLocaleString()}
              </p>
              <Badge variant="success">
                ¡Ahorrás ${pricing.discount_amount.toLocaleString()}!
              </Badge>
            </>
          )}
          <p className="total">Total: ${pricing.total.toLocaleString()}</p>
        </div>
      )}

      <Button onClick={handleBulkPurchase}>
        Comprar {quantity} árboles
      </Button>
    </div>
  );
};
```

**Estimación:** 8 horas de implementación

---

### 3. PROYECTOS COLABORATIVOS CON SORTEO DE CUPONES

#### ✅ Backend: 95% Completado (Creación)

**Archivo:** `my-tree-in-the-world-back/src/controllers/collaborativeTreeController.js`

**Endpoints implementados:**
```javascript
POST /api/collaborative-trees      // Crear proyecto
GET /api/collaborative-trees       // Listar proyectos
POST /api/collaborative-trees/:id/contribute  // Aportar
GET /api/collaborative-trees/:id   // Ver detalles
```

**Funcionalidad clave (líneas 74-92):**
```javascript
// Empresas pueden crear proyectos ilimitados
if (req.user.role === 'company') {
  // Sin límite de proyectos activos
} else if (req.user.role === 'user') {
  // Validar que no tenga más de 1 proyecto activo
  const [activeProjects] = await connection.query(
    'SELECT COUNT(*) as count FROM collaborative_trees WHERE creator_id = ? AND status = ?',
    [creatorId, 'active']
  );
  if (activeProjects[0].count >= 1) {
    return res.status(400).json({ error: 'Solo puedes tener 1 proyecto activo a la vez' });
  }
}
```

**Aporte mínimo diferenciado (líneas 104-124):**
```javascript
// Empresas: mínimo 30% del total
const minContributionCompany = targetAmount * 0.30;

// Usuarios: mínimo 5% del total
const minContributionUser = targetAmount * 0.05;
```

**Configuración de sorteo soportada (líneas 174-186):**
```javascript
// Se guarda en tabla coupon_raffle_config:
{
  collaborative_tree_id: treeId,
  num_winners: req.body.raffle_config.num_winners,
  discount_percentage: req.body.raffle_config.discount_percentage,
  discount_fixed_amount: req.body.raffle_config.discount_fixed_amount,
  applicable_products: req.body.raffle_config.applicable_products,
  validity_days: req.body.raffle_config.validity_days,
  min_purchase_amount: req.body.raffle_config.min_purchase_amount,
  raffle_status: 'pending'
}
```

**Base de datos completa:**
```sql
-- schema.sql líneas 298-421

CREATE TABLE collaborative_trees (...);       // ✅ Existe
CREATE TABLE tree_contributions (...);        // ✅ Existe
CREATE TABLE coupon_raffle_config (...);      // ✅ Existe
CREATE TABLE raffle_winners (...);            // ✅ Existe
```

#### ❌ Sistema de Sorteo: NO IMPLEMENTADO

**Lo que falta:**

1. **Endpoint para ejecutar sorteo:**
```javascript
// src/controllers/raffleController.js (NUEVO ARCHIVO)

exports.executeRaffle = async (req, res) => {
  const { id } = req.params; // collaborative_tree_id

  try {
    // 1. Verificar que el proyecto está al 100%
    const [project] = await db.query(
      'SELECT * FROM collaborative_trees WHERE id = ? AND status = ?',
      [id, 'completed']
    );

    if (project.length === 0) {
      return res.status(400).json({ error: 'Proyecto no completado' });
    }

    // 2. Obtener configuración del sorteo
    const [config] = await db.query(
      'SELECT * FROM coupon_raffle_config WHERE collaborative_tree_id = ? AND raffle_status = ?',
      [id, 'pending']
    );

    if (config.length === 0) {
      return res.status(400).json({ error: 'Sorteo ya ejecutado o no configurado' });
    }

    const { num_winners, discount_percentage, validity_days } = config[0];

    // 3. Obtener todos los contribuidores y sus tickets
    const [contributions] = await db.query(
      'SELECT contributor_id, contribution_amount FROM tree_contributions WHERE collaborative_tree_id = ?',
      [id]
    );

    // 4. Generar tickets (1 ARS = 1 ticket)
    const tickets = [];
    contributions.forEach(contrib => {
      const numTickets = Math.floor(contrib.contribution_amount);
      for (let i = 0; i < numTickets; i++) {
        tickets.push({
          userId: contrib.contributor_id,
          ticketNumber: tickets.length + 1
        });
      }
    });

    // 5. Seleccionar ganadores aleatorios
    const winners = [];
    const selectedTickets = new Set();

    while (winners.length < num_winners && tickets.length > 0) {
      const randomIndex = Math.floor(Math.random() * tickets.length);
      const winningTicket = tickets[randomIndex];

      if (!selectedTickets.has(winningTicket.ticketNumber)) {
        selectedTickets.add(winningTicket.ticketNumber);
        winners.push(winningTicket);

        // Generar cupón único
        const couponCode = generateCouponCode();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + validity_days);

        // Guardar ganador y cupón
        await db.query(
          `INSERT INTO raffle_winners
           (collaborative_tree_id, user_id, ticket_number, coupon_code, discount_percentage, expires_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, winningTicket.userId, winningTicket.ticketNumber, couponCode, discount_percentage, expiresAt]
        );

        // Notificar al ganador
        await notificationService.sendRaffleWinnerEmail(winningTicket.userId, {
          project: project[0],
          couponCode,
          discount: discount_percentage,
          expiresAt
        });
      }
    }

    // 6. Actualizar estado del sorteo
    await db.query(
      'UPDATE coupon_raffle_config SET raffle_status = ?, executed_at = NOW() WHERE collaborative_tree_id = ?',
      ['executed', id]
    );

    // 7. Enviar certificado de colaboración a todos los contribuidores (incluso no ganadores)
    for (const contrib of contributions) {
      await notificationService.sendCollaborationCertificate(contrib.contributor_id, project[0]);
    }

    return res.json({
      message: 'Sorteo ejecutado exitosamente',
      total_tickets: tickets.length,
      total_contributors: contributions.length,
      winners: winners.length,
      raffle_id: config[0].id
    });

  } catch (error) {
    console.error('Error ejecutando sorteo:', error);
    res.status(500).json({ error: 'Error al ejecutar sorteo' });
  }
};

// Función auxiliar para generar códigos únicos
function generateCouponCode() {
  return `BOSQUE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
```

2. **Endpoint para ver resultados:**
```javascript
exports.getRaffleResults = async (req, res) => {
  const { id } = req.params;

  const [winners] = await db.query(
    `SELECT
      rw.*,
      u.first_name,
      u.last_name,
      tc.contribution_amount
    FROM raffle_winners rw
    JOIN users u ON rw.user_id = u.id
    JOIN tree_contributions tc ON tc.contributor_id = u.id AND tc.collaborative_tree_id = rw.collaborative_tree_id
    WHERE rw.collaborative_tree_id = ?
    ORDER BY rw.created_at`,
    [id]
  );

  return res.json({ winners });
};

exports.getMyRaffleWins = async (req, res) => {
  const userId = req.user.id;

  const [wins] = await db.query(
    `SELECT
      rw.*,
      ct.title as project_title,
      ct.company_name
    FROM raffle_winners rw
    JOIN collaborative_trees ct ON rw.collaborative_tree_id = ct.id
    WHERE rw.user_id = ? AND rw.expires_at > NOW()
    ORDER BY rw.created_at DESC`,
    [userId]
  );

  return res.json({ coupons: wins });
};
```

3. **Rutas:**
```javascript
// src/routes/raffle.routes.js (NUEVO ARCHIVO)
const express = require('express');
const router = express.Router();
const raffleController = require('../controllers/raffleController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/:id/execute', auth, roleCheck(['company', 'admin']), raffleController.executeRaffle);
router.get('/:id/results', auth, raffleController.getRaffleResults);
router.get('/my-coupons', auth, raffleController.getMyRaffleWins);

module.exports = router;
```

4. **Webhook automático:**
```javascript
// En collaborativeTreeController.js, al completarse el proyecto:

// Línea ~500 (al llegar al 100% del funding)
if (newProgress >= 100) {
  await connection.query(
    'UPDATE collaborative_trees SET status = ?, completed_at = ? WHERE id = ?',
    ['completed', new Date(), id]
  );

  // NUEVO: Ejecutar sorteo automáticamente
  const [raffleConfig] = await connection.query(
    'SELECT * FROM coupon_raffle_config WHERE collaborative_tree_id = ? AND raffle_status = ?',
    [id, 'pending']
  );

  if (raffleConfig.length > 0) {
    // Trigger sorteo asíncrono
    setTimeout(() => {
      raffleController.executeRaffle({ params: { id }, user: req.user }, {
        json: () => {},
        status: () => ({ json: () => {} })
      });
    }, 5000); // 5 segundos de delay
  }
}
```

5. **Frontend: Mis cupones ganados**
```jsx
// src/modules/user/components/MyCouponsContent.jsx (NUEVO)

const MyCouponsContent = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const loadCoupons = async () => {
      const result = await raffleService.getMyCoupons();
      setCoupons(result.coupons);
    };
    loadCoupons();
  }, []);

  return (
    <div>
      <h1>Mis Cupones Ganados</h1>
      {coupons.length === 0 ? (
        <EmptyState message="No has ganado cupones aún" />
      ) : (
        coupons.map(coupon => (
          <CouponCard key={coupon.id}>
            <div className="coupon-header">
              <h3>{coupon.project_title}</h3>
              <Badge>{coupon.discount_percentage}% OFF</Badge>
            </div>
            <div className="coupon-body">
              <p className="code">{coupon.coupon_code}</p>
              <p>Válido hasta: {new Date(coupon.expires_at).toLocaleDateString()}</p>
              <Button onClick={() => copyCouponCode(coupon.coupon_code)}>
                Copiar código
              </Button>
            </div>
          </CouponCard>
        ))
      )}
    </div>
  );
};
```

**Estimación:** 12 horas de implementación

---

### 4. COMPENSACIÓN AUTOMÁTICA

#### ❌ Completamente NO IMPLEMENTADO

**Documentación describe:**
```
- Activar plan mensual/trimestral/anual
- % compensación: 25%, 50%, 100%
- Sistema planta automáticamente según huella
```

**Búsqueda en codebase:**
```bash
grep -r "automatic_compensation" .   # 0 resultados
grep -r "subscription_plan" .        # 0 resultados
grep -r "recurring" .                # 0 resultados
```

**Lo que se necesita implementar:**

1. **Nueva tabla:**
```sql
CREATE TABLE company_compensation_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT NOT NULL,
  plan_type ENUM('monthly', 'quarterly', 'annual') NOT NULL,
  compensation_percentage INT NOT NULL, -- 25, 50, 100
  is_active BOOLEAN DEFAULT TRUE,
  last_execution_date DATE,
  next_execution_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES users(id)
);
```

2. **Scheduler (cron job):**
```javascript
// src/schedulers/compensationPlanScheduler.js (NUEVO)

const cron = require('node-cron');
const db = require('../config/database');

// Ejecutar todos los días a las 2 AM
const runCompensationPlans = async () => {
  console.log('🌳 Ejecutando planes de compensación automática...');

  const [plans] = await db.query(
    `SELECT cp.*, u.company_name
     FROM company_compensation_plans cp
     JOIN users u ON cp.company_id = u.id
     WHERE cp.is_active = TRUE
     AND cp.next_execution_date <= CURDATE()`
  );

  for (const plan of plans) {
    try {
      // 1. Calcular huella del período
      const startDate = plan.last_execution_date || new Date(plan.created_at);
      const endDate = new Date();

      const footprint = await calculateCompanyFootprint(plan.company_id, startDate, endDate);

      // 2. Calcular árboles necesarios según % de compensación
      const co2ToCompensate = footprint.total_co2 * (plan.compensation_percentage / 100);
      const treesNeeded = Math.ceil(co2ToCompensate / 21.77);

      // 3. Crear work orders automáticos
      for (let i = 0; i < treesNeeded; i++) {
        await createAutomaticWorkOrder({
          company_id: plan.company_id,
          compensation_plan_id: plan.id,
          tree_species: 'native', // Especie por defecto
          co2_amount: 21.77
        });
      }

      // 4. Actualizar plan
      const nextDate = calculateNextExecutionDate(plan.plan_type, endDate);
      await db.query(
        `UPDATE company_compensation_plans
         SET last_execution_date = ?, next_execution_date = ?
         WHERE id = ?`,
        [endDate, nextDate, plan.id]
      );

      // 5. Enviar notificación a la empresa
      await sendCompensationNotification(plan.company_id, {
        trees_planted: treesNeeded,
        co2_compensated: co2ToCompensate,
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      });

      console.log(`✅ Plan ejecutado: ${plan.company_name} - ${treesNeeded} árboles`);

    } catch (error) {
      console.error(`❌ Error en plan ${plan.id}:`, error);
    }
  }
};

// Ejecutar diariamente a las 2:00 AM
cron.schedule('0 2 * * *', runCompensationPlans);

module.exports = { runCompensationPlans };
```

3. **Controller:**
```javascript
// src/controllers/compensationPlanController.js (NUEVO)

exports.createPlan = async (req, res) => {
  const companyId = req.user.id;
  const { plan_type, compensation_percentage } = req.body;

  // Validar que sea empresa
  if (req.user.role !== 'company') {
    return res.status(403).json({ error: 'Solo empresas pueden crear planes de compensación' });
  }

  // Calcular primera fecha de ejecución
  const nextDate = calculateNextExecutionDate(plan_type, new Date());

  const [result] = await db.query(
    `INSERT INTO company_compensation_plans
     (company_id, plan_type, compensation_percentage, next_execution_date)
     VALUES (?, ?, ?, ?)`,
    [companyId, plan_type, compensation_percentage, nextDate]
  );

  return res.json({
    message: 'Plan de compensación activado',
    plan_id: result.insertId,
    next_execution: nextDate
  });
};

exports.getMyPlan = async (req, res) => {
  const companyId = req.user.id;

  const [plan] = await db.query(
    'SELECT * FROM company_compensation_plans WHERE company_id = ? AND is_active = TRUE',
    [companyId]
  );

  return res.json({ plan: plan[0] || null });
};

exports.deactivatePlan = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.id;

  await db.query(
    'UPDATE company_compensation_plans SET is_active = FALSE WHERE id = ? AND company_id = ?',
    [id, companyId]
  );

  return res.json({ message: 'Plan desactivado' });
};
```

**Estimación:** 16 horas de implementación

---

### 5. GESTIÓN DE EMPLEADOS

#### ❌ Completamente NO IMPLEMENTADO

**Frontend mockup existe:** `CompanyTeamContent.jsx` (162 líneas de código mock)

**Líneas 6-37:** Datos de prueba hardcodeados
```javascript
const mockTeam = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@empresa.com',
    role: 'Gerente de Sustentabilidad',
    trees_planted: 45,
    status: 'active'
  },
  // ... más datos mock
];
```

**Lo que se necesita implementar:**

1. **Nueva tabla:**
```sql
CREATE TABLE company_employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT NOT NULL,
  employee_user_id INT, -- NULL si aún no aceptó la invitación
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  position VARCHAR(150),
  monthly_tree_limit INT DEFAULT 5,
  status ENUM('pending_invitation', 'active', 'inactive') DEFAULT 'pending_invitation',
  invitation_token VARCHAR(255),
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  FOREIGN KEY (company_id) REFERENCES users(id),
  FOREIGN KEY (employee_user_id) REFERENCES users(id)
);
```

2. **Controller:**
```javascript
// src/controllers/companyTeamController.js (NUEVO)

exports.inviteEmployee = async (req, res) => {
  const companyId = req.user.id;
  const { email, first_name, last_name, position, monthly_tree_limit } = req.body;

  // Generar token de invitación
  const invitationToken = crypto.randomBytes(32).toString('hex');

  // Crear registro de empleado
  const [result] = await db.query(
    `INSERT INTO company_employees
     (company_id, email, first_name, last_name, position, monthly_tree_limit, invitation_token)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [companyId, email, first_name, last_name, position, monthly_tree_limit, invitationToken]
  );

  // Enviar email de invitación
  await emailService.sendEmployeeInvitation({
    to: email,
    company_name: req.user.company_name,
    invitation_link: `${process.env.FRONTEND_URL}/employee/accept-invitation/${invitationToken}`,
    monthly_tree_limit
  });

  return res.json({
    message: 'Invitación enviada',
    employee_id: result.insertId
  });
};

exports.acceptInvitation = async (req, res) => {
  const { token } = req.params;
  const userId = req.user.id;

  // Buscar invitación
  const [invitation] = await db.query(
    'SELECT * FROM company_employees WHERE invitation_token = ? AND status = ?',
    [token, 'pending_invitation']
  );

  if (invitation.length === 0) {
    return res.status(404).json({ error: 'Invitación no encontrada o ya aceptada' });
  }

  // Actualizar empleado
  await db.query(
    `UPDATE company_employees
     SET employee_user_id = ?, status = ?, accepted_at = NOW()
     WHERE invitation_token = ?`,
    [userId, 'active', token]
  );

  return res.json({
    message: 'Invitación aceptada',
    company_id: invitation[0].company_id
  });
};

exports.getMyTeam = async (req, res) => {
  const companyId = req.user.id;

  const [team] = await db.query(
    `SELECT
      ce.*,
      u.email as user_email,
      COUNT(t.id) as trees_planted
    FROM company_employees ce
    LEFT JOIN users u ON ce.employee_user_id = u.id
    LEFT JOIN trees t ON t.planted_by = ce.employee_user_id
      AND t.company_id = ce.company_id
      AND MONTH(t.created_at) = MONTH(CURRENT_DATE())
    WHERE ce.company_id = ?
    GROUP BY ce.id`,
    [companyId]
  );

  return res.json({ team });
};

exports.updateEmployeeLimit = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.id;
  const { monthly_tree_limit } = req.body;

  await db.query(
    'UPDATE company_employees SET monthly_tree_limit = ? WHERE id = ? AND company_id = ?',
    [monthly_tree_limit, id, companyId]
  );

  return res.json({ message: 'Límite actualizado' });
};
```

3. **Middleware para validar límite:**
```javascript
// src/middleware/employeeTreeLimit.js (NUEVO)

module.exports = async (req, res, next) => {
  const userId = req.user.id;

  // Verificar si el usuario es empleado de alguna empresa
  const [employment] = await db.query(
    'SELECT * FROM company_employees WHERE employee_user_id = ? AND status = ?',
    [userId, 'active']
  );

  if (employment.length > 0) {
    const emp = employment[0];

    // Contar árboles plantados este mes
    const [count] = await db.query(
      `SELECT COUNT(*) as planted
       FROM trees
       WHERE planted_by = ?
       AND company_id = ?
       AND MONTH(created_at) = MONTH(CURRENT_DATE())`,
      [userId, emp.company_id]
    );

    if (count[0].planted >= emp.monthly_tree_limit) {
      return res.status(403).json({
        error: 'Límite mensual alcanzado',
        message: `Has alcanzado tu límite de ${emp.monthly_tree_limit} árboles este mes`
      });
    }

    req.employee_info = emp;
  }

  next();
};
```

**Estimación:** 14 horas de implementación

---

### 6. REPORTES Y CERTIFICACIONES

#### ⚠️ Frontend Mockup Completo, Backend 0%

**Frontend:** `CompanyReportsContent.jsx` (150 líneas)

**Líneas 5-33:** Reportes hardcodeados
```javascript
const mockReports = [
  {
    id: 1,
    month: 'Noviembre 2024',
    trees_planted: 127,
    co2_offset: 2.76,
    team_participation: 89,
    ranking_position: 15,
    certificates: ['Carbono Neutral', 'Top 50']
  },
  // ... más datos mock
];
```

**Lo que se necesita implementar:**

1. **Generación de reportes PDF:**
```javascript
// src/services/reportGenerator.js (NUEVO)

const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generateMonthlyReport = async (companyId, year, month) => {
  // 1. Obtener datos del mes
  const [trees] = await db.query(
    `SELECT COUNT(*) as total, SUM(co2_offset) as total_co2
     FROM trees
     WHERE company_id = ?
     AND YEAR(planted_date) = ?
     AND MONTH(planted_date) = ?`,
    [companyId, year, month]
  );

  const [company] = await db.query('SELECT * FROM users WHERE id = ?', [companyId]);

  const [ranking] = await db.query(
    `SELECT
      (SELECT COUNT(*) + 1 FROM v_company_ranking WHERE trees_planted > c.trees_planted) as position
     FROM v_company_ranking c
     WHERE c.company_id = ?`,
    [companyId]
  );

  // 2. Crear PDF
  const doc = new PDFDocument();
  const filename = `reporte_${company[0].company_name}_${year}_${month}.pdf`;
  const filepath = `./reports/${filename}`;

  doc.pipe(fs.createWriteStream(filepath));

  // Header
  doc.fontSize(25).text('Reporte Mensual de Sustentabilidad', { align: 'center' });
  doc.fontSize(12).text(company[0].company_name, { align: 'center' });
  doc.fontSize(10).text(`${getMonthName(month)} ${year}`, { align: 'center' });
  doc.moveDown();

  // Estadísticas
  doc.fontSize(16).text('Impacto Ambiental', { underline: true });
  doc.fontSize(12).text(`Árboles plantados: ${trees[0].total}`);
  doc.text(`CO₂ compensado: ${trees[0].total_co2.toFixed(2)} toneladas`);
  doc.text(`Posición en ranking: #${ranking[0].position}`);
  doc.moveDown();

  // Certificaciones
  doc.fontSize(16).text('Certificaciones', { underline: true });
  if (trees[0].total >= 100) {
    doc.text('✓ Bosque Maduro (100+ árboles)');
  }
  // ... más badges

  doc.end();

  return filepath;
};
```

2. **Controller:**
```javascript
// src/controllers/reportController.js (NUEVO)

exports.generateMonthlyReport = async (req, res) => {
  const companyId = req.user.id;
  const { year, month } = req.params;

  try {
    const filepath = await reportGenerator.generateMonthlyReport(companyId, year, month);

    // Enviar PDF
    res.download(filepath, (err) => {
      if (!err) {
        fs.unlinkSync(filepath); // Eliminar después de enviar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error generando reporte' });
  }
};

exports.getAvailableReports = async (req, res) => {
  const companyId = req.user.id;

  // Obtener meses con actividad
  const [months] = await db.query(
    `SELECT DISTINCT
      YEAR(planted_date) as year,
      MONTH(planted_date) as month,
      COUNT(*) as trees_planted
     FROM trees
     WHERE company_id = ?
     GROUP BY YEAR(planted_date), MONTH(planted_date)
     ORDER BY year DESC, month DESC`,
    [companyId]
  );

  return res.json({ reports: months });
};
```

3. **Scheduler para reportes automáticos:**
```javascript
// src/schedulers/monthlyReportScheduler.js (NUEVO)

const cron = require('node-cron');

// Ejecutar el día 1 de cada mes a las 9:00 AM
cron.schedule('0 9 1 * *', async () => {
  console.log('📊 Generando reportes mensuales...');

  // Obtener todas las empresas activas
  const [companies] = await db.query(
    'SELECT id, email, company_name FROM users WHERE role = ? AND is_active = TRUE',
    ['company']
  );

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const year = lastMonth.getFullYear();
  const month = lastMonth.getMonth() + 1;

  for (const company of companies) {
    try {
      // Generar reporte
      const filepath = await reportGenerator.generateMonthlyReport(company.id, year, month);

      // Enviar por email
      await emailService.sendMonthlyReport({
        to: company.email,
        company_name: company.company_name,
        month: getMonthName(month),
        year: year,
        attachment: filepath
      });

      console.log(`✅ Reporte enviado a ${company.company_name}`);

      // Eliminar archivo temporal
      fs.unlinkSync(filepath);
    } catch (error) {
      console.error(`❌ Error con ${company.company_name}:`, error);
    }
  }
});
```

**Dependencia necesaria:**
```bash
npm install pdfkit
```

**Estimación:** 10 horas de implementación

---

### 7. RANKING PÚBLICO DE EMPRESAS

#### ⚠️ Infraestructura Parcial Existe

**Backend:** `statsController.js` tiene ranking de plantadores, no de empresas

**Líneas 48-68:** Ranking de plantadores (no empresas)
```javascript
exports.getPlanterRanking = async (req, res) => {
  const [ranking] = await db.query(
    'SELECT * FROM v_planter_ranking ORDER BY total_trees_planted DESC LIMIT 50'
  );
  return res.json({ ranking });
};
```

**Database:** `v_planter_ranking` view existe (schema.sql línea 656), pero NO hay `v_company_ranking`

**Lo que se necesita implementar:**

1. **Vista de base de datos:**
```sql
-- Agregar a schema.sql

CREATE OR REPLACE VIEW v_company_ranking AS
SELECT
  u.id as company_id,
  u.company_name,
  u.industry_sector,
  COUNT(DISTINCT t.id) as trees_planted,
  SUM(t.co2_offset) as total_co2_offset,
  COUNT(DISTINCT cp.id) as collaborative_projects,
  COALESCE(ce.employee_count, 0) as team_size,
  u.created_at as member_since
FROM users u
LEFT JOIN trees t ON t.company_id = u.id
LEFT JOIN collaborative_trees cp ON cp.creator_id = u.id
LEFT JOIN (
  SELECT company_id, COUNT(*) as employee_count
  FROM company_employees
  WHERE status = 'active'
  GROUP BY company_id
) ce ON ce.company_id = u.id
WHERE u.role = 'company'
  AND u.is_active = TRUE
  AND u.deleted_at IS NULL
GROUP BY u.id
ORDER BY trees_planted DESC;
```

2. **Controller:**
```javascript
// En statsController.js, agregar:

exports.getCompanyRanking = async (req, res) => {
  const { sector, limit } = req.query;

  let query = 'SELECT * FROM v_company_ranking';
  let params = [];

  if (sector) {
    query += ' WHERE industry_sector = ?';
    params.push(sector);
  }

  query += ' ORDER BY trees_planted DESC LIMIT ?';
  params.push(parseInt(limit) || 50);

  const [ranking] = await db.query(query, params);

  return res.json({ ranking });
};

exports.getCompanyProfile = async (req, res) => {
  const { id } = req.params;

  // Datos públicos de la empresa
  const [company] = await db.query(
    `SELECT
      u.company_name,
      u.industry_sector,
      u.company_logo_url,
      u.company_description,
      cr.trees_planted,
      cr.total_co2_offset,
      cr.collaborative_projects,
      cr.team_size,
      cr.member_since
    FROM users u
    JOIN v_company_ranking cr ON cr.company_id = u.id
    WHERE u.id = ? AND u.role = 'company'`,
    [id]
  );

  if (company.length === 0) {
    return res.status(404).json({ error: 'Empresa no encontrada' });
  }

  // Badges obtenidos
  const badges = [];
  if (company[0].trees_planted >= 1) badges.push('Primer Árbol');
  if (company[0].trees_planted >= 100) badges.push('Bosque Joven');
  if (company[0].trees_planted >= 250) badges.push('Bosque Maduro');
  if (company[0].trees_planted >= 1000) badges.push('Gigante Verde');

  // Mapa de árboles
  const [trees] = await db.query(
    'SELECT latitude, longitude, species_name, planted_date FROM trees WHERE company_id = ? LIMIT 100',
    [id]
  );

  return res.json({
    ...company[0],
    badges,
    trees_map: trees
  });
};
```

3. **Rutas:**
```javascript
// En stats.routes.js, agregar:
router.get('/companies/ranking', statsController.getCompanyRanking);
router.get('/companies/:id/profile', statsController.getCompanyProfile);
```

4. **Frontend: Página pública de ranking**
```jsx
// src/pages/landing/CompanyRankingPage.jsx (NUEVO)

const CompanyRankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const [selectedSector, setSelectedSector] = useState('all');

  useEffect(() => {
    const loadRanking = async () => {
      const result = await statsService.getCompanyRanking(selectedSector);
      setRanking(result.ranking);
    };
    loadRanking();
  }, [selectedSector]);

  return (
    <div className="ranking-page">
      <h1>Ranking Nacional de Empresas Sostenibles</h1>

      <div className="filters">
        <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
          <option value="all">Todos los sectores</option>
          <option value="technology">Tecnología</option>
          <option value="food">Alimentación</option>
          <option value="retail">Retail</option>
          {/* ... más sectores */}
        </select>
      </div>

      <div className="ranking-list">
        {ranking.map((company, index) => (
          <CompanyRankingCard
            key={company.company_id}
            position={index + 1}
            company={company}
          />
        ))}
      </div>
    </div>
  );
};
```

**Estimación:** 8 horas de implementación

---

### 8. FACTURACIÓN Y BILLING

#### ⚠️ UI Mockup Completo, Backend 0%

**Frontend:** `CompanyBillingContent.jsx` (205 líneas de código mock)

**Líneas 5-42:** Facturas hardcodeadas
```javascript
const mockInvoices = [
  {
    id: 1,
    invoice_number: 'FACT-B-00001234',
    date: '2024-11-01',
    amount: 45600,
    status: 'paid',
    trees_count: 3,
    pdf_url: null
  },
  // ... más datos mock
];
```

**Lo que se necesita implementar:**

1. **Tablas de base de datos:**
```sql
CREATE TABLE company_invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_type ENUM('B', 'C') NOT NULL, -- Factura B o C
  cuit VARCHAR(11) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  subtotal DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  status ENUM('draft', 'issued', 'paid', 'cancelled') DEFAULT 'draft',
  payment_method VARCHAR(50),
  paid_at TIMESTAMP NULL,
  pdf_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES users(id)
);

CREATE TABLE invoice_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  work_order_id INT,
  FOREIGN KEY (invoice_id) REFERENCES company_invoices(id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);
```

2. **Controller:**
```javascript
// src/controllers/invoiceController.js (NUEVO)

exports.createInvoice = async (req, res) => {
  const companyId = req.user.id;
  const { work_order_ids, invoice_type } = req.body;

  // 1. Obtener datos de la empresa
  const [company] = await db.query('SELECT * FROM users WHERE id = ?', [companyId]);

  if (!company[0].cuit) {
    return res.status(400).json({ error: 'CUIT no configurado en perfil' });
  }

  // 2. Obtener work orders
  const [orders] = await db.query(
    'SELECT * FROM work_orders WHERE id IN (?) AND company_id = ?',
    [work_order_ids, companyId]
  );

  // 3. Calcular totales
  const subtotal = orders.reduce((sum, order) => sum + order.total_payment, 0);
  const taxAmount = invoice_type === 'B' ? subtotal * 0.21 : 0; // IVA 21% para Factura B
  const total = subtotal + taxAmount;

  // 4. Generar número de factura
  const invoiceNumber = await generateInvoiceNumber(invoice_type);

  // 5. Crear factura
  const [result] = await db.query(
    `INSERT INTO company_invoices
     (company_id, invoice_number, invoice_type, cuit, business_name,
      issue_date, subtotal, tax_amount, total_amount, status)
     VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)`,
    [
      companyId,
      invoiceNumber,
      invoice_type,
      company[0].cuit,
      company[0].company_name,
      subtotal,
      taxAmount,
      total,
      'issued'
    ]
  );

  const invoiceId = result.insertId;

  // 6. Crear items de factura
  for (const order of orders) {
    await db.query(
      `INSERT INTO invoice_items
       (invoice_id, description, quantity, unit_price, subtotal, work_order_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        invoiceId,
        `Plantación de árbol ${order.tree_name}`,
        1,
        order.total_payment,
        order.total_payment,
        order.id
      ]
    );
  }

  // 7. Generar PDF
  const pdfPath = await generateInvoicePDF(invoiceId);
  await db.query('UPDATE company_invoices SET pdf_url = ? WHERE id = ?', [pdfPath, invoiceId]);

  return res.json({
    message: 'Factura generada',
    invoice_id: invoiceId,
    invoice_number: invoiceNumber,
    pdf_url: pdfPath
  });
};

exports.getMyInvoices = async (req, res) => {
  const companyId = req.user.id;

  const [invoices] = await db.query(
    `SELECT
      i.*,
      COUNT(ii.id) as items_count
    FROM company_invoices i
    LEFT JOIN invoice_items ii ON ii.invoice_id = i.id
    WHERE i.company_id = ?
    GROUP BY i.id
    ORDER BY i.issue_date DESC`,
    [companyId]
  );

  return res.json({ invoices });
};

exports.downloadInvoice = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.id;

  const [invoice] = await db.query(
    'SELECT * FROM company_invoices WHERE id = ? AND company_id = ?',
    [id, companyId]
  );

  if (invoice.length === 0) {
    return res.status(404).json({ error: 'Factura no encontrada' });
  }

  if (!invoice[0].pdf_url) {
    return res.status(404).json({ error: 'PDF no disponible' });
  }

  res.download(invoice[0].pdf_url);
};

// Función auxiliar
async function generateInvoiceNumber(type) {
  const [last] = await db.query(
    'SELECT invoice_number FROM company_invoices WHERE invoice_type = ? ORDER BY id DESC LIMIT 1',
    [type]
  );

  if (last.length === 0) {
    return `FACT-${type}-00000001`;
  }

  const lastNumber = parseInt(last[0].invoice_number.split('-')[2]);
  const newNumber = String(lastNumber + 1).padStart(8, '0');
  return `FACT-${type}-${newNumber}`;
}
```

3. **Generación de PDF:**
```javascript
// src/services/invoiceGenerator.js (NUEVO)

const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generateInvoicePDF = async (invoiceId) => {
  // Obtener datos de factura
  const [invoice] = await db.query(
    `SELECT i.*, u.company_name, u.cuit, u.fiscal_address
     FROM company_invoices i
     JOIN users u ON i.company_id = u.id
     WHERE i.id = ?`,
    [invoiceId]
  );

  const [items] = await db.query(
    'SELECT * FROM invoice_items WHERE invoice_id = ?',
    [invoiceId]
  );

  const inv = invoice[0];

  // Crear PDF
  const doc = new PDFDocument();
  const filename = `factura_${inv.invoice_number}.pdf`;
  const filepath = `./invoices/${filename}`;

  doc.pipe(fs.createWriteStream(filepath));

  // Header
  doc.fontSize(20).text(`Factura ${inv.invoice_type}`, { align: 'center' });
  doc.fontSize(10).text(inv.invoice_number, { align: 'center' });
  doc.moveDown();

  // Datos empresa
  doc.fontSize(12).text('Emisor: My Tree in the World');
  doc.text('CUIT: 30-12345678-9');
  doc.text('Dirección: Av. Ejemplo 123, CABA');
  doc.moveDown();

  // Datos cliente
  doc.text(`Cliente: ${inv.company_name}`);
  doc.text(`CUIT: ${inv.cuit}`);
  doc.moveDown();

  // Tabla de items
  doc.fontSize(10);
  items.forEach(item => {
    doc.text(`${item.description} - $${item.subtotal.toLocaleString()}`);
  });
  doc.moveDown();

  // Totales
  doc.fontSize(12);
  doc.text(`Subtotal: $${inv.subtotal.toLocaleString()}`, { align: 'right' });
  if (inv.tax_amount > 0) {
    doc.text(`IVA 21%: $${inv.tax_amount.toLocaleString()}`, { align: 'right' });
  }
  doc.fontSize(14).text(`TOTAL: $${inv.total_amount.toLocaleString()}`, { align: 'right' });

  doc.end();

  return `/invoices/${filename}`;
};
```

**Estimación:** 12 horas de implementación

---

## 📊 RESUMEN CUANTITATIVO

| Categoría | Backend | Frontend | Database | Estimación |
|-----------|---------|----------|----------|-----------|
| **1. Calculadora Carbono** | 70% | 40% | 100% | 4 horas |
| **2. Plantación Masiva** | 0% | 0% | 0% | 8 horas |
| **3. Sorteo Cupones** | 30% | 0% | 100% | 12 horas |
| **4. Compensación Auto** | 0% | 0% | 0% | 16 horas |
| **5. Gestión Empleados** | 0% | mockup | 0% | 14 horas |
| **6. Reportes/Certificados** | 0% | mockup | 0% | 10 horas |
| **7. Ranking Público** | 20% | 0% | partial | 8 horas |
| **8. Facturación** | 0% | mockup | 0% | 12 horas |

**TOTAL:** ~84 horas de implementación

**Nivel general de implementación:** **~40%**
- Frontend: 60% (muchos mockups bonitos)
- Backend: 25% (solo features básicas)
- Database: 50% (tablas colaborativas existen, resto no)

---

## 🎯 ROADMAP PRIORIZADO

### 🔴 PRIORIDAD ALTA (Completar primero)

#### 1. Conectar Calculadora de Carbono (4 horas)
**Archivo:** `CompanyCarbonContent.jsx`
- Reemplazar cálculos hardcodeados por API
- Agregar inputs faltantes (gas, residuos, papel)
- Usar `carbonService.calculate()`

#### 2. Implementar Sistema de Sorteo (12 horas)
**Archivos nuevos:** `raffleController.js`, `raffle.routes.js`
- Endpoint `POST /api/raffle/:id/execute`
- Algoritmo de selección de ganadores
- Generación de cupones únicos
- Notificaciones a ganadores

#### 3. Plantación Masiva con Descuentos (8 horas)
**Archivos:** `treeController.js`, nuevo `CompanyBulkPurchaseContent.jsx`
- Tabla `bulk_pricing_tiers`
- Endpoint `POST /api/trees/bulk`
- UI con cálculo de descuento en tiempo real

### 🟡 PRIORIDAD MEDIA (Luego de las anteriores)

#### 4. Gestión de Empleados (14 horas)
**Archivos nuevos:** `companyTeamController.js`, tablas de empleados
- Sistema de invitaciones por email
- Límites mensuales de árboles
- Middleware de validación

#### 5. Reportes Automáticos (10 horas)
**Archivos nuevos:** `reportGenerator.js`, `reportController.js`
- Generación de PDF con pdfkit
- Scheduler mensual
- Envío por email

#### 6. Ranking Público (8 horas)
**Archivos:** `statsController.js`, vista SQL, `CompanyRankingPage.jsx`
- Vista `v_company_ranking`
- Endpoints de ranking nacional/sectorial
- Página pública de ranking

### 🟢 PRIORIDAD BAJA (Features avanzadas)

#### 7. Facturación Corporativa (12 horas)
- Tablas de facturas e items
- Generación de PDF
- Integración con AFIP (futuro)

#### 8. Compensación Automática (16 horas)
- Planes recurrentes
- Scheduler diario
- Facturación automática

---

## 📁 ARCHIVOS CLAVE PARA EDITAR

### Backend
```
my-tree-in-the-world-back/src/
├── controllers/
│   ├── carbonController.js                 ✅ Existe (70%)
│   ├── collaborativeTreeController.js      ✅ Existe (95%)
│   ├── raffleController.js                 ❌ Crear NUEVO
│   ├── companyTeamController.js            ❌ Crear NUEVO
│   ├── reportController.js                 ❌ Crear NUEVO
│   ├── invoiceController.js                ❌ Crear NUEVO
│   └── compensationPlanController.js       ❌ Crear NUEVO
├── routes/
│   ├── raffle.routes.js                    ❌ Crear NUEVO
│   ├── companyTeam.routes.js               ❌ Crear NUEVO
│   ├── report.routes.js                    ❌ Crear NUEVO
│   └── invoice.routes.js                   ❌ Crear NUEVO
├── schedulers/
│   ├── raffleScheduler.js                  ❌ Crear NUEVO
│   ├── monthlyReportScheduler.js           ❌ Crear NUEVO
│   └── compensationPlanScheduler.js        ❌ Crear NUEVO
├── services/
│   ├── reportGenerator.js                  ❌ Crear NUEVO
│   └── invoiceGenerator.js                 ❌ Crear NUEVO
└── middleware/
    └── employeeTreeLimit.js                ❌ Crear NUEVO
```

### Frontend
```
my-tree-in-the-world-front/src/
├── modules/company/components/dashboard/
│   ├── CompanyCarbonContent.jsx            ⚠️ Editar (quitar hardcoded)
│   ├── CompanyProjectsContent.jsx          ⚠️ Editar (conectar API)
│   ├── CompanyTeamContent.jsx              ⚠️ Editar (conectar API)
│   ├── CompanyReportsContent.jsx           ⚠️ Editar (conectar API)
│   ├── CompanyBillingContent.jsx           ⚠️ Editar (conectar API)
│   └── CompanyBulkPurchaseContent.jsx      ❌ Crear NUEVO
├── modules/user/components/
│   └── MyCouponsContent.jsx                ❌ Crear NUEVO
├── pages/landing/
│   └── CompanyRankingPage.jsx              ❌ Crear NUEVO
└── services/
    ├── raffleService.js                    ❌ Crear NUEVO
    └── invoiceService.js                   ❌ Crear NUEVO
```

### Base de Datos
```sql
-- Agregar a schema.sql:

-- Plantación masiva
CREATE TABLE bulk_pricing_tiers (...);

-- Empleados
CREATE TABLE company_employees (...);

-- Compensación automática
CREATE TABLE company_compensation_plans (...);

-- Facturación
CREATE TABLE company_invoices (...);
CREATE TABLE invoice_items (...);

-- Vistas
CREATE VIEW v_company_ranking AS ...;
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Quick Wins (24 horas)
- [ ] Conectar calculadora de carbono con backend API
- [ ] Implementar sistema de sorteo de cupones
- [ ] Crear plantación masiva con descuentos por volumen

### Fase 2: Core Features (32 horas)
- [ ] Gestión de empleados (invitaciones, límites)
- [ ] Reportes automáticos mensuales en PDF
- [ ] Ranking público de empresas

### Fase 3: Advanced (28 horas)
- [ ] Sistema de facturación B/C
- [ ] Compensación automática recurrente
- [ ] Integración con AFIP (futuro)

---

## 🚀 SIGUIENTE PASO RECOMENDADO

**Empezar por la calculadora de carbono (4 horas):**
1. Editar `CompanyCarbonContent.jsx` líneas 16-30
2. Reemplazar cálculos hardcodeados por `carbonService.calculate()`
3. Agregar inputs faltantes (gas, residuos, papel, agua)
4. Probar integración con backend existente

**Luego implementar sorteo de cupones (12 horas):**
- La base de datos YA ESTÁ LISTA
- Solo falta la lógica de ejecución
- Es el feature diferenciador más importante
- ROI de 450%+ según documentación

---

**Creado por:** Claude Code
**Fecha:** 2025-11-10
**Próxima revisión:** Al completar Fase 1
