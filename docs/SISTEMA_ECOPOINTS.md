# Sistema de EcoPoints y Rankings

## ¿Qué son los EcoPoints?

Los **EcoPoints** son un sistema de puntuación que reconoce tu impacto ambiental en la plataforma. Sirven para:

- 🏆 Aparecer en el **Ranking de Top Plantadores**
- 📊 Medir tu contribución al medio ambiente
- 🎖️ Desbloquear insignias y niveles
- 🌍 Compararte con otros usuarios comprometidos con el planeta

---

## ¿Cómo se calculan los EcoPoints?

### Puntos por Árboles Individuales
- 🌳 **10 EcoPoints** por cada árbol individual plantado
- Ejemplo: Si plantas 5 árboles individuales = 50 EcoPoints

### Puntos por Árboles Colaborativos
- 🤝 **5 EcoPoints** por cada aporte a proyecto colaborativo
- Da igual el monto: $100 ARS o $10,000 ARS = 5 EcoPoints
- Razón: Incentiva participación, no solo dinero

### Puntos por Completar Perfil
- ✅ **10 EcoPoints** por completar tu perfil al 100%
- Incluye: Foto de perfil, nombre completo, bio, ubicación

### Bonificaciones Especiales
- 🎁 **20 EcoPoints** por crear tu primer proyecto colaborativo
- 🌱 **50 EcoPoints** por plantar 10 o más árboles (bonificación única)
- 🏅 **100 EcoPoints** por plantar 50 o más árboles (bonificación única)

---

## Estructura de tu Perfil

Tu perfil muestra un desglose claro de tu actividad:

```
Total de Árboles: 5
├─ Individuales: 3
└─ Colaborativos: 2

Contribuciones: 8
├─ Árboles propios: 3
├─ Proyectos creados: 1
└─ Aportes a proyectos: 4

EcoPoints: 75
├─ Por árboles individuales: 30 (3 × 10 puntos)
├─ Por aportes colaborativos: 20 (4 × 5 puntos)
├─ Por crear proyecto: 20 (1 × 20 puntos)
└─ Por completar perfil: 10
```

### Definiciones

- **Árboles Individuales**: Árboles que pagaste 100% tú mismo
- **Árboles Colaborativos**: Árboles donde participaste con otros usuarios/empresas
- **Contribuciones**: Acciones totales (plantar + aportar + crear proyectos)

---

## Ranking de Top Plantadores

El ranking se actualiza **cada día a las 00:00hs** y muestra:

### Top 10 de la Semana
```
🥇 1. Juan Pérez - 250 EcoPoints
   📊 15 árboles individuales, 50 aportes colaborativos

🥈 2. María González - 180 EcoPoints
   📊 10 árboles individuales, 30 aportes colaborativos

🥉 3. Carlos López - 150 EcoPoints
   📊 12 árboles individuales, 10 aportes colaborativos
```

### Top 10 del Mes
Ranking mensual que se reinicia cada 1º de mes

### Top 10 de Todos los Tiempos
Ranking histórico desde tu registro

### Filtros disponibles
- 🌍 Por provincia/ciudad
- 👥 Solo amigos/comunidad
- 🏢 Solo usuarios (excluir empresas)

---

## Insignias y Niveles

Tu nivel sube automáticamente según tus EcoPoints:

| Nivel | EcoPoints | Insignia | Beneficio |
|-------|-----------|----------|-----------|
| 🌱 Explorador Ecológico | 0-49 | 🏅 Bronce | - |
| 🌿 Guardián Verde | 50-149 | 🏅 Plata | 5% descuento en árboles |
| 🌳 Protector Ambiental | 150-299 | 🏅 Oro | 10% descuento en árboles |
| 🌲 Héroe del Planeta | 300-499 | 🏅 Platino | 15% descuento + prioridad en sorteos |
| 🌎 Leyenda Ecológica | 500+ | 🏅 Diamante | 20% descuento + insignia especial + mención en homepage |

**Nota**: Los descuentos aplican en árboles individuales, no en aportes a proyectos colaborativos.

---

## Visibilidad de tu Perfil

Puedes controlar qué información es pública:

### Siempre visible (no editable)
- Nombre de usuario
- Nivel e insignia
- EcoPoints totales
- Total de árboles plantados (número)

### Opcional (puedes ocultar)
- Ubicación de árboles en mapa (solo si son públicos)
- Lista de proyectos colaborativos
- Ranking detallado
- Foto de perfil

### Siempre privado
- Email, teléfono
- Dirección de domicilio
- Métodos de pago
- Documentos de verificación

