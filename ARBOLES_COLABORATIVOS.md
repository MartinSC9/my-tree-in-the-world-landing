# Sistema de Árboles Colaborativos

## Descripción General

Los **árboles colaborativos** permiten que múltiples usuarios aporten dinero para plantar un árbol en conjunto. Este sistema facilita la participación de usuarios que desean contribuir al medio ambiente sin tener que pagar el costo completo de un árbol individual.

## Flujo de Trabajo

### 1. Creación de Árbol Colaborativo

Un usuario (o administrador) puede crear un árbol colaborativo especificando:
- **Ubicación**: Coordenadas donde se plantará el árbol
- **Especie**: Tipo de árbol a plantar
- **Precio objetivo**: Monto total necesario para plantar el árbol
- **Descripción**: Información sobre el proyecto (opcional)
- **Fecha límite**: Fecha máxima para alcanzar el objetivo (opcional)
- **Imagen**: Foto del lugar o del tipo de árbol (opcional)

**Estado inicial**: `abierto`

### 2. Contribuciones de Usuarios

Los usuarios pueden:
- Ver todos los árboles colaborativos disponibles
- Filtrar por ubicación, especie, progreso
- Ver el progreso de cada árbol (monto recaudado vs objetivo)
- Aportar cualquier cantidad de dinero (con mínimo configurable)

Cada contribución registra:
- Usuario que aporta
- Árbol colaborativo
- Monto aportado
- Fecha y hora
- Método de pago

### 3. Estados del Árbol Colaborativo

| Estado | Descripción |
|--------|-------------|
| `abierto` | Aceptando contribuciones, aún no alcanzó el objetivo |
| `completado` | Objetivo alcanzado, listo para convertirse en árbol real |
| `sin_plantar` | Convertido en árbol físico, esperando plantación |
| `cancelado` | Cancelado (tiempo expirado o motivo admin) |
| `reembolsado` | Fondos devueltos a contribuyentes |

### 4. Completar Objetivo

Cuando las contribuciones alcanzan o superan el precio objetivo:

1. El árbol colaborativo cambia a estado `completado`
2. Se cierra para nuevas contribuciones
3. Automáticamente se crea un árbol en la tabla `trees` con:
   - Estado: `sin_plantar`
   - Usuario creador: Usuario que hizo la última contribución (o usuario que creó el árbol colaborativo)
   - Ubicación y especie del árbol colaborativo
4. El árbol sigue el flujo normal de work orders

### 5. Reconocimiento de Contribuyentes

Todos los usuarios que aportaron:
- Aparecen en la lista de contribuyentes del árbol
- Reciben una notificación cuando el árbol se completa
- Pueden ver el progreso del árbol en su dashboard
- Reciben certificado especial de "Árbol Colaborativo" con sus datos y el porcentaje aportado

## Base de Datos

### Tabla: `collaborative_trees`

```sql
CREATE TABLE collaborative_trees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  created_by INT NOT NULL,
  tree_species VARCHAR(100) NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  location_name VARCHAR(255),
  target_price DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0.00,
  description TEXT,
  image_url VARCHAR(255),
  deadline DATE,
  status ENUM('abierto', 'completado', 'sin_plantar', 'cancelado', 'reembolsado') DEFAULT 'abierto',
  created_tree_id INT NULL, -- Referencia al árbol creado cuando se completa
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (created_tree_id) REFERENCES trees(id),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
);
```

### Tabla: `collaborative_contributions`

```sql
CREATE TABLE collaborative_contributions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  collaborative_tree_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  message TEXT, -- Mensaje opcional del contribuyente
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collaborative_tree_id) REFERENCES collaborative_trees(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_tree (collaborative_tree_id),
  INDEX idx_user (user_id)
);
```

## API Endpoints

### Backend Routes: `/api/collaborative-trees`

| Método | Ruta | Descripción | Permisos |
|--------|------|-------------|----------|
| GET | `/` | Listar árboles colaborativos abiertos | Todos |
| GET | `/:id` | Obtener detalles de un árbol colaborativo | Todos |
| POST | `/` | Crear árbol colaborativo | User, Admin |
| POST | `/:id/contribute` | Aportar a un árbol colaborativo | User, Admin |
| GET | `/:id/contributors` | Ver contribuyentes de un árbol | Todos |
| GET | `/my-contributions` | Ver mis contribuciones | User autenticado |
| PATCH | `/:id/cancel` | Cancelar árbol colaborativo | Admin |

## Frontend Components

### Componentes Nuevos

