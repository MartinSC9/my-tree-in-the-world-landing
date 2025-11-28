import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import TreeMap from '@features/trees/components/TreeMap';
import PropertyPermissionModal from '@features/trees/components/PropertyPermissionModal';
import { createCollaborativeTree, canCreateCollaborativeTree } from '@features/collaborative-trees/services';
import { availableTreeService } from '@features/available-trees/services';
import locationService from '@shared/services/locationService';
import { useAuth } from '@core/contexts/AuthContext';
import { useToast } from '@shared/components/ui/use-toast';
import { FaTree, FaMapMarkedAlt, FaDollarSign, FaCheckCircle, FaInfoCircle, FaLock, FaStore } from 'react-icons/fa';
import { MapPin, Home, Key, Info } from 'lucide-react';

const CreateCollaborativeTreeWizard = ({ onComplete, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  // Step 1: Información del proyecto
  const [treeName, setTreeName] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Ubicación
  const [location, setLocation] = useState(null);
  const [locationType, setLocationType] = useState('public');
  const [detectedType, setDetectedType] = useState(null);
  const [address, setAddress] = useState('');
  const [countryName, setCountryName] = useState('Argentina');
  const [cityName, setCityName] = useState('');

  // Home address
  const [hasHomeAddress, setHasHomeAddress] = useState(false);
  const [homeAddressLoading, setHomeAddressLoading] = useState(true);

  // Permission modal
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [locationPermissionId, setLocationPermissionId] = useState(null);

  // Step 3: Seleccionar árbol disponible (NUEVO)
  const [availableTrees, setAvailableTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [loadingTrees, setLoadingTrees] = useState(false);

  // Step 4: Financiamiento
  const [targetAmount, setTargetAmount] = useState(24000);
  const [initialContribution, setInitialContribution] = useState('');

  // Step 5: Mensaje
  const [message, setMessage] = useState('');

  const totalSteps = 5;

  // Verificar permisos al cargar
  useEffect(() => {
    checkPermissions();
    checkHomeAddress();
  }, []);

  // Check if user has registered home address
  const checkHomeAddress = async () => {
    try {
      setHomeAddressLoading(true);
      const data = await locationService.getHomeAddress();
      setHasHomeAddress(data.has_home_address);
    } catch (error) {
      console.error('Error checking home address:', error);
      setHasHomeAddress(false);
    } finally {
      setHomeAddressLoading(false);
    }
  };

  // Cargar árboles disponibles cuando se selecciona ubicación
  useEffect(() => {
    if (location && locationType && currentStep === 3) {
      loadAvailableTrees();
    }
  }, [location, locationType, currentStep]);

  const checkPermissions = async () => {
    try {
      const perms = await canCreateCollaborativeTree();
      setPermissions(perms);

      if (!perms.can_create) {
        toast({
          title: "No puedes crear un proyecto",
          description: perms.reason,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      toast({
        title: "Error",
        description: "Error al verificar permisos",
        variant: "destructive"
      });
    } finally {
      setLoadingPermissions(false);
    }
  };

  const loadAvailableTrees = async () => {
    try {
      setLoadingTrees(true);

      // Obtener árboles disponibles con stock
      const trees = await availableTreeService.getAvailableTrees({
        in_stock: true
      });

      // Filtrar por tipo de ubicación
      let filteredTrees = trees;
      if (locationType === 'public') {
        // Filtrar solo especies nativas municipales
        const publicSpecies = ['Ceibo', 'Jacarandá', 'Tipa', 'Lapacho', 'Palo Borracho', 'Algarrobo', 'Quebracho'];
        filteredTrees = trees.filter(tree =>
          publicSpecies.some(species => tree.species?.toLowerCase().includes(species.toLowerCase()))
        );
      }
      // own_property y third_party_property: catálogo completo

      setAvailableTrees(filteredTrees);

      if (filteredTrees.length === 0) {
        toast({
          title: "No hay árboles disponibles",
          description: locationType === 'public'
            ? "No hay especies nativas municipales disponibles en este momento"
            : "No hay árboles disponibles en este momento",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error al cargar árboles:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las especies disponibles",
        variant: "destructive"
      });
    } finally {
      setLoadingTrees(false);
    }
  };

  const handleMapClick = async (lat, lng) => {
    setLocation({ lat, lng });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
      );
      const data = await response.json();

      if (data.address) {
        setCountryName(data.address.country || 'Argentina');
        setCityName(data.address.city || data.address.town || data.address.village || '');
        setAddress(data.display_name || '');
      }
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }

    // Auto-detect location type
    detectLocationTypeForCoords(lat, lng);
  };

  const detectLocationTypeForCoords = async (lat, lng) => {
    if (!hasHomeAddress) {
      setDetectedType('public');
      return;
    }

    try {
      const result = await locationService.detectLocationType(lat, lng);
      setDetectedType(result.detected_type);

      // Auto-select detected type
      setLocationType(result.detected_type);

      // Show info toast
      if (result.detected_type === 'own_property') {
        toast({
          title: 'Ubicación detectada',
          description: '🏠 Esta ubicación está dentro del radio de tu domicilio registrado (50m)',
        });
      }
    } catch (error) {
      console.error('Error detecting location type:', error);
      setDetectedType('public');
    }
  };

  const handleLocationTypeChange = (newType) => {
    setLocationType(newType);

    // If third_party_property, show permission modal
    if (newType === 'third_party_property' && location && !locationPermissionId) {
      setShowPermissionModal(true);
    }
  };

  const handlePermissionGranted = (permission) => {
    setLocationPermissionId(permission.id);
    toast({
      title: 'Permiso concedido',
      description: 'Puedes continuar con el proyecto',
    });
  };

  const handleTreeSelection = (tree) => {
    setSelectedTree(tree);
    setTargetAmount(tree.price);
  };

  const handleNextStep = () => {
    // Validaciones por paso
    if (currentStep === 1) {
      if (!treeName.trim()) {
        toast({ title: "Nombre requerido", description: "Por favor ingresa un nombre para el proyecto", variant: "destructive" });
        return;
      }
      if (!description.trim()) {
        toast({ title: "Descripción requerida", description: "Por favor describe tu proyecto", variant: "destructive" });
        return;
      }
    }

    if (currentStep === 2) {
      if (!location) {
        toast({ title: "Ubicación requerida", description: "Por favor selecciona una ubicación en el mapa", variant: "destructive" });
        return;
      }

      // Validate home address for own_property
      if (locationType === 'own_property' && !hasHomeAddress) {
        toast({
          title: "Domicilio no registrado",
          description: "Debes registrar tu domicilio en Configuración para usar esta opción",
          variant: "destructive"
        });
        return;
      }

      // Validate permission for third_party_property
      if (locationType === 'third_party_property' && !locationPermissionId) {
        toast({
          title: "Permiso requerido",
          description: "Debes obtener el permiso del propietario para continuar",
          variant: "destructive"
        });
        setShowPermissionModal(true);
        return;
      }
    }

    if (currentStep === 3) {
      if (!selectedTree) {
        toast({ title: "Árbol no seleccionado", description: "Por favor selecciona una especie disponible", variant: "destructive" });
        return;
      }
    }

    if (currentStep === 4) {
      const minPercentage = permissions?.user_type === 'user' ? 0.05 : 0.30;
      const minContribution = targetAmount * minPercentage;

      if (!initialContribution || parseFloat(initialContribution) <= 0) {
        toast({ title: "Contribución inicial requerida", description: `Debes aportar al menos $${minContribution.toFixed(2)}`, variant: "destructive" });
        return;
      }

      if (parseFloat(initialContribution) < minContribution) {
        toast({ title: "Contribución inicial insuficiente", description: `El mínimo es $${minContribution.toFixed(2)}`, variant: "destructive" });
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const projectData = {
        tree_name: treeName,
        tree_species: selectedTree?.species || 'Árbol nativo',
        description: description,
        message: message,
        target_amount: targetAmount,
        initial_contribution: initialContribution ? parseFloat(initialContribution) : 0,
        latitude: location.lat,
        longitude: location.lng,
        country: countryName,
        city: cityName,
        address: address,
        location_type: locationType,
        location_permission_id: locationType === 'third_party_property' ? locationPermissionId : null,
        available_tree_id: selectedTree?.id,
        nursery_id: selectedTree?.nursery_id
      };

      const response = await createCollaborativeTree(projectData);

      toast({
        title: "¡Proyecto creado!",
        description: "Tu proyecto colaborativo ha sido creado exitosamente",
      });

      if (onComplete) {
        onComplete(response.collaborative_tree);
      } else {
        navigate(`/arboles-colaborativos/${response.collaborative_tree.id}`);
      }

    } catch (error) {
      console.error('Error al crear proyecto:', error);
      toast({
        title: "Error",
        description: error.error || "No se pudo crear el proyecto colaborativo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Proyecto *</label>
              <Input type="text" placeholder="Ej: Bosque Nativo en Córdoba" value={treeName} onChange={(e) => setTreeName(e.target.value)} className="text-lg" />
              <p className="text-xs text-gray-500 mt-1">Elige un nombre atractivo para tu proyecto colaborativo</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Proyecto *</label>
              <Textarea placeholder="Describe tu proyecto..." value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="resize-none" />
              <p className="text-xs text-gray-500 mt-1">Una buena descripción aumenta las posibilidades de recibir contribuciones</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Location Type Selector */}
            <div className="space-y-3">
              {/* Public Location */}
              <label className={`flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors ${
                locationType === 'public' ? 'border-green-500 bg-green-50' : ''
              }`}>
                <input
                  type="radio"
                  name="locationType"
                  value="public"
                  checked={locationType === 'public'}
                  onChange={(e) => handleLocationTypeChange(e.target.value)}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-lg mb-1">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>Espacio Público Municipal</span>
                    {detectedType === 'public' && location && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        Detectado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Solo especies nativas municipales. Requiere autorización administrativa.
                  </p>
                </div>
              </label>

              {/* Own Property */}
              <label className={`flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-colors ${
                !hasHomeAddress ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              } ${locationType === 'own_property' ? 'border-green-500 bg-green-50' : ''}`}>
                <input
                  type="radio"
                  name="locationType"
                  value="own_property"
                  checked={locationType === 'own_property'}
                  onChange={(e) => handleLocationTypeChange(e.target.value)}
                  disabled={!hasHomeAddress}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-lg mb-1">
                    <Home className="h-5 w-5 text-blue-600" />
                    <span>Mi Domicilio</span>
                    {detectedType === 'own_property' && location && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        Detectado (50m)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Catálogo completo (nativas, exóticas, frutales). Requiere domicilio verificado.
                  </p>
                  {!hasHomeAddress && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Registra tu domicilio en Configuración para habilitar esta opción
                    </p>
                  )}
                </div>
              </label>

              {/* Third Party Property - TEMPORALMENTE DESHABILITADO */}
              {/* <label className={`flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors ${
                locationType === 'third_party_property' ? 'border-green-500 bg-green-50' : ''
              }`}>
                <input
                  type="radio"
                  name="locationType"
                  value="third_party_property"
                  checked={locationType === 'third_party_property'}
                  onChange={(e) => handleLocationTypeChange(e.target.value)}
                  className="mt-1 w-5 h-5 text-green-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-lg mb-1">
                    <Key className="h-5 w-5 text-orange-600" />
                    <span>Propiedad Ajena</span>
                    {locationPermissionId && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        ✓ Permiso obtenido
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Requiere código de autorización del propietario (enviado por email/SMS).
                  </p>
                </div>
              </label> */}
            </div>

            {/* Additional info based on location type */}
            {locationType === 'own_property' && hasHomeAddress && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Mi Domicilio
                </p>
                <p className="text-xs text-blue-700">
                  Tienes acceso al catálogo completo de especies (nativas, exóticas, frutales, ornamentales).
                </p>
              </div>
            )}

            {/* TEMPORALMENTE DESHABILITADO - Propiedad Ajena */}
            {/* {locationType === 'third_party_property' && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-900 mb-1 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Permiso del Propietario
                </p>
                <p className="text-xs text-orange-700 mb-2">
                  Necesitas obtener un código de 6 dígitos del propietario de esta ubicación.
                </p>
                {!locationPermissionId && location && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPermissionModal(true)}
                    className="text-xs"
                  >
                    Solicitar Permiso
                  </Button>
                )}
              </div>
            )} */}

            {/* Map */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Haz clic en el mapa para seleccionar la ubicación *</label>
                {location && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✓ Ubicación seleccionada</span>}
              </div>
              <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-300">
                <TreeMap
                  trees={[]}
                  onMapClick={handleMapClick}
                  center={location ? [location.lat, location.lng] : [-31.4201, -64.1888]}
                  zoom={location ? 15 : 12}
                  selectedLocation={location ? [location.lat, location.lng] : null}
                  restrictToGreenSpaces={true}
                  onNotInGreenSpace={() => {
                    toast({
                      title: "Ubicación no permitida",
                      description: "Solo puedes plantar árboles en espacios verdes de Córdoba Capital",
                      variant: "destructive"
                    });
                  }}
                />
              </div>
              {location && detectedType && (
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Tipo detectado: {
                    detectedType === 'public' ? 'Espacio Público' :
                    detectedType === 'own_property' ? 'Tu Domicilio' :
                    'Propiedad Ajena'
                  }
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Selecciona una especie disponible</h3>
              <p className="text-sm text-gray-600">{locationType === 'public' ? 'Especies nativas aprobadas para espacios públicos' : 'Todas las especies disponibles'}</p>
            </div>
            {loadingTrees ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-4"></div>
                <p className="text-gray-600">Cargando especies disponibles...</p>
              </div>
            ) : availableTrees.length === 0 ? (
              <div className="text-center py-12">
                <FaTree className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No hay especies disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {availableTrees.map((tree) => (
                  <div key={tree.id} onClick={() => handleTreeSelection(tree)} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTree?.id === tree.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-400'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{tree.name}</h4>
                        <p className="text-sm text-gray-600">{tree.species}</p>
                      </div>
                      {selectedTree?.id === tree.id && <FaCheckCircle className="text-green-600 text-xl" />}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600"><FaStore className="inline mr-1" />{tree.nursery_name || 'Vivero'}</span>
                        <span className="font-semibold text-green-600">${tree.price?.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto Objetivo (ARS) *</label>
              <Input type="number" value={targetAmount} disabled className="text-lg" />
              <p className="text-xs text-gray-500 mt-1">Calculado según el árbol seleccionado: {selectedTree?.species}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tu Contribución Inicial *</label>
              <Input type="number" min="0" max={targetAmount} step="100" placeholder={`Mínimo: ${(targetAmount * (permissions?.user_type === 'user' ? 0.05 : 0.30)).toFixed(2)}`} value={initialContribution} onChange={(e) => setInitialContribution(e.target.value)} className="text-lg" />
              <p className="text-xs text-gray-500 mt-1">{permissions?.user_type === 'user' ? 'Mínimo 5% del total' : 'Mínimo 30% del total'}</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje del Proyecto (opcional)</label>
              <Textarea placeholder="Un mensaje inspirador..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="resize-none" />
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4">Resumen del Proyecto</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {treeName}</p>
                <p><strong>Especie:</strong> {selectedTree?.species}</p>
                <p><strong>Vivero:</strong> {selectedTree?.nursery_name || 'N/A'}</p>
                <p><strong>Ubicación:</strong> {cityName ? `${cityName}, ` : ''}{countryName}</p>
                <p><strong>Monto objetivo:</strong> ${targetAmount.toLocaleString('es-AR')}</p>
                {initialContribution && <p><strong>Tu contribución:</strong> ${parseFloat(initialContribution).toLocaleString('es-AR')}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepIcons = [FaInfoCircle, FaMapMarkedAlt, FaStore, FaDollarSign, FaCheckCircle];
  const stepTitles = ['Información', 'Ubicación', 'Seleccionar Árbol', 'Financiamiento', 'Confirmación'];

  if (loadingPermissions) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Verificando permisos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (permissions && !permissions.can_create) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl">
          <CardContent className="p-12 text-center">
            <FaLock className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No puedes crear un proyecto en este momento</h2>
            <p className="text-gray-600 mb-6">{permissions.reason}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(`/usuario/${user?.id}/arboles`)} className="bg-green-600">Ver Mis Árboles</Button>
              <Button onClick={() => navigate('/arboles-colaborativos')} variant="outline">Ver Proyectos</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {permissions && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {permissions.user_type === 'user' ? 'Proyecto Personal' : 'Proyecto Empresarial'}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {permissions.user_type === 'user' ? 'Solo 1 árbol colaborativo en total' : 'Proyectos ilimitados'}</li>
                  <li>• Aporte inicial mínimo: {permissions.user_type === 'user' ? '5%' : '30%'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardTitle className="text-2xl">Crear Proyecto Colaborativo</CardTitle>
          <p className="text-green-100 mt-2">Paso {currentStep} de {totalSteps}: {stepTitles[currentStep - 1]}</p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4, 5].map((step) => {
              const Icon = stepIcons[step - 1];
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step === currentStep ? 'bg-green-600 text-white scale-110' : step < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <Icon className="text-xl" />
                  </div>
                  <span className={`text-xs font-medium ${step === currentStep ? 'text-green-600' : 'text-gray-500'}`}>{stepTitles[step - 1]}</span>
                </div>
              );
            })}
          </div>

          <div className="min-h-[400px]">{renderStep()}</div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button onClick={currentStep === 1 && onCancel ? onCancel : handlePreviousStep} disabled={currentStep === 1 && !onCancel} variant="outline">
              {currentStep === 1 && onCancel ? 'Cancelar' : 'Anterior'}
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNextStep} className="bg-green-600">Siguiente</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-green-600 to-emerald-600 px-8">
                {loading ? 'Creando...' : 'Crear Proyecto'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property Permission Modal */}
      <PropertyPermissionModal
        open={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        location={location}
        address={address}
        onPermissionGranted={handlePermissionGranted}
      />
    </div>
  );
};

export default CreateCollaborativeTreeWizard;
