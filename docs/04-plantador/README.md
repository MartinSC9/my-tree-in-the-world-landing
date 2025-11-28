# Rol: Plantador

## Descripción del Rol
Trabajador independiente que retira árboles de viveros y los planta en ubicaciones. NO es asignado por admin. Funciona como Rappi: órdenes van a un POOL PÚBLICO, primer plantador en tomar la orden se la lleva. Sistema de prioridad por rating.

---

## Modelo de Negocio: Pool Público

**Cambio fundamental**:
- ❌ ANTES: Admin asignaba plantador a cada orden
- ✅ AHORA: Órdenes en pool público → Plantador TOMA orden (primero en llegar)

**Ventajas**:
- Libertad: Eliges las órdenes que más te convengan
- Transparencia: Ves pago total ANTES de tomar
- Flexibilidad: Trabajas cuando quieras
- Meritocracia: Mejor rating = acceso prioritario

---

## Configuración Inicial

1. Registrar plantador (nombre, DNI, CUIL, zona trabajo, experiencia)
2. Adjuntar documentación:
   - DNI frente/dorso
   - CUIL
   - Referencias laborales (mín 2)
   - Foto perfil
   - Vehículo (tipo, patente)
3. Esperar aprobación admin (verificación 3-5 días)
4. Cuenta activada
5. Configurar zona de trabajo preferida (radio 30 km)

---

## Búsqueda de Órdenes Disponibles

### 1. Ver Pool de Órdenes

**Abrir app → Tab "Órdenes disponibles"**

Cada orden muestra:
- Árbol a plantar
- Vivero de origen (distancia)
- Ubicación de plantación (distancia)
- **Pago total** (tarifa base + bonificaciones)
- Fecha límite de plantación
- Dificultad estimada (fácil/media/difícil)

### 2. Sistema de Prioridad por Rating

**⭐ 4.8+ estrellas**: Ves órdenes INMEDIATAMENTE
**⭐ 4.0-4.7 estrellas**: Ves órdenes después de 30 min
**⭐ 3.0-3.9 estrellas**: Ves órdenes después de 1 hora
**⭐ <3.0 estrellas**: Ves órdenes después de 2 horas

**Ventaja**: Mantén buen rating para acceso prioritario a mejores órdenes.

### 3. TOMAR Orden (Primero en llegar)

**Opción A: TOMAR ORDEN**
```
Click "TOMAR" → Confirmar → Orden asignada instantáneamente
→ Tienes 2h para confirmar retiro del vivero
→ Solo 1 orden activa a la vez
```

**Opción B: NO TOMAR**
```
Esperar otra orden que convenga más → Sin penalización
```

**Opción C: TOMAR y NO RETIRAR en 2h**
```
Orden se libera al pool → Penalización en rating
→ 3 timeouts en un mes = suspensión 7 días
```

---

## Flujo Completo de Trabajo

### 1. Retiro del Árbol en Vivero

```
Confirmar salida (GPS activo) → Viajar a vivero → Confirmar llegada
→ Presentar DNI → Verificar código árbol → Inspeccionar estado
→ Recibir ficha técnica → Foto del árbol → Confirmar retiro
→ Vivero confirma entrega
```

⚠️ **IMPORTANTE**: Si no retiras en 2h de confirmar, orden se libera y pierdes rating.

### 2. Viaje a Ubicación de Plantación

```
Confirmar salida (GPS activo) → Sistema rastrea en tiempo real
→ Usuario ve tu ubicación → Llegar a destino
→ Verificar GPS coincide con coordenadas
→ Foto del lugar "antes de plantar"
```

### 3. Plantación del Árbol

**Checklist paso a paso**:
```
☐ Marcar área de plantación
☐ Cavar hoyo (60cm profundo × 50cm ancho)
☐ Preparar suelo con abono orgánico
☐ Colocar árbol en el centro
☐ Rellenar con tierra fértil
☐ Compactar suelo suavemente
☐ Regar abundantemente (10-15 litros)
☐ Colocar estacas de soporte (si necesario)
☐ Verificar estabilidad y verticalidad
```

Sistema calcula tiempo de trabajo automáticamente.

### 4. Evidencia y Finalización

**Fotos requeridas (mínimo 3)**:
- Foto general (árbol completo)
- Foto detalle (tronco y base)
- Foto panorámica (contexto del lugar)

**Opcional**:
- Notas de plantación (condiciones suelo, clima, observaciones)

**Finalizar**:
```
GPS registra ubicación exacta → Tiempo total auto-calculado
→ Click "Marcar como completado" → Usuario recibe fotos
→ Calificación del usuario → Pago registrado
```

---

## Estados de Orden (Vista Plantador)

