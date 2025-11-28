import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { DollarSign, Download, CreditCard, Calendar, FileText } from 'lucide-react';

const mockBillingHistory = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    date: '2024-01-15',
    amount: 750000,
    trees: 50,
    status: 'Pagado',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    date: '2024-02-15',
    amount: 1500000,
    trees: 100,
    status: 'Pagado',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    date: '2024-03-15',
    amount: 2250000,
    trees: 150,
    status: 'Pagado',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-004',
    date: '2024-04-15',
    amount: 1125000,
    trees: 75,
    status: 'Pendiente',
    statusColor: 'bg-yellow-100 text-yellow-800'
  }
];

export default function CompanyBillingContent() {
  const totalPaid = mockBillingHistory
    .filter(b => b.status === 'Pagado')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalTrees = mockBillingHistory
    .filter(b => b.status === 'Pagado')
    .reduce((sum, b) => sum + b.trees, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-800">Facturación y Pagos</h1>
        <p className="text-gray-600 mt-2">Gestiona tu historial de pagos y descarga facturas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Total Invertido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${totalPaid.toLocaleString('es-CO')}
            </p>
            <p className="text-sm text-purple-100 mt-1">COP</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Árboles Financiados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTrees}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Facturas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockBillingHistory.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Card */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Método de Pago Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Tarjeta de Crédito</p>
                <p className="text-sm text-gray-600">•••• •••• •••• 4532</p>
                <p className="text-xs text-gray-500 mt-1">Expira 12/2025</p>
              </div>
            </div>
            <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-800">Historial de Facturación</CardTitle>
          <CardDescription>Todas tus transacciones y facturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3 font-semibold">N° Factura</th>
                  <th className="pb-3 font-semibold">Fecha</th>
                  <th className="pb-3 font-semibold">Monto</th>
                  <th className="pb-3 font-semibold">Árboles</th>
                  <th className="pb-3 font-semibold">Estado</th>
                  <th className="pb-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {mockBillingHistory.map((bill) => (
                  <tr key={bill.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{bill.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(bill.date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">
                          ${bill.amount.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-gray-900">{bill.trees} árboles</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bill.statusColor}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Información de Facturación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-gray-700">
            <p>
              Las facturas se generan automáticamente después de cada compra de árboles.
              Puedes descargarlas en formato PDF en cualquier momento desde esta página.
            </p>
            <p className="text-sm text-gray-600 mt-3">
              Para soporte de facturación, contacta a: <a href="mailto:facturacion@miarbol.com" className="text-purple-600 hover:underline">facturacion@miarbol.com</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}