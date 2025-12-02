# Rol: Admin

## Descripción del Rol
Supervisor de marketplace automático. NO autoriza órdenes ni asigna viveros/plantadores. El sistema es 100% automático. Admin solo supervisa, aprueba nuevos actores (una vez), resuelve excepciones (~5% de órdenes) y modera contenido.

---

## Modelo de Negocio: Supervisor (NO Operador)

**Cambio fundamental**:
- ❌ ANTES: Admin autorizaba cada orden, asignaba viveros y plantadores (100% órdenes)
- ✅ AHORA: Sistema automático, admin solo interviene en excepciones (5% órdenes)

**Ventajas**:
- Menos carga operativa (5% vs 100%)
- Más escalable (10,000 órdenes/mes con mismo equipo)
- Rol estratégico (supervisar y optimizar vs ejecutar)
- Mejor detección de problemas (alertas automáticas)

---

## Dashboard Principal

**Resumen en tiempo real**:
- Órdenes activas por estado
- Órdenes con alertas (timeout vivero, sin plantador >24h)
- Árboles plantados hoy/semana/mes
- Nuevos registros pendientes de aprobación
- Ingresos del período
- Alertas críticas (fraudes, reportes urgentes)

**Alertas por prioridad**:
- 🔴 **Críticas**: Órdenes >48h sin plantador, fraude detectado
- 🟡 **Importantes**: Vivero >3 timeouts/mes, plantador rating <3.0
- 🔵 **Informativas**: Nuevos registros, estadísticas del día

**Gráficos de actividad**:
- Órdenes creadas vs completadas
- Performance viveros y plantadores
- Tasas de aceptación/rechazo
- Tiempos promedio por fase

---

## Gestión de Órdenes (SOLO Excepciones)

### 🚨 CAMBIO IMPORTANTE: Ya NO se autorizan órdenes

**El flujo de trabajo actualizado es:**
```
Usuario compra árbol
   ↓
⏳ Esperando Vivero (máx 2h) - Vivero acepta/rechaza AUTOMÁTICAMENTE
   ↓
🌱 Vivero Preparando (1-5 días)
   ↓
📦 Planta Lista - Va al pool público
   ↓
👷 Plantador Asignado - Primer plantador en tomar la orden
   ↓
🚗 Retirando del Vivero
   ↓
🚚 En Camino
   ↓
🌳 Plantando
   ↓
✅ Plantada
```

**Estados eliminados:**
- ❌ `pendiente_autorizacion` (ya no existe)
- ❌ `autorizada` (ya no existe)
- ❌ `asignada_vivero` (reemplazado por `esperando_vivero`)

**Estados nuevos:**
- ✅ `esperando_vivero` - Vivero decide en 2h
- ✅ `plantador_asignado` - Plantador tomó la orden del pool
- ✅ `retirando_vivero` - Plantador va al vivero

### ⚠️ IMPORTANTE: Admin NO gestiona órdenes normales

**Flujo automático**: Usuario → Vivero → Plantador → Completado

### Cuándo Intervenir (Excepciones)

**1. Vivero reporta problema excepcional con árbol**
- Árbol se dañó después de la compra
- Stock erróneo (árbol vendido pero no disponible)
- Admin procesa cancelación y reembolso
- Usuario notificado y puede elegir otro vivero

**2. Orden sin plantador >24h**
- Sistema ya aumentó bonificación automáticamente
- Admin contacta plantadores de zona directamente
- Incrementar radio de búsqueda manualmente
- Si no se resuelve en 48h → Reembolso parcial o replantación

**3. Plantador toma orden y no retira en 2h (auto-liberado)**
- Sistema ya liberó la orden al pool
- Admin revisa si es patrón repetido
- Si >3 timeouts/mes → Suspender 7 días

**4. Disputas entre partes**
- Usuario reporta problema con árbol plantado
- Vivero/plantador reclaman pago
- Conflictos de calidad
- Admin investiga y media

**5. Fraude detectado**
- Sistema marca transacción sospechosa
- Admin investiga actividad del usuario
- Suspende cuenta si confirma fraude
- Procesa reversión de pago si aplica

---

## Aprobación de Viveros (UNA SOLA VEZ)

**Objetivo**: Verificar que vivero es legítimo y tiene capacidad real.

**Verificar documentación**:
- ✅ Habilitación municipal vigente
- ✅ Certificado sanidad vegetal (SENASA)
- ✅ Constancia AFIP
- ✅ Fotos del vivero (instalaciones reales)