---

## Preguntas Frecuentes

**¿Los árboles colaborativos cuentan en mi total de árboles?**
Sí, pero se muestran separados. Si plantaste 3 árboles individuales y aportaste a 2 proyectos colaborativos, tu perfil mostrará "Total de Árboles: 5 (3 individuales, 2 colaborativos)".

**¿Por qué los aportes colaborativos dan menos puntos?**
Para equilibrar el sistema. Si un árbol cuesta $20,000 y 10 personas aportan $2,000 cada una, todas reciben 5 EcoPoints. Esto evita que quien aporta más dinero domine el ranking, premiando la participación por igual.

**¿Cómo subo de nivel?**
Automáticamente según tus EcoPoints. Planta más árboles, aporta a proyectos, crea tu propio proyecto colaborativo y completa tu perfil para ganar puntos.

**¿Los descuentos son acumulativos?**
Sí. Si eres "Héroe del Planeta" (15% descuento) y un árbol cuesta $20,000, pagas $17,000.

**¿Puedo perder EcoPoints?**
No. Los EcoPoints son permanentes y no se descuentan. Una vez ganados, son tuyos para siempre.

**¿Las empresas compiten en el mismo ranking?**
No. Hay rankings separados:
- **Ranking Usuarios**: Solo usuarios finales
- **Ranking Empresas**: Solo empresas
- **Ranking General**: Todos juntos (opcional ver)

---

## Implementación Técnica (Para Desarrolladores)

### Cálculo de EcoPoints

```javascript
// Función para calcular EcoPoints totales de un usuario
function calculateUserEcoPoints(user, trees, contributions) {
  let points = 0;

  // Árboles individuales (10 puntos cada uno)
  const individualTrees = trees.filter(t => t.type === 'individual');
  points += individualTrees.length * 10;

  // Aportes a proyectos colaborativos (5 puntos cada uno)
  const collaborativeContributions = contributions.filter(c => c.type === 'collaborative');
  points += collaborativeContributions.length * 5;

  // Perfil completo (10 puntos)
  if (user.profile_completed) {
    points += 10;
  }

  // Crear primer proyecto (20 puntos)
  const ownedProjects = contributions.filter(c => c.creator_id === user.id);
  if (ownedProjects.length >= 1) {
    points += 20;
  }

  // Bonificación por 10+ árboles (50 puntos, solo una vez)
  if (individualTrees.length >= 10 && !user.bonus_10_trees_claimed) {
    points += 50;
  }

  // Bonificación por 50+ árboles (100 puntos, solo una vez)
  if (individualTrees.length >= 50 && !user.bonus_50_trees_claimed) {
    points += 100;
  }

  return points;
}
```

### Estructura de Base de Datos

```sql
-- Tabla de usuarios (agregar campos)
ALTER TABLE users ADD COLUMN eco_points INT DEFAULT 0;
ALTER TABLE users ADD COLUMN level VARCHAR(50) DEFAULT 'Explorador Ecológico';
ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN bonus_10_trees_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN bonus_50_trees_claimed BOOLEAN DEFAULT FALSE;

-- Tabla de rankings (nueva)
CREATE TABLE user_rankings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  rank_position INT NOT NULL,
  eco_points INT NOT NULL,
  period_type ENUM('week', 'month', 'all_time') NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices para optimizar consultas de ranking
CREATE INDEX idx_rankings_period ON user_rankings(period_type, period_start, period_end);
CREATE INDEX idx_rankings_points ON user_rankings(eco_points DESC);
```

### Endpoints de API

```javascript
// GET /api/users/:userId/ecopoints - Obtener desglose de EcoPoints
// GET /api/rankings/week - Top 10 de la semana
// GET /api/rankings/month - Top 10 del mes
// GET /api/rankings/all-time - Top 10 de todos los tiempos
// PUT /api/users/:userId/profile-visibility - Configurar privacidad
```

---

## Roadmap de Funcionalidades Futuras

- [ ] **Retos semanales**: Gana EcoPoints extra completando retos (ej: "Planta 3 árboles esta semana")
- [ ] **Badges especiales**: Insignias por logros únicos (ej: "Primer árbol en tu ciudad", "Plantaste en 5 provincias")
- [ ] **Seguimiento de amigos**: Ve el ranking de tus amigos
- [ ] **Notificaciones de ranking**: "¡Subiste al puesto #5 esta semana!"
- [ ] **Marketplace de beneficios**: Canjea EcoPoints por descuentos adicionales o merchandise
