import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { useToast } from '@shared/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  CheckSquare,
  Loader2,
  RefreshCw,
  Eye
} from 'lucide-react';
import workOrderService from '@/modules/admin/services/workOrderService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'pendiente_autorizacion':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'autorizada':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'asignada_vivero':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'vivero_preparando':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'planta_lista':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'entregada_plantador':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'plantador_en_camino':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'plantando':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'plantada':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelada':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'timeout_vivero':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status) => {
  const labels = {
    'pendiente_autorizacion': 'Pend. Autorización',
    'autorizada': 'Autorizada',
    'asignada_vivero': 'Asignada a Vivero',
    'vivero_preparando': 'Vivero Preparando',
    'planta_lista': 'Planta Lista',
    'entregada_plantador': 'Entregada a Plantador',
    'plantador_en_camino': 'Plantador en Camino',
    'plantando': 'Plantando',
    'plantada': 'Plantada',
    'cancelada': 'Cancelada',
    'timeout_vivero': 'Timeout Vivero'
  };
  return labels[status] || status;
};

export default function AdminWorkOrdersContent() {
  const [workOrders, setWorkOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [authorizingId, setAuthorizingId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadWorkOrders();
  }, []);

  useEffect(() => {
    // Filtrar órdenes localmente
    if (statusFilter === 'all') {
      setFilteredOrders(workOrders);
    } else {
      setFilteredOrders(workOrders.filter(order => order.status === statusFilter));
    }
  }, [workOrders, statusFilter]);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const data = await workOrderService.getWorkOrders();
      setWorkOrders(data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes de trabajo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (orderId) => {
    try {
      setAuthorizingId(orderId);
      await workOrderService.updateWorkOrderStatus(orderId, 'autorizada', 'Autorizada por admin');
      await loadWorkOrders();
      toast({
        title: "Éxito",
        description: "Orden de trabajo autorizada correctamente",
      });
    } catch (error) {
      console.error('Error autorizando orden:', error);
      toast({
        title: "Error",
        description: "No se pudo autorizar la orden de trabajo",
        variant: "destructive"
      });
    } finally {
      setAuthorizingId(null);
    }
  };

  // Calcular estadísticas
  const totalOrders = workOrders.length;
  const pendingAuth = workOrders.filter(o => o.status === 'pendiente_autorizacion').length;
  const inProgress = workOrders.filter(
    o => !['plantada', 'cancelada', 'timeout_vivero', 'pendiente_autorizacion'].includes(o.status)
  ).length;
  const completed = workOrders.filter(o => o.status === 'plantada').length;

  const stats = [
    {
      title: 'Total Órdenes',
      value: totalOrders.toLocaleString(),
      icon: ClipboardList,
      gradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'Pendientes Autorización',
      value: pendingAuth.toLocaleString(),
      icon: Clock,
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'En Progreso',
      value: inProgress.toLocaleString(),
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Completadas',
      value: completed.toLocaleString(),
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando órdenes de trabajo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-800 flex items-center gap-2">
            <ClipboardList className="h-8 w-8" />
            Gestión de Órdenes de Trabajo
          </h1>
          <p className="text-gray-600 mt-2">
            Rastrear y gestionar órdenes de trabajo en todo el flujo de plantación
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadWorkOrders}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Recargar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-red-800">Todas las Órdenes de Trabajo</CardTitle>
              <CardDescription>Lista completa de órdenes con seguimiento de estado</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente_autorizacion">Pendiente Autorización</SelectItem>
                <SelectItem value="autorizada">Autorizada</SelectItem>
                <SelectItem value="asignada_vivero">Asignada a Vivero</SelectItem>
                <SelectItem value="vivero_preparando">Vivero Preparando</SelectItem>
                <SelectItem value="planta_lista">Planta Lista</SelectItem>
                <SelectItem value="entregada_plantador">Entregada a Plantador</SelectItem>
                <SelectItem value="plantador_en_camino">Plantador en Camino</SelectItem>
                <SelectItem value="plantando">Plantando</SelectItem>
                <SelectItem value="plantada">Plantada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="timeout_vivero">Timeout Vivero</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No se encontraron órdenes de trabajo con el filtro aplicado
            </p>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700">ID Orden</th>
                      <th className="text-left p-4 font-semibold text-gray-700">ID Árbol</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Vivero</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Plantador</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Fecha Creación</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-mono font-medium text-gray-900">#{order.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-900">#{order.tree_id}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-900 text-sm">
                            {order.vivero_id ? `Vivero #${order.vivero_id}` : 'No asignado'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-900 text-sm">
                            {order.plantador_id ? `Plantador #${order.plantador_id}` : 'No asignado'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-600 text-sm">
                            {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {order.status === 'pendiente_autorizacion' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAuthorize(order.id)}
                                disabled={authorizingId === order.id}
                                className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                                title="Autorizar orden"
                              >
                                {authorizingId === order.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckSquare className="h-4 w-4 mr-1" />
                                    Autorizar
                                  </>
                                )}
                              </Button>
                            )}

                            {order.status === 'autorizada' && order.authorized_by && (
                              <div className="text-xs text-green-600">
                                Autorizada por admin #{order.authorized_by}
                              </div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Results count */}
              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  Mostrando {filteredOrders.length} de {totalOrders} órdenes de trabajo
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