**Verificaciones automáticas del sistema**:
- CUIT válido en AFIP
- Dirección existe en Google Maps
- Teléfono válido y activo

**Verificación manual (admin)**:
- Llamar al teléfono del vivero
- Verificar que existe físicamente (Street View)
- Validar que entiende modelo (2h para aceptar, stock real)

**Decisión**:
- **Aprobar** → Activa cuenta, puede recibir órdenes
- **Rechazar** → Con justificación

**Tiempo estimado**: 15-20 min por vivero

---

## Aprobación de Plantadores (UNA SOLA VEZ)

**Objetivo**: Verificar identidad, experiencia y capacidad.

**Verificar documentación**:
- ✅ DNI frente/dorso legible
- ✅ CUIL válido
- ✅ Certificados experiencia (jardinería, agronomía)
- ✅ Referencias laborales (mín 2)
- ✅ Foto perfil

**Verificaciones automáticas**:
- DNI válido en ReNaPer
- CUIL válido en ANSES
- Sin antecedentes penales graves

**Verificación manual (admin)**:
- Contactar 1-2 referencias por teléfono
- Validar experiencia real en plantación
- Verificar que entiende sistema (pool, timeouts, rating)

**Decisión**:
- **Aprobar** → Puede tomar órdenes
- **Rechazar** → Con justificación

**Tiempo estimado**: 10-15 min por plantador

---

## Moderación de Contenido

**Sistema de reportes**: Usuarios reportan posts inapropiados.

**Revisar**:
- Contenido del post (texto, imágenes)
- Razones de reportes (spam, ofensivo, acoso, ilegal)
- Historial del autor (posts eliminados, advertencias, suspensiones)

**Acciones según severidad**:

**Leve (spam, off-topic)**:
- Ocultar post
- Advertir al usuario
- Sin suspensión

**Moderado (lenguaje inapropiado, contenido ofensivo)**:
- Eliminar post
- Advertir formalmente
- Si reincide → Suspender 7 días

**Grave (acoso, amenazas, contenido ilegal)**:
- Eliminar post inmediatamente
- Suspender cuenta permanentemente
- Reportar a autoridades si aplica
- Documentar para auditoría legal

---

## Estadísticas Globales

**Métricas de árboles**:
- Total plantados (por tipo, estado, especie)
- Top 10 especies plantadas
- Mapa de calor (dónde se plantan más)

**Métricas de usuarios**:
- Total por rol (user, company, vivero, plantador, admin)
- Nuevos registros del período
- Tasa de retención
- Activos vs inactivos

**Métricas de órdenes**:
- Tasa aceptación viveros (promedio: >70%)
- Tiempo promedio vivero acepta (objetivo: <30 min)
- Tiempo promedio preparación vivero
- Tiempo promedio plantador toma orden
- Órdenes completadas vs canceladas

**Métricas de ingresos**:
- Total del período
- Desglose: individuales vs proyectos colaborativos
- Comisiones pendientes para viveros/plantadores
- Ganancia neta plataforma (15% comisión)

**Performance de viveros**:
- Top 10 (por rating, por órdenes)
- Viveros con problemas (rating <4.0, rechazo >30%)
- Tiempo promedio preparación

**Performance de plantadores**:
- Top 10 (por rating, por órdenes)
- Plantadores con problemas (rating <3.5, timeouts frecuentes)
- Tiempo promedio plantación

**Proyectos colaborativos**:
- Total activos
- Progreso promedio
- Cupones sorteados
- Empresas participantes

**Exportar reportes**: PDF/Excel para stakeholders

---

## Resolución de Problemas y Disputas

### Tipos Comunes

**1. Usuario reporta mala calidad árbol plantado**
- Ver reporte (descripción, fotos)
- Ver evidencia plantación (fotos plantador, GPS)
- Ver historial plantador (rating, reportes previos)
- Contactar plantador para explicación
- Decidir:
  - Árbol correcto → Educar usuario
  - Árbol mal plantado → Asignar replantación
  - Fraude plantador → Suspender + reembolso

**2. Plantador reporta árbol mal estado del vivero**
- Ver evidencia (fotos retiro)
- Contactar vivero para explicación
- Revisar si es patrón repetido
- Decidir:
  - Problema aislado → Advertir vivero
  - Problema repetido → Suspender + auditoría
  - Reemplazar árbol si posible

