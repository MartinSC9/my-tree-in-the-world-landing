import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Badge } from '@shared/components/ui/badge';
import TreeMap from './TreeMap';
import { availableTreeService } from '@features/available-trees/services';
import { toast } from '@shared/components/ui/use-toast';
import { useAuth } from '@core/contexts/AuthContext';
import { Check, MapPin, Leaf, User, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';

const PurchaseWizard = ({ tree, onComplete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  // Step 1: Location
  const [locationType, setLocationType] = useState('public');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  // Step 2: Species (ya está seleccionada del catálogo, pero mostramos info)
  const [selectedSpecies, setSelectedSpecies] = useState(tree);

  // Step 3: Name
  const [treeName, setTreeName] = useState('');
  const [message, setMessage] = useState('');

  const steps = [
    { number: 1, title: 'Ubicación', icon: MapPin },
    { number: 2, title: 'Especie', icon: Leaf },
    { number: 3, title: 'Tu Árbol', icon: User },
    { number: 4, title: 'Pago', icon: CreditCard },
  ];

  // Auto-detect user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Default to Córdoba, Argentina
          setLocation({ lat: -31.4201, lng: -64.1888 });
        }
      );
    }
  }, []);

  // Set default tree name
  useEffect(() => {
    if (user && tree) {
      const defaultName = `${tree.species} de ${user.username || user.email.split('@')[0]}`;
      setTreeName(defaultName);
    }
  }, [user, tree]);

  const handleMapClick = (lat, lng) => {
    setLocation({ lat, lng });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate location
      if (!location) {
        toast({
          title: "Ubicación requerida",
          description: "Por favor selecciona una ubicación en el mapa haciendo clic sobre él",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 3) {
      // Validate name
      if (!treeName.trim()) {
        toast({
          title: "Nombre requerido",
          description: "Por favor ingresa un nombre para tu árbol",
          variant: "destructive"
        });
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);

      const purchaseData = {
        available_tree_id: tree.id,
        name: treeName.trim(),
        latitude: location.lat,
        longitude: location.lng,
        location_type: locationType,
        address: locationType === 'private' ? address.trim() : null,
        country: 'Argentina',
        message: message.trim() || null,
      };

      const result = await availableTreeService.purchaseTree(purchaseData);

      toast({
        title: "¡Compra exitosa!",
        description: `Tu árbol "${treeName}" ha sido comprado exitosamente`,
      });

      setTimeout(() => {
        if (onComplete) {
          onComplete(result);
        } else {
          navigate('/usuario/mis-arboles');
        }
      }, 1500);
    } catch (error) {
      console.error('Error purchasing tree:', error);
      const errorMsg = error.response?.data?.error || 'Error al comprar el árbol';
      toast({
        title: "Error en la compra",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${isCompleted
                        ? 'bg-green-600 text-white'
                        : isActive
                        ? 'bg-green-600 text-white ring-4 ring-green-200'
                        : 'bg-gray-200 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-medium
                      ${isActive ? 'text-green-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-4 rounded transition-all duration-300
                      ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {currentStep === 1 && '¿Dónde quieres plantar tu árbol?'}
            {currentStep === 2 && 'Especie seleccionada'}
            {currentStep === 3 && 'Personaliza tu árbol'}
            {currentStep === 4 && 'Confirma tu compra'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Location Type Selector */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="locationType"
                    value="public"
                    checked={locationType === 'public'}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="mt-1 w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-lg mb-1">
                      <span>🌍</span>
                      <span>Ubicación pública</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tu árbol aparecerá en el mapa global. Ideal para parques, bosques y espacios comunitarios.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="locationType"
                    value="private"
                    checked={locationType === 'private'}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="mt-1 w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-lg mb-1">
                      <span>🏠</span>
                      <span>En lo de un amigo/familiar/pareja</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ubicación privada, solo visible para ti. Para jardines o propiedades particulares.
                    </p>
                  </div>
                </label>
              </div>

              {/* Información adicional según tipo de ubicación */}
              {locationType === 'private' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    🔒 Ubicación privada
                  </p>
                  <p className="text-xs text-blue-700">
                    Esta ubicación será privada y solo tú podrás verla en el mapa. Selecciona el punto exacto en el mapa a continuación.
                  </p>
                </div>
              )}

              {/* Mapa - Siempre visible para ambos tipos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Haz clic en el mapa para seleccionar la ubicación exacta
                  </label>
                  {location && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      ✓ Ubicación seleccionada
                    </span>
                  )}
                </div>
                <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-300">
                  <TreeMap
                    trees={[]}
                    onMapClick={handleMapClick}
                    center={location ? [location.lat, location.lng] : [-31.4201, -64.1888]}
                    zoom={location ? 15 : 12}
                    selectedLocation={location ? [location.lat, location.lng] : null}
                  />
                </div>
                {location && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Coordenadas:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                    {locationType === 'private' && (
                      <p className="text-xs text-blue-600 mt-1">
                        🔒 Esta ubicación es privada
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Campo opcional de referencia para ubicaciones privadas */}
              {locationType === 'private' && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia de la ubicación (opcional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Casa de mi abuela en Córdoba, Jardín de mi amigo Juan"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo para tu referencia personal. No es obligatorio.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Species */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="flex gap-6">
                  {/* Tree Image */}
                  <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                    {tree.image_url ? (
                      <img
                        src={tree.image_url}
                        alt={tree.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-6xl">🌳</span>
                      </div>
                    )}
                  </div>

                  {/* Tree Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {tree.name}
                    </h3>
                    {tree.scientific_name && (
                      <p className="text-lg text-gray-600 italic mb-3">
                        {tree.scientific_name}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-base px-3 py-1">
                          {tree.species}
                        </Badge>
                      </div>

                      {tree.nursery_name && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-xl">🌱</span>
                          <span className="font-medium">{tree.nursery_name}</span>
                        </div>
                      )}
                    </div>

                    {tree.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {tree.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Why this tree */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  <span>¿Por qué elegir este árbol?</span>
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Especie nativa adaptada al clima local</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Proporcionado por vivero certificado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Seguimiento completo desde la plantación</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Name & Message */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Tu nombre aparecerá en el código QR
                    </h4>
                    <p className="text-sm text-purple-700">
                      Cuando las personas escaneen el QR del árbol físico, verán tu nombre
                      y mensaje. ¡Deja tu huella verde en el mundo!
                    </p>
                  </div>
                </div>
              </div>

              {/* Tree Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del árbol *
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Árbol de la Familia García"
                  value={treeName}
                  onChange={(e) => setTreeName(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este nombre se mostrará en el certificado y código QR
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje o dedicatoria (opcional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px] resize-none"
                  placeholder="Escribe un mensaje especial...
Ej: Plantado con amor por la familia García en honor a nuestro abuelo Antonio."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length}/500 caracteres
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>👁️</span>
                  <span>Vista previa del código QR</span>
                </h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">🌳</span>
                    <div>
                      <p className="font-bold text-lg text-gray-900">
                        {treeName || 'Nombre del árbol'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {tree.species} • {tree.nursery_name}
                      </p>
                      {message && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          "{message}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Plantado por {user?.username || 'Usuario'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  <span>Resumen de tu compra</span>
                </h3>

                <div className="space-y-4">
                  {/* Tree */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={tree.image_url}
                        alt={tree.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{tree.name}</p>
                      <p className="text-sm text-gray-600">{tree.species}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    {/* Name */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium text-gray-900">{treeName}</span>
                    </div>

                    {/* Location */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium text-gray-900">
                        {locationType === 'private' ? '🏠 Casa' : '🌍 Pública'}
                      </span>
                    </div>

                    {/* Nursery */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vivero:</span>
                      <span className="font-medium text-gray-900">{tree.nursery_name}</span>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center pt-3 border-t-2">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-3xl font-bold text-green-600">
                        ${parseFloat(tree.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span>🎁</span>
                  <span>Incluido en tu compra</span>
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Certificado digital de plantación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Código QR único del árbol</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Seguimiento fotográfico del crecimiento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Notificaciones de progreso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>100 EcoPoints de recompensa</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handlePrevStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                onClick={handleNextStep}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handlePurchase}
                disabled={purchasing}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 flex items-center gap-2"
              >
                {purchasing ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pagar ${parseFloat(tree.price || 0).toFixed(2)}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseWizard;
