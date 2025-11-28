import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { useToast } from '@shared/components/ui/use-toast';
import { Shield, Users, TreePine, Building2, DollarSign, Activity, Loader2 } from 'lucide-react';
import statsService from '@/modules/admin/services/statsService';
import auditService from '@/modules/admin/services/auditService';
import alertService from '@/modules/admin/services/alertService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminDashboardContent() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stuckOrders, setStuckOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas, logs y órdenes estancadas en paralelo
      const [systemStats, auditLogs, stuckOrdersData] = await Promise.all([
        statsService.getSystemStats(),
        auditService.getRecentLogs(10),
        alertService.getStuckOrders().catch(() => ({ stuck_orders: [], count: 0 }))
      ]);

      // Transformar stats del backend al formato de la UI
      const transformedStats = transformSystemStats(systemStats);
      setStats(transformedStats);

      // Transformar audit logs a recent activity
      const activities = auditLogs.map(log => ({
        id: log.id,
        action: formatEventType(log.event_type),
        user: log.user_id || 'Sistema',
        time: formatDistanceToNow(new Date(log.created_at), { locale: es, addSuffix: true }),
        type: getActivityType(log.event_type),
        description: log.event_description
      }));
      setRecentActivity(activities);

      // Guardar órdenes estancadas
      setStuckOrders(stuckOrdersData.stuck_orders || []);

      // Generar alertas basadas en los datos
      const generatedAlerts = generateAlerts(systemStats, stuckOrdersData);
      setAlerts(generatedAlerts);

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

  const transformSystemStats = (systemStats) => {
    // Calcular totales desde los arrays del backend
    const totalUsers = systemStats.users_by_role?.reduce((sum, r) => sum + r.count, 0) || 0;
    const totalTrees = systemStats.trees_by_status?.reduce((sum, t) => sum + t.count, 0) || 0;
    const totalWorkOrders = systemStats.work_orders_by_status?.reduce((sum, w) => sum + w.count, 0) || 0;
    const companies = systemStats.users_by_role?.find(r => r.role === 'company')?.count || 0;
    const activePlanters = systemStats.active_planters || 0;

    // Calcular órdenes activas (no completadas)
    const activeOrders = systemStats.work_orders_by_status?.filter(
      w => !['plantada', 'cancelada', 'timeout_vivero'].includes(w.status)
    ).reduce((sum, w) => sum + w.count, 0) || 0;

    return [
      {
        title: 'Total Usuarios',
        value: totalUsers.toLocaleString(),
        change: '+12.5%', // TODO: Calcular cambio real
        icon: Users,
        gradient: 'from-red-500 to-orange-500'
      },
      {
        title: 'Total Árboles',
        value: totalTrees.toLocaleString(),
        change: '+23.1%', // TODO: Calcular cambio real
        icon: TreePine,
        gradient: 'from-orange-500 to-amber-500'
      },
      {
        title: 'Órdenes Activas',
        value: activeOrders.toLocaleString(),
        change: '+5.2%', // TODO: Calcular cambio real
        icon: Activity,
        gradient: 'from-red-600 to-red-500'
      },
      {
        title: 'Empresas',
        value: companies.toLocaleString(),
        change: '+8.3%', // TODO: Calcular cambio real
        icon: Building2,
        gradient: 'from-orange-600 to-orange-500'
      },
      {
        title: 'Plantadores Activos',
        value: activePlanters.toLocaleString(),
        change: '+15.3%', // TODO: Calcular cambio real
        icon: DollarSign,
        gradient: 'from-amber-500 to-yellow-500'
      },
      {
        title: 'Salud del Sistema',
        value: '98.5%',
        change: '+0.5%',
        icon: Shield,
        gradient: 'from-red-500 to-pink-500'
      }
    ];
  };

  const formatEventType = (eventType) => {
    const eventMap = {
      'user_created': 'Usuario registrado',
      'user_updated': 'Usuario actualizado',
      'user_deleted': 'Usuario eliminado',
      'user_restored': 'Usuario restaurado',
      'user_role_changed': 'Rol de usuario cambiado',
      'user_activated': 'Usuario activado',
      'user_deactivated': 'Usuario desactivado',
      'work_order_created': 'Orden de trabajo creada',
      'work_order_updated': 'Orden de trabajo actualizada',
      'work_order_timeout': 'Timeout de vivero',
      'tree_created': 'Árbol creado',
      'tree_planted': 'Árbol plantado',
      'post_created': 'Post publicado',
      'post_flagged': 'Post reportado',
      'post_hidden': 'Post ocultado',
      'login_attempt': 'Intento de login',
      'password_changed': 'Contraseña cambiada'
    };

    return eventMap[eventType] || eventType;
  };

  const getActivityType = (eventType) => {
    if (eventType.startsWith('user_')) return 'user';
    if (eventType.startsWith('work_order_')) return 'order';
    if (eventType.startsWith('tree_')) return 'tree';
    if (eventType.startsWith('post_')) return 'post';
    return 'system';
  };

  const generateAlerts = (systemStats, stuckOrdersData) => {
    const alerts = [];

    // 🚨 ALERTA CRÍTICA: Órdenes estancadas >48h
    if (stuckOrdersData && stuckOrdersData.count > 0) {
      const maxHours = Math.max(...stuckOrdersData.stuck_orders.map(o => o.hours_stuck));
      alerts.push({
        id: 'stuck_orders',
        message: `${stuckOrdersData.count} orden(es) sin plantador por más de 48h (máx: ${Math.floor(maxHours)}h)`,
        severity: 'error',
        time: 'Requiere atención inmediata'
      });
    }

    // ⚠️ Alerta de órdenes pendientes de autorización
    const pendingAuth = systemStats.work_orders_by_status?.find(
      w => w.status === 'pendiente_autorizacion'
    );
    if (pendingAuth && pendingAuth.count > 0) {
      alerts.push({
        id: 'pending_auth',
        message: `${pendingAuth.count} órdenes de trabajo pendientes de autorización`,
        severity: 'warning',
        time: 'Ahora'
      });
    }

    // ✅ Sistema saludable (si no hay alertas críticas)
    if (alerts.length === 0) {
      alerts.push({
        id: 'system_health',
        message: 'Sistema funcionando correctamente - Sin alertas pendientes',
        severity: 'success',
        time: 'Monitoreo continuo'
      });
    }

    return alerts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-red-800 flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Vista completa del estado del sistema, actividad de usuarios y métricas operacionales
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats && stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1 font-semibold">
                {stat.change} del mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas acciones y eventos en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay actividad reciente</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'order' ? 'bg-orange-500' :
                        activity.type === 'tree' ? 'bg-green-500' :
                        activity.type === 'post' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description || `Usuario ${activity.user}`}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => window.location.href = '/admin/dashboard/usuarios'}
            >
              Ver Toda la Actividad
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>Notificaciones importantes y advertencias</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay alertas</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'error' ? 'bg-red-50 border-red-500' :
                      alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      alert.severity === 'success' ? 'bg-green-50 border-green-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => window.location.href = '/admin/dashboard/ordenes'}
            >
              Ver Órdenes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800">Estadísticas Rápidas</CardTitle>
          <CardDescription>Indicadores clave de rendimiento de un vistazo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50">
              <p className="text-sm text-gray-600 mb-1">Tiempo Respuesta Promedio</p>
              <p className="text-2xl font-bold text-red-700">2.3h</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50">
              <p className="text-sm text-gray-600 mb-1">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-orange-700">94.2%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
              <p className="text-sm text-gray-600 mb-1">Sesiones Activas</p>
              <p className="text-2xl font-bold text-red-700">267</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50">
              <p className="text-sm text-gray-600 mb-1">Tasa de Completitud</p>
              <p className="text-2xl font-bold text-amber-700">87.5%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