**3. Vivero reclama pago no recibido**
- Ver estado liquidación en sistema
- Verificar orden completada
- Revisar datos bancarios (CBU/CVU)
- Contactar equipo pagos/MercadoPago
- Procesar pago manual si hay error

**4. Orden sin plantador >48h**
- Sistema ya aumentó bonificación
- Admin contacta plantadores manualmente
- Si nadie acepta → Aumentar bonificación manual (+$1000-$2000)
- Si aún nadie → Procesar reembolso + disculpas
- Analizar por qué falló (ubicación remota, falta plantadores)

**5. Fraude/Estafa detectada**
- Sistema marca usuario/orden sospechosa
- Admin investiga (historial, método pago, IPs)
- Si confirma fraude:
  - Suspender cuenta inmediatamente
  - Cancelar órdenes activas
  - Revertir pagos fraudulentos
  - Notificar a MercadoPago
  - Agregar a lista negra (DNI, email, IP)

---

## Flujo Diario Típico

**Inicio (9:00 AM)**:
- Dashboard → Alertas críticas
- Resolver alertas críticas (fraudes, órdenes >48h)

**Mañana (9:30-12:00)**:
- Aprobar viveros nuevos
- Aprobar plantadores nuevos
- Revisar órdenes con problemas

**Tarde (14:00-17:00)**:
- Moderar contenido reportado
- Resolver reportes de usuarios
- Revisar estadísticas del día
- Auditoría de logs

**Cierre (17:00-18:00)**:
- Verificar órdenes completadas
- Revisar alertas pendientes
- Generar reporte diario

**Tiempo real de intervención**: ~5% de órdenes vs 100% en modelo viejo.

---

## Criterios de Decisión

### Cuándo APROBAR vivero:
✅ Documentación completa y válida
✅ CUIT verificado en AFIP
✅ Instalaciones reales (fotos + Street View)
✅ Teléfono responde y confirma
✅ Entiende modelo (2h timeout, stock real)

### Cuándo RECHAZAR vivero:
❌ Documentación falsa o vencida
❌ No existe físicamente
❌ CUIT inválido o dado de baja
❌ No responde a contactos
❌ Sin capacidad real

### Cuándo APROBAR plantador:
✅ DNI y CUIL válidos
✅ Referencias positivas (mín 2)
✅ Experiencia comprobable
✅ Entiende proceso plantación
✅ Tiene vehículo para transporte

### Cuándo RECHAZAR plantador:
❌ DNI/CUIL falsos
❌ Sin referencias o negativas
❌ Antecedentes penales graves
❌ Sin experiencia demostrable
❌ Sin medio de transporte

### Cuándo SUSPENDER vivero:
- Rating <4.0 sostenido >1 mes
- Tasa rechazo >40%
- >3 reportes graves/mes
- Timeout >5 veces/mes
- Fraude comprobado

### Cuándo SUSPENDER plantador:
- Rating <3.0 sostenido >1 mes
- >3 timeouts/mes
- >3 reportes graves mala calidad
- Fraude comprobado (fotos falsas, GPS manipulado)

---

## Acciones Administrativas (Resumen)

**✅ Acciones frecuentes (diarias)**:
- Aprobar/rechazar viveros y plantadores
- Resolver reportes de usuarios
- Moderar contenido
- Monitorear alertas críticas

**⚠️ Acciones ocasionales (semanales)**:
- Auditoría de logs
- Revisión estadísticas y tendencias
- Suspender viveros/plantadores mal desempeño
- Procesar reembolsos por problemas no resueltos

**🔴 Acciones excepcionales (raras)**:
- Asignar plantador manualmente (orden >48h)
- Contactar viveros manualmente
- Intervenir en fraudes complejos
- Revertir transacciones por errores

**❌ Acciones que ya NO se hacen (automatizadas)**:
- ❌ Autorizar cada orden (nunca se autorizó)
- ❌ Aceptar órdenes en nombre del vivero (órdenes auto-confirmadas al pagar)
- ❌ Asignar vivero a orden (usuario elige vivero directamente)
- ❌ Asignar plantador a orden (pool público automático)

---
---

## Contacto y Soporte

📧 admin@mytreeintheworld.com
📱 WhatsApp: +54 11 xxxx-xxxx

---

**⚡ RECUERDA**: En el nuevo modelo, admin es **SUPERVISOR** no **OPERADOR**. El sistema se gestiona solo, admin solo interviene en excepciones (5%) y verifica calidad.
