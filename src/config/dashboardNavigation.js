import {
  TreePine, User, Award, Heart, Gift, TrendingUp, Settings,
  Building2, BarChart3, FileText, Users, DollarSign,
  Shield, UserCog, Database, Activity, AlertTriangle, UserCheck,
  Sprout, ClipboardList, MapPin, CheckCircle,
  Leaf, Package, Truck, Clock
} from 'lucide-react';

/**
 * Configuración centralizada de navegación por rol
 * Cada rol tiene su propio conjunto de items del sidebar
 */

export const dashboardNavigation = {
  user: {
    basePath: '/usuario',
    label: 'Usuario',
    items: [
      {
        id: 'trees',
        label: 'Mis Árboles',
        icon: TreePine,
        path: '/arboles',
        description: 'Ver y gestionar tus árboles plantados'
      },
      {
        id: 'progress',
        label: 'Progreso',
        icon: TrendingUp,
        path: '/progreso',
        description: 'Seguimiento del crecimiento de tus árboles'
      },
      {
        id: 'feed',
        label: 'Comunidad',
        icon: Heart,
        path: '/feed',
        description: 'Comparte y conecta con otros usuarios'
      },
      {
        id: 'profile',
        label: 'Mi Perfil',
        icon: User,
        path: '/perfil',
        description: 'Gestiona tu información personal'
      },
      {
        id: 'rewards',
        label: 'Premios',
        icon: Gift,
        path: '/premios',
        description: 'Tus logros y recompensas'
      }
    ]
  },

  company: {
    basePath: '/empresa',
    label: 'Empresa',
    items: [
      {
        id: 'overview',
        label: 'Resumen',
        icon: BarChart3,
        path: '/dashboard',
        description: 'Vista general de tu impacto ambiental'
      },
      {
        id: 'carbon',
        label: 'Huella de Carbono',
        icon: Activity,
        path: '/carbono',
        description: 'Calcula y compensa tu huella'
      },
      {
        id: 'projects',
        label: 'Proyectos',
        icon: TreePine,
        path: '/proyectos',
        description: 'Gestiona tus proyectos de reforestación'
      },
      {
        id: 'reports',
        label: 'Reportes',
        icon: FileText,
        path: '/reportes',
        description: 'Informes de impacto y sostenibilidad'
      },
      {
        id: 'team',
        label: 'Equipo',
        icon: Users,
        path: '/equipo',
        description: 'Gestión de miembros del equipo'
      },
      {
        id: 'billing',
        label: 'Facturación',
        icon: DollarSign,
        path: '/facturacion',
        description: 'Historial de pagos y facturas'
      }
    ]
  },

  admin: {
    basePath: '/admin',
    label: 'Administrador',
    items: [
      {
        id: 'overview',
        label: 'Panel Principal',
        icon: Shield,
        path: '/dashboard',
        description: 'Vista general del sistema'
      },
      {
        id: 'users',
        label: 'Usuarios',
        icon: UserCog,
        path: '/usuarios',
        description: 'Gestión de usuarios del sistema'
      },
      {
        id: 'trees',
        label: 'Árboles',
        icon: TreePine,
        path: '/arboles',
        description: 'Administración de todos los árboles'
      },
      {
        id: 'workorders',
        label: 'Órdenes de Trabajo',
        icon: ClipboardList,
        path: '/ordenes',
        description: 'Gestión de órdenes de plantación'
      },
      {
        id: 'reports',
        label: 'Reportes',
        icon: BarChart3,
        path: '/reportes',
        description: 'Análisis y estadísticas del sistema'
      },
      {
        id: 'moderation',
        label: 'Moderación',
        icon: AlertTriangle,
        path: '/moderacion',
        description: 'Contenido reportado y moderación'
      },
      {
        id: 'approvals',
        label: 'Aprobaciones',
        icon: UserCheck,
        path: '/aprobaciones',
        description: 'Aprobar perfiles de viveros y plantadores'
      },
      {
        id: 'database',
        label: 'Base de Datos',
        icon: Database,
        path: '/database',
        description: 'Gestión avanzada de datos'
      }
    ]
  },

  plantador: {
    basePath: '/plantador',
    label: 'Plantador',
    items: [
      {
        id: 'dashboard',
        label: 'Mi Dashboard',
        icon: Sprout,
        path: '/dashboard',
        description: 'Resumen de tu actividad'
      },
      {
        id: 'pending',
        label: 'Órdenes Pendientes',
        icon: Clock,
        path: '/pendientes',
        description: 'Órdenes listas para plantar'
      },
      {
        id: 'active',
        label: 'En Proceso',
        icon: Sprout,
        path: '/activas',
        description: 'Plantaciones en curso'
      },
      {
        id: 'completed',
        label: 'Completadas',
        icon: CheckCircle,
        path: '/completadas',
        description: 'Plantaciones finalizadas'
      },
      {
        id: 'map',
        label: 'Mapa de Zonas',
        icon: MapPin,
        path: '/mapa',
        description: 'Ubicaciones de plantación'
      },
      {
        id: 'stats',
        label: 'Mis Estadísticas',
        icon: TrendingUp,
        path: '/estadisticas',
        description: 'Tu rendimiento y logros'
      }
    ]
  },

  vivero: {
    basePath: '/vivero',
    label: 'Vivero',
    items: [
      {
        id: 'dashboard',
        label: 'Panel Principal',
        icon: Leaf,
        path: '/dashboard',
        description: 'Vista general del vivero'
      },
      {
        id: 'inventory',
        label: 'Inventario',
        icon: Package,
        path: '/inventario',
        description: 'Stock de árboles disponibles'
      },
      {
        id: 'orders',
        label: 'Órdenes Recibidas',
        icon: ClipboardList,
        path: '/ordenes',
        description: 'Solicitudes de preparación'
      },
      {
        id: 'preparation',
        label: 'En Preparación',
        icon: Clock,
        path: '/preparacion',
        description: 'Árboles siendo preparados'
      },
      {
        id: 'ready',
        label: 'Listos para Envío',
        icon: CheckCircle,
        path: '/listos',
        description: 'Árboles preparados'
      },
      {
        id: 'shipments',
        label: 'Envíos',
        icon: Truck,
        path: '/envios',
        description: 'Historial de despachos'
      }
    ]
  }
};

// Alias para compatibilidad con backend en español
dashboardNavigation.empresa = dashboardNavigation.company;

/**
 * Obtiene la configuración de navegación para un rol específico
 * @param {string} role - El rol del usuario ('user', 'company', 'admin', etc.)
 * @returns {object} Configuración de navegación del rol
 */
export const getNavigationForRole = (role) => {
  return dashboardNavigation[role] || dashboardNavigation.user;
};

/**
 * Obtiene todos los roles disponibles
 * @returns {string[]} Array de nombres de roles
 */
export const getAllRoles = () => {
  return Object.keys(dashboardNavigation);
};

/**
 * Genera la ruta completa para un item de navegación
 * @param {string} role - El rol del usuario
 * @param {string} userId - ID del usuario
 * @param {string} itemPath - Path del item (ej: '/arboles')
 * @returns {string} Ruta completa
 */
export const getFullPath = (role, userId, itemPath) => {
  const config = getNavigationForRole(role);
  return `${config.basePath}/${userId}${itemPath}`;
};
