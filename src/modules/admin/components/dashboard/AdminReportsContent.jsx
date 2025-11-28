import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { useToast } from '@shared/components/ui/use-toast';
import { BarChart3, TrendingUp, Download, FileText, Calendar, Loader2, RefreshCw, Users, TreePine, ClipboardList } from 'lucide-react';
import statsService from '@/modules/admin/services/statsService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminReportsContent() {
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getSystemStats();
      setSystemStats(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!systemStats) return;

    // Crear CSV simple
    const csvData = [];

    // Header
    csvData.push(['Categoría', 'Tipo', 'Cantidad'].join(','));

    // Usuarios por rol
    systemStats.users_by_role?.forEach(item => {
      csvData.push(['Usuarios', item.role, item.count].join(','));
    });

    // Árboles por estado
    systemStats.trees_by_status?.forEach(item => {
      csvData.push(['Árboles', item.status, item.count].join(','));
    });

    // Órdenes por estado
    systemStats.work_orders_by_status?.forEach(item => {
      csvData.push(['Órdenes', item.status, item.count].join(','));
    });

    // Crear blob y descargar
    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `reporte-sistema-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Éxito",
      description: "Reporte CSV descargado correctamente",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!systemStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay datos disponibles</p>
        <Button onClick={loadStats} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  // Calcular totales
  const totalUsers = systemStats.users_by_role?.reduce((sum, r) => sum + r.count, 0) || 0;
  const totalTrees = systemStats.trees_by_status?.reduce((sum, t) => sum + t.count, 0) || 0;
  const totalOrders = systemStats.work_orders_by_status?.reduce((sum, w) => sum + w.count, 0) || 0;

  const stats = [
    {
      title: 'Total Usuarios',
      value: totalUsers.toLocaleString(),
      change: 'En vivo',
      icon: Users,
      gradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'Total Árboles',
      value: totalTrees.toLocaleString(),
      change: 'En vivo',
      icon: TreePine,
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      title: 'Total Órdenes',
      value: totalOrders.toLocaleString(),
      change: 'En vivo',
      icon: ClipboardList,
      gradient: 'from-red-600 to-red-500'
    }
  ];

  // Preparar datos para gráficos
  const usersData = systemStats.users_by_role || [];
  const treesData = systemStats.trees_by_status || [];
  const ordersData = systemStats.work_orders_by_status || [];

  const maxUsers = Math.max(...usersData.map(d => d.count), 1);
  const maxTrees = Math.max(...treesData.map(d => d.count), 1);
  const maxOrders = Math.max(...ordersData.map(d => d.count), 1);

  const roleLabels = {
    'user': 'Usuarios',
    'company': 'Empresas',
    'plantador': 'Plantadores',
    'vivero': 'Viveros',
    'admin': 'Administradores'
  };

  const statusLabels = {
    'sin_plantar': 'Sin Plantar',
    'en_proceso': 'En Proceso',
    'plantado': 'Plantado',
    'verificado': 'Verificado'
  };

  const orderStatusLabels = {
    'pendiente_autorizacion': 'Pend. Autorización',
    'autorizada': 'Autorizada',
    'asignada_vivero': 'Asignada a Vivero',
    'vivero_preparando': 'Vivero Preparando',
    'planta_lista': 'Planta Lista',
    'entregada_plantador': 'Entregada',
    'plantador_en_camino': 'En Camino',
    'plantando': 'Plantando',
    'plantada': 'Plantada'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-800 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Reportes del Sistema
          </h1>
          <p className="text-gray-600 mt-2">
            Generar y descargar estadísticas del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadStats}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleExportCSV}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
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
              <p className="text-xs text-gray-600 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usuarios por Rol */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-red-800">Usuarios por Rol</CardTitle>
              <CardDescription>Distribución de usuarios por tipo de cuenta</CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {format(lastUpdate, "HH:mm:ss", { locale: es })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usersData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">
                  {roleLabels[data.role] || data.role}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(data.count / maxUsers) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{data.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Árboles por Estado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800">Árboles por Estado</CardTitle>
          <CardDescription>Distribución de árboles según su estado de plantación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {treesData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">
                  {statusLabels[data.status] || data.status}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(data.count / maxTrees) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{data.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Órdenes por Estado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800">Órdenes de Trabajo por Estado</CardTitle>
          <CardDescription>Distribución de órdenes según su progreso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ordersData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-40 text-sm font-medium text-gray-700">
                  {orderStatusLabels[data.status] || data.status}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(data.count / maxOrders) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{data.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Acerca de los Reportes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-2">
          <p>• Los datos se actualizan en tiempo real desde la base de datos</p>
          <p>• Puedes exportar los datos a formato CSV para análisis adicional</p>
          <p>• Las estadísticas incluyen usuarios, árboles y órdenes de trabajo</p>
          <p>• Los gráficos muestran la distribución proporcional de cada categoría</p>
        </CardContent>
      </Card>
    </div>
  );
}