1. **`CollaborativeTreesGallery.jsx`**
   - Muestra grid de árboles colaborativos disponibles
   - Cards con imagen, especie, ubicación, progreso
   - Barra de progreso visual
   - Botón "Aportar"

2. **`CollaborativeTreeCard.jsx`**
   - Card individual de árbol colaborativo
   - Muestra progreso, contribuyentes, tiempo restante
   - Botón de acción según estado

3. **`ContributeModal.jsx`**
   - Modal para hacer una contribución
   - Input de monto con validación
   - Selector de método de pago
   - Campo opcional de mensaje
   - Confirmación y procesamiento

4. **`MyContributions.jsx`**
   - Lista de árboles a los que el usuario ha aportado
   - Muestra estado actual de cada árbol
   - Enlace para ver detalles

### Integración en UserDashboard

Agregar nueva sección en el dashboard del usuario:
- Tab "Árboles Colaborativos"
- Vista de árboles disponibles
- Vista de mis contribuciones
- Filtros por estado, ubicación, progreso

## Consideraciones de Implementación

### Validaciones

- Monto mínimo de contribución: Configurable (ej: $1.00)
- Monto máximo: No puede exceder el faltante para completar el objetivo
- Un usuario puede contribuir múltiples veces al mismo árbol
- No se pueden hacer contribuciones a árboles cerrados/completados

### Notificaciones

Los usuarios reciben notificaciones cuando:
- Alguien aporta al árbol que crearon
- Un árbol al que aportaron alcanza el 50%
- Un árbol al que aportaron se completa
- Un árbol al que aportaron comienza a plantarse
- Un árbol al que aportaron se planta exitosamente

### Seguridad

- Validar que el usuario esté autenticado
- Validar montos positivos
- Prevenir race conditions al completar objetivo
- Auditar todas las contribuciones
- Verificar integridad del monto recaudado

### Procesamiento de Pagos

Por ahora, el sistema registra las contribuciones con estado "pendiente". En el futuro se puede integrar:
- Pasarela de pago (Stripe, PayPal, MercadoPago)
- Validación de pago antes de registrar contribución
- Sistema de reembolsos automáticos

## Reglas de Negocio

1. **Límite de tiempo**: Si un árbol colaborativo tiene deadline y no alcanza el objetivo, se marca como `cancelado`
2. **Excedente**: Si las contribuciones superan el objetivo, el excedente se puede:
   - Devolver proporcionalmente a los contribuyentes
   - Usar para el siguiente árbol colaborativo
   - Donar al sistema (decisión del admin)
3. **Cancelación**: Solo admins pueden cancelar árboles colaborativos
4. **Reembolsos**: Si un árbol se cancela, se pueden reembolsar las contribuciones
5. **Árbol creado**: Al completarse, se asigna el árbol al usuario que creó el árbol colaborativo o al que hizo la mayor contribución

## Ejemplo de Uso

### Usuario crea árbol colaborativo

```
Juan crea un árbol colaborativo:
- Especie: Pino
- Ubicación: Parque Nacional, Bariloche
- Precio objetivo: $50.00
- Descripción: "Plantar un pino en memoria de mi abuelo"
```

### Otros usuarios aportan

```
- María aporta $10.00 (20%)
- Pedro aporta $15.00 (30%)
- Ana aporta $5.00 (10%)
- Carlos aporta $20.00 (40%)
Total: $50.00 ✅
```

### Sistema completa el árbol

```
1. Árbol colaborativo → estado: completado
2. Se crea árbol en tabla trees:
   - id: 123
   - user_id: 1 (Juan, creador)
   - status: sin_plantar
   - species: Pino
   - latitude/longitude: coords de Bariloche
3. Notificaciones a Juan, María, Pedro, Ana, Carlos
4. Árbol entra en workflow de plantación
```

## Métricas y Estadísticas

El sistema debe rastrear:
- Total de árboles colaborativos creados
- Total de árboles completados vs cancelados
- Monto total recaudado
- Promedio de contribuyentes por árbol
- Tiempo promedio para completar objetivo
- Usuario más activo en contribuciones
- Especies más populares

## Roadmap Futuro

1. **Fase 1** (MVP): CRUD básico, contribuciones, completar objetivo
2. **Fase 2**: Integración de pagos real, notificaciones push
3. **Fase 3**: Gamificación (badges, rankings)
4. **Fase 4**: Árboles colaborativos corporativos (empresas)
5. **Fase 5**: Matching (empresa dobla las contribuciones)
6. **Fase 6**: Árboles colaborativos con objetivos de impacto (CO2, biodiversidad)
