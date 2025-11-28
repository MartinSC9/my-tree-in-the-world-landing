import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@shared/components/ui/dialog';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/components/ui/card';
import { Progress } from '@shared/components/ui/progress';
import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  FaTree, FaMapMarkerAlt, FaCalendar, FaUser, FaHeart, FaSpinner,
  FaCheckCircle, FaExclamationTriangle, FaUsers, FaClock
} from 'react-icons/fa';
import { X } from 'lucide-react';
import {
  contributeToTree,
  formatCurrency,
  calculateFundingPercentage,
  calculateRemainingAmount,
  getContributors
} from '@features/collaborative-trees/services';

// Modal with enhanced UI/UX for collaborative tree projects
const ProjectDetailModal = ({ project, isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [loadingContributors, setLoadingContributors] = useState(false);

  const currentAmount = parseFloat(project.current_amount) || 0;
  const targetAmount = parseFloat(project.target_amount) || 0;
  const remainingAmount = calculateRemainingAmount(currentAmount, targetAmount);
  const fundingPercentage = calculateFundingPercentage(currentAmount, targetAmount);
  const isFullyFunded = fundingPercentage >= 100;

  // Cargar contribuyentes
  useEffect(() => {
    if (isOpen && project.id) {
      loadContributors();
    }
  }, [isOpen, project.id]);

  const loadContributors = async () => {
    try {
      setLoadingContributors(true);
      const data = await getContributors(project.id);
      setContributors(data.contributors || []);
    } catch (err) {
      console.error('Error al cargar contribuyentes:', err);
    } finally {
      setLoadingContributors(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const contributionAmount = parseFloat(amount);

    // Validaciones
    if (!contributionAmount || contributionAmount <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    if (contributionAmount > remainingAmount) {
      setError(`El monto no puede exceder el faltante de ${formatCurrency(remainingAmount)}`);
      return;
    }

    if (contributionAmount < 100) {
      setError('El monto mínimo de contribución es $100');
      return;
    }

    try {
      setLoading(true);

      const contributionData = {
        amount: contributionAmount,
        message: message.trim() || null,
        payment_method: paymentMethod
      };

      const response = await contributeToTree(project.id, contributionData);

      setSuccess(true);

      // Esperar 2 segundos antes de cerrar
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(response);
        }
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error al contribuir:', err);
      setError(err.error || 'Error al procesar la contribución. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setMessage('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha desconocida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 gap-0" style={{ zIndex: 99999 }}>
        {success ? (
          <div className="py-16 px-8 text-center bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <FaCheckCircle className="text-5xl text-green-600 animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold text-green-800 mb-3">
              ¡Contribución exitosa!
            </h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Gracias por tu aporte. Juntos estamos haciendo la diferencia para un futuro más verde.
            </p>
          </div>
        ) : (
          <>
            {/* Header mejorado */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg z-10">
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <FaTree className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {project.tree_name}
                    </h3>
                    <p className="text-green-50 text-sm font-medium">{project.tree_species}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  disabled={loading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Columna izquierda: Detalles del proyecto */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Descripción */}
                    <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                          Descripción del Proyecto
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {project.description || 'Sin descripción disponible'}
                      </p>
                      {project.message && (
                        <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 shadow-sm">
                          <div className="flex items-start gap-3">
                            <FaHeart className="text-green-500 text-xl mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-700 italic text-base leading-relaxed">
                                "{project.message}"
                              </p>
                              <p className="text-sm text-gray-600 mt-3 font-medium">
                                — {project.creator_name || 'Creador'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Información del creador */}
                  <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                        Creador del Proyecto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          <FaUser className="text-blue-600 text-2xl" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-lg">
                            {project.creator_name || 'Nombre no disponible'}
                          </p>
                          {project.created_at && (
                            <div className="flex items-center gap-2 mt-1">
                              <FaCalendar className="text-gray-500 text-sm" />
                              <span className="text-sm text-gray-600">
                                {formatDate(project.created_at)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {project.creator_type && (
                        <div className="flex justify-center">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                            project.creator_type === 'company'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          }`}>
                            {project.creator_type === 'company' ? '🏢 Proyecto Empresarial' : '👤 Proyecto Personal'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Ubicación con mapa */}
                  <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                        Ubicación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                        <FaMapMarkerAlt className="text-red-500 text-2xl flex-shrink-0" />
                        <p className="text-gray-800 font-semibold text-base">
                          {project.city}, {project.country}
                        </p>
                      </div>
                      {project.latitude && project.longitude && (
                        <div className="h-80 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                          <MapContainer
                            center={[parseFloat(project.latitude), parseFloat(project.longitude)]}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker
                              position={[parseFloat(project.latitude), parseFloat(project.longitude)]}
                              icon={L.divIcon({
                                className: 'custom-marker',
                                html: `<div style="background: linear-gradient(135deg, #10b981, #059669); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                  </svg>
                                </div>`,
                                iconSize: [40, 40],
                                iconAnchor: [20, 20]
                              })}
                            />
                          </MapContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contribuyentes */}
                  <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                        Contribuyentes
                        <span className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {contributors.length}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingContributors ? (
                        <div className="text-center py-8">
                          <FaSpinner className="animate-spin text-4xl text-purple-400 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">Cargando contribuyentes...</p>
                        </div>
                      ) : contributors.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                          {contributors.map((contributor, idx) => (
                            <div
                              key={idx}
                              className="group flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-200 hover:shadow-md"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                  <FaHeart className="text-white text-lg" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-800 truncate">
                                    {contributor.contributor_name || 'Contribuyente'}
                                  </p>
                                  {contributor.contribution_date && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <FaClock className="text-gray-400 text-xs" />
                                      <span className="text-xs text-gray-600">
                                        {formatDate(contributor.contribution_date)}
                                      </span>
                                    </div>
                                  )}
                                  {contributor.message && (
                                    <p className="text-xs text-gray-600 italic mt-2 line-clamp-2">
                                      "{contributor.message}"
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                  {formatCurrency(contributor.amount)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <FaUsers className="text-purple-500 text-3xl" />
                          </div>
                          <p className="text-gray-600 font-medium">Sé el primero en contribuir</p>
                          <p className="text-gray-500 text-sm mt-1">Tu aporte hará la diferencia</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Columna derecha: Formulario de contribución */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    {/* Tarjeta de Progreso */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {/* Monto actual */}
                          <div className="text-center">
                            <div className="inline-block p-1 bg-white rounded-2xl shadow-md mb-3">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-xl">
                                <h4 className="text-3xl font-black text-white tracking-tight">
                                  {formatCurrency(currentAmount)}
                                </h4>
                              </div>
                            </div>
                            <p className="text-gray-600 font-medium">
                              de {formatCurrency(targetAmount)}
                            </p>
                          </div>

                          {/* Barra de progreso mejorada */}
                          <div className="space-y-3">
                            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full transition-all duration-500 shadow-lg"
                                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold text-green-700">
                                  {fundingPercentage.toFixed(1)}% completado
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                                <FaUsers className="text-purple-500 text-sm" />
                                <span className="text-sm font-bold text-gray-700">
                                  {project.total_contributors || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Monto restante */}
                          {!isFullyFunded && (
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm font-medium">Falta:</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {formatCurrency(remainingAmount)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {isFullyFunded ? (
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-8 text-center">
                          <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <FaCheckCircle className="h-10 w-10 text-green-600" />
                          </div>
                          <h4 className="text-xl font-bold text-green-800 mb-2">¡Proyecto Completado!</h4>
                          <p className="text-gray-600 text-sm">Este proyecto alcanzó su meta de financiamiento</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
                          <CardTitle className="text-center text-lg font-bold flex items-center justify-center gap-2">
                            <FaHeart className="animate-pulse" />
                            Contribuir al Proyecto
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Error */}
                            {error && (
                              <Alert variant="destructive">
                                <FaExclamationTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            )}

                            {/* Monto */}
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700">
                                Monto a Contribuir <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                                <Input
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  placeholder="1000"
                                  className="pl-9 h-14 text-lg font-semibold border-2 focus:border-green-500 focus:ring-green-500 rounded-xl"
                                  min="100"
                                  max={remainingAmount}
                                  step="100"
                                  required
                                  disabled={loading}
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Mínimo: <span className="font-bold">$100</span></span>
                                <span className="text-gray-500">Máximo: <span className="font-bold">{formatCurrency(remainingAmount)}</span></span>
                              </div>

                              {/* Montos rápidos mejorados */}
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                {quickAmounts.filter(qa => qa <= remainingAmount).map((quickAmount) => (
                                  <Button
                                    key={quickAmount}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmount(quickAmount.toString())}
                                    disabled={loading}
                                    className="h-10 font-semibold border-2 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all rounded-lg"
                                  >
                                    {formatCurrency(quickAmount)}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Mensaje */}
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700">
                                Mensaje (opcional)
                              </label>
                              <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe un mensaje de apoyo..."
                                rows={4}
                                maxLength={500}
                                disabled={loading}
                                className="border-2 focus:border-green-500 focus:ring-green-500 rounded-xl resize-none"
                              />
                              <p className="text-xs text-gray-500 text-right">
                                <span className={message.length > 450 ? 'text-orange-500 font-bold' : ''}>
                                  {message.length}
                                </span>/500 caracteres
                              </p>
                            </div>

                            {/* Método de pago */}
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700">
                                Método de pago
                              </label>
                              <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white cursor-pointer transition-all"
                                disabled={loading}
                              >
                                <option value="mercadopago">💳 MercadoPago</option>
                                <option value="transferencia">🏦 Transferencia Bancaria</option>
                                <option value="efectivo">💵 Efectivo</option>
                              </select>
                            </div>

                            {/* Información */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                              <p className="text-sm text-blue-800 font-medium mb-2">ℹ️ Información importante:</p>
                              <ul className="text-xs text-blue-700 space-y-1.5">
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  <span>Tu contribución ayudará a plantar este árbol</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  <span>Recibirás un certificado al completarse</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  <span>Solo se permite una contribución por usuario</span>
                                </li>
                              </ul>
                            </div>

                            {/* Botón submit mejorado */}
                            <Button
                              type="submit"
                              disabled={loading}
                              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] rounded-xl"
                            >
                              {loading ? (
                                <>
                                  <FaSpinner className="animate-spin mr-2 text-xl" />
                                  Procesando...
                                </>
                              ) : (
                                <>
                                  <FaHeart className="mr-2 text-xl animate-pulse" />
                                  Contribuir {amount && `${formatCurrency(parseFloat(amount))}`}
                                </>
                              )}
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Añadir estilos CSS personalizados al componente
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #059669, #047857);
    }
  `;
  if (!document.getElementById('custom-scrollbar-styles')) {
    style.id = 'custom-scrollbar-styles';
    document.head.appendChild(style);
  }
}

export default ProjectDetailModal;