- 🟢 **Disponible en pool** (puedes tomarla si cumples prioridad por rating)
- 🟡 **Tomada - Pendiente retiro** (tienes 2h para retirar del vivero)
- 🔵 **Retirando árbol** (en camino al vivero)
- 🔵 **En camino a plantación** (GPS activo hacia ubicación final)
- 🔵 **Plantando** (proceso de plantación en curso)
- 🟢 **Completada** (esperando calificación del usuario)
- 🔴 **Liberada** (no retiraste a tiempo, vuelve al pool)
- 🔴 **Cancelada** (usuario/sistema canceló)

**Importante**: Ya NO existe asignación por admin. Todas las órdenes van a un pool público y el primero en tomarla se la lleva.


## Sistema de Rating y Bonificaciones

### Rating SUBE si:
- ✅ Completas >90% de órdenes tomadas
- ✅ Retiras árbol en <1h de tomar orden
- ✅ Plantas antes del tiempo estimado
- ✅ Recibes 5⭐ de clientes
- ✅ Subes fotos de alta calidad

### Rating BAJA si:
- ❌ Tomas orden y no retiras en 2h (timeout)
- ❌ Cancelas después de retirar árbol
- ❌ Excedes tiempo de plantación
- ❌ Recibes <4⭐ de clientes
- ❌ Subes evidencia de baja calidad

### Bonificaciones Automáticas

**💰 Distancia vivero → plantación**:
- 0-10 km: +$0
- 11-20 km: +$300
- 21-30 km: +$600
- 31-40 km: +$800
- 41-50 km: +$1,200

**💰 Urgencia** (cliente pagó plantación urgente): +$500

**💰 Complejidad** (terreno difícil, árbol grande): +$500-$1,000

**💰 Horario** (nocturna/fin de semana): +$400

---

## Pagos

**Liquidación cada 15 días**:
- Días 1-15 → Pago día 20
- Días 16-31 → Pago día 5 del siguiente mes

**Transferencia bancaria** (CBU/CVU registrado)

**Ejemplo de pago**:
```
Tarifa base: $2,500
Bonificación distancia (40 km): +$800
Bonificación urgente: +$500
TOTAL: $3,800
```

---

## Restricciones Importantes

⚠️ **Solo 1 orden activa a la vez**: No puedes tomar otra hasta completar la actual.

⚠️ **2 horas para retirar**: Después de tomar orden, tienes 2h para confirmar retiro o se libera.

⚠️ **Penalización por cancelación**: Si tomas orden y cancelas, pierdes -0.2 puntos de rating.

⚠️ **3 timeouts = suspensión**: 3 timeouts (no retirar a tiempo) en un mes → suspensión 7 días.

⚠️ **Rating mínimo 3.0**: Si caes bajo 3.0⭐, cuenta se revisa y puede suspenderse.

---

## Consejos para Maximizar Ganancias

🎯 Mantén rating >4.8⭐ (acceso inmediato a órdenes)
🎯 Toma órdenes en tu zona (minimiza distancia)
🎯 Acepta órdenes urgentes (+$500 extra)
🎯 Sube fotos de alta calidad (mejor reputación)
🎯 Completa plantaciones ANTES del tiempo estimado
🎯 Retira del vivero en <1h de tomar orden
🎯 Trabaja en horarios de alta demanda (fines de semana)

---

## Ejemplo de Jornada Típica

**Día completo (4 órdenes)**:
```
Orden A: $2,500 (base) + $300 (distancia) = $2,800
Orden B: $2,500 + $600 (distancia) + $500 (urgente) = $3,600
Orden C: $2,500 + $0 (cerca) = $2,500
Orden D: $2,500 + $400 (fin semana) = $2,900

TOTAL DÍA: $11,800
TOTAL MES (20 días): $236,000
```

---

## Preguntas Frecuentes

**¿Puedo tomar múltiples órdenes a la vez?**
No, solo 1 orden activa. Debes completarla para tomar otra.

**¿Qué pasa si la orden está muy lejos?**
Puedes NO tomarla. Espera órdenes en tu zona. Sin penalización.

**¿Qué pasa si el árbol del vivero está en mal estado?**
Documenta con fotos, reporta a través de app. Admin investiga. NO afecta tu rating.

**¿Puedo cancelar una orden después de tomarla?**
Solo si tienes razón válida (árbol mal estado, accidente, emergencia). Penalización -0.2 rating si cancelas sin justificación.

**¿Cómo subo mi rating?**
Completa órdenes rápido, retira en <1h, planta antes del tiempo, sube fotos de calidad, recibe 5⭐ de clientes.

---

## Contacto y Soporte

📧 plantadores@mytreeintheworld.com
📱 WhatsApp: +54 11 xxxx-xxxx

---

**⚡ RECUERDA**: Solo **1 orden activa** a la vez. El mejor plantador completa rápido, toma la siguiente, y mantiene rating >4.8⭐ para acceso prioritario.
