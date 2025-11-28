# Rol: Vivero

## Descripción del Rol
Proveedor de árboles que gestiona stock en tiempo real. Modelo E-commerce: cuando usuario compra y paga, recibes orden CONFIRMADA automáticamente (stock ya descontado). Tu trabajo es preparar el árbol y entregarlo al plantador.
---

## Modelo de Negocio: Marketplace Automático

**Cambio fundamental**:
- ❌ ANTES: Vivero acepta/rechaza órdenes (modelo marketplace)
- ✅ AHORA: Usuario paga → Orden confirmada automáticamente → Vivero prepara

**Ventajas**:
- Stock en tiempo real funcional
- No pierdes tiempo aceptando/rechazando
- Órdenes garantizadas (ya pagadas)
- Flujo más simple y rápido

---

## Configuración Inicial

1. Registrar vivero (nombre, CUIT, ubicación, documentación)
2. Adjuntar:
   - Habilitación municipal vigente
   - Certificado sanidad vegetal (SENASA)
   - Constancia AFIP
   - Fotos instalaciones
3. Esperar aprobación admin (verificación única)
4. Cuenta activada → Configurar catálogo

---

## Gestión de Catálogo

### Agregar Árbol al Catálogo

1. **Datos básicos**: Nombre, especie, descripción, foto
2. **Clasificar según regulación**:
   - ✅ **Nativa aprobada**: Puede plantarse en espacios públicos municipales
   - ⚠️ **Exótica/Frutal**: Solo para propiedades privadas
3. **Precio**: Entre $15,000 - $25,000 ARS (obligatorio)
4. **Stock REAL**: Usuarios lo ven antes de comprar
5. **Tiempo preparación**: 1-5 días
6. Publicar en catálogo

### Sistema de Catálogos Automático

El sistema filtra automáticamente qué especies mostrar según ubicación validada del usuario:

- **🟢 Público Municipal** → Solo especies nativas aprobadas
- **🔵 Mi Domicilio** → Catálogo completo
- **🟡 Propiedad Ajena (con permiso)** → Catálogo completo

**Importante**: Si no tienes stock, el árbol NO se muestra a usuarios.

---

## Recepción y Gestión de Órdenes

### 1. Recibir Orden Directa
```
Notificación: "Nueva orden #894 - Responde en 2 horas"
```

**Detalles de la orden**:
- Árbol solicitado
- Tipo de ubicación (🟢🔵🟡)
- Stock disponible actual
- Ganancia neta (después comisión 15%)
- Ubicación destino
- Info del cliente

---

## Preparación del Árbol

### Checklist de Preparación
```
☐ Seleccionar árbol físico (código único)
☐ Regar abundantemente
☐ Revisar raíces y salud
☐ Aplicar nutrientes
☐ Embalar para transporte
☐ Tomar foto del árbol preparado
☐ Agregar notas (opcional)
```

**Finalizar**:
```
Click "Marcar como listo para plantación"
→ Sistema AUTOMÁTICAMENTE publica en pool de plantadores
```

⚠️ **IMPORTANTE**: Marcar "listo" dentro del tiempo prometido, o habrá penalización.

---

## Entrega al Plantador

1. Sistema asigna plantador automáticamente (pool público)
2. Recibir notificación: "Juan Pérez retirará el árbol"
3. Coordinar horario de retiro (chat in-app)
4. Cuando plantador llega:
   - Verificar identidad (DNI)
   - Verificar código de orden
   - Entregar árbol + ficha técnica
   - Tomar foto de entrega
   - Confirmar entrega en app
5. ✅ Orden completada para vivero
6. 💰 Pago registrado para liquidación

---

## Estados de Orden (Vista Vivero)

- 🟡 **Nueva orden confirmada** (usuario ya pagó, stock descontado)
- 🟢 **En preparación** (árbol preparándose 1-5 días)
- 📦 **Lista para entrega** (esperando que plantador tome orden del pool)
- 👷 **Plantador asignado** (plantador tomó la orden, coordinando retiro)
- 🚗 **Plantador retirando** (plantador en camino al vivero)
- ⚪ **Entregada a plantador** (completada para el vivero)
- 🔴 **Cancelada por problema excepcional** (reportaste problema al admin)

**IMPORTANTE**:
- ✅ Ya NO puedes rechazar órdenes (están pre-pagadas)
- ✅ Si hay problema excepcional (ej: árbol se dañó), contacta admin para cancelar y reembolsar
- ✅ Mantén stock actualizado en tiempo real para evitar problemas


## Sistema de Rating y Penalizaciones

### Rating SUBE si:
- ✅ Aceptas >80% de órdenes
- ✅ Respondes en <30 min
- ✅ Preparas antes del tiempo prometido
- ✅ Calidad del árbol recibe 5⭐

### Rating BAJA si:
- ❌ Rechazas >30% de órdenes
- ❌ No respondes en 2h (timeout)
- ❌ Excedes tiempo de preparación
- ❌ Calidad del árbol <4⭐

### Penalizaciones Graves:
- ⛔ No marcar "listo" en 2× tiempo prometido → Auto-cancelar + suspensión temporal
- ⛔ >3 timeouts en un mes → Suspensión 7 días

---

## Pagos y Estadísticas

**Liquidación cada 15 días**:
- Días 1-15 → Pago día 20
- Días 16-31 → Pago día 5 del siguiente mes

**Comisión plataforma**: 15% por orden

**Dashboard incluye**:
- Órdenes pendientes de aceptación
- Órdenes en preparación
- Órdenes completadas
- Ganancia del período
- Rating promedio
- Tiempo promedio preparación
- Tasa de aceptación

**Ejemplo de ganancia**:
```
Precio árbol: $20,000
Comisión (15%): -$3,000
Ganancia neta: $17,000
```

---

## Consejos para Maximizar Ventas

🎯 Mantén rating >4.5⭐ (apareces primero en búsquedas)
🎯 Responde órdenes en <30 min (mejor reputación)
🎯 Actualiza stock en tiempo real
🎯 Prepara árboles ANTES del tiempo prometido
🎯 Sube fotos de calidad
🎯 Mantén precios competitivos ($15k-$20k nativas comunes)
🎯 **Ofrece variedad de especies nativas** (alta demanda espacios públicos)
🎯 Clasifica correctamente tus árboles (para búsquedas adecuadas)

---

## Contacto y Soporte

📧 viveros@mytreeintheworld.com
📱 WhatsApp: +54 11 xxxx-xxxx

---

**⚡ RECUERDA**: Tienes **2 HORAS** para aceptar/rechazar cada orden. Mantén tu rating >4.5⭐ para aparecer primero en búsquedas de usuarios.
