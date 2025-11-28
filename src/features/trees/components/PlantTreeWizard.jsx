import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import TreeMap from './TreeMap';
import PropertyPermissionModal from './PropertyPermissionModal';
import AddressVerificationModal from './AddressVerificationModal';
import { toast } from '@shared/components/ui/use-toast';
import { useAuth } from '@core/contexts/AuthContext';
import { useTree } from '@core/contexts/TreeContext';
import { userService } from '@shared/services/userService';
import locationService from '@shared/services/locationService';
import collaborativeTreeService from '@features/collaborative-trees/services';
import { Check, MapPin, User, CreditCard, ChevronRight, ChevronLeft, TreePine, Home, Key, Info, Store, Leaf } from 'lucide-react';
import viveroService from '../../../services/viveroService';

const PlantTreeWizard = ({ onComplete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plantTree } = useTree();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Location
  const [locationType, setLocationType] = useState('public');
  const [detectedType, setDetectedType] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [countryName, setCountryName] = useState('');
  const [mapZoom, setMapZoom] = useState(12);

  // Home address search
  const [homeAddressInput, setHomeAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [searchingAddress, setSearchingAddress] = useState(false);

  // Home address
  const [hasHomeAddress, setHasHomeAddress] = useState(false);
  const [homeAddressLoading, setHomeAddressLoading] = useState(true);

  // Permission modal
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [locationPermissionId, setLocationPermissionId] = useState(null);

  // Address verification modal
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [plantedTree, setPlantedTree] = useState(null);

  // Step 2: Nursery Selection
  const [nurseries, setNurseries] = useState([]);
  const [selectedNursery, setSelectedNursery] = useState(null);
  const [loadingNurseries, setLoadingNurseries] = useState(false);

  // Step 3: Tree Selection
  const [catalog, setCatalog] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Step 4: Personal Info (moved from step 2)
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Step 5: Tree Details (moved from step 3)
  const [treeName, setTreeName] = useState('');
  const [message, setMessage] = useState('');

  // Collaborative Trees for map display
  const [collaborativeTrees, setCollaborativeTrees] = useState([]);
  const [loadingCollaborative, setLoadingCollaborative] = useState(false);
  const hasLoadedCollaborative = React.useRef(false);

  const steps = [
    { number: 1, title: 'Ubicación', icon: MapPin },
    { number: 2, title: 'Vivero', icon: Store },
    { number: 3, title: 'Árbol', icon: Leaf },
    { number: 4, title: 'Tus Datos', icon: User },
    { number: 5, title: 'Personalizar', icon: TreePine },
    { number: 6, title: 'Pago', icon: CreditCard },
  ];

  // Check if user has registered home address
  // El caché global en locationService evita múltiples peticiones
  useEffect(() => {
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

    checkHomeAddress();
  }, []);

  // Load collaborative trees to display on map
  useEffect(() => {

    const loadCollaborativeTrees = async () => {
      // Evitar múltiples ejecuciones - doble validación
      if (hasLoadedCollaborative.current || collaborativeTrees.length > 0) {

        return;
      }

      try {
        hasLoadedCollaborative.current = true;
        setLoadingCollaborative(true);

        const data = await collaborativeTreeService.getCollaborativeTrees({
          status: 'active',
          limit: 100
        });
        // Map collaborative trees to include type for TreeMap
        const treesWithType = (data.trees || []).map(tree => ({
          ...tree,
          type: 'collaborative'
        }));
        setCollaborativeTrees(treesWithType);

      } catch (error) {
        console.error('❌ Error loading collaborative trees:', error);
        setCollaborativeTrees([]);
        hasLoadedCollaborative.current = false; // Resetear en caso de error para retry
      } finally {
        setLoadingCollaborative(false);
      }
    };

    loadCollaborativeTrees();
  }, []);

  // Load nurseries when location is selected and moving to step 2
  useEffect(() => {
    const loadNurseries = async () => {
      if (currentStep === 2 && location) {
        try {
          setLoadingNurseries(true);
          const data = await viveroService.searchNearbyNurseries(
            location.lat,
            location.lng,
            locationType,
            50 // 50 km radius
          );
          setNurseries(data.nurseries || []);

          if ((data.nurseries || []).length === 0) {
            toast({
              title: "No hay viveros cercanos",
              description: "No se encontraron viveros en un radio de 50 km. Intenta con otra ubicación.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error loading nurseries:', error);
          toast({
            title: "Error al buscar viveros",
            description: "No se pudieron cargar los viveros cercanos. Intenta nuevamente.",
            variant: "destructive"
          });
          setNurseries([]);
        } finally {
          setLoadingNurseries(false);
        }
      }
    };

    loadNurseries();
  }, [currentStep, location, locationType]);

  // Load catalog when nursery is selected and moving to step 3
  useEffect(() => {
    const loadCatalog = async () => {
      if (currentStep === 3 && selectedNursery) {
        try {
          setLoadingCatalog(true);
          const data = await viveroService.getNurseryCatalog(
            selectedNursery.id,
            locationType
          );
          setCatalog(data.catalog || []);

          if ((data.catalog || []).length === 0) {
            toast({
              title: "Catálogo vacío",
              description: "Este vivero no tiene árboles disponibles para este tipo de ubicación.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error loading catalog:', error);
          toast({
            title: "Error al cargar catálogo",
            description: "No se pudo cargar el catálogo del vivero. Intenta nuevamente.",
            variant: "destructive"
          });
          setCatalog([]);
        } finally {
          setLoadingCatalog(false);
        }
      }
    };

    loadCatalog();
  }, [currentStep, selectedNursery, locationType]);

  // Auto-detect user location - DESHABILITADO: el usuario debe hacer click en el mapa
  // useEffect(() => {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude
  //         });
  //         // Get country name from coordinates
  //         fetchCountryName(position.coords.latitude, position.coords.longitude);
  //         // Auto-detect location type
  //         detectLocationTypeForCoords(position.coords.latitude, position.coords.longitude);
  //       },
  //       (error) => {
  //
  //         // Default to Córdoba, Argentina
  //         setLocation({ lat: -31.4201, lng: -64.1888 });
  //         setCountryName('Córdoba, Argentina');
  //       }
  //     );
  //   }
  // }, []);

  // Set default tree name when user info is available
  useEffect(() => {
    if (firstName && lastName) {
      setTreeName(`Árbol de ${firstName} ${lastName}`);
    }
  }, [firstName, lastName]);

  const fetchCountryName = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const province = data.address?.state || data.address?.province || '';
      const country = data.address?.country || 'Desconocido';
      const displayName = data.display_name || '';
      setCountryName(province && country ? `${province}, ${country}` : country);
      setAddress(displayName);
    } catch (error) {
      console.error("Error fetching location:", error);
      setCountryName('Argentina');
    }
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

  const handleMapClick = (lat, lng) => {
    setLocation({ lat, lng });
    fetchCountryName(lat, lng);
    detectLocationTypeForCoords(lat, lng);
    // Don't change zoom when clicking on map, keep current zoom level
  };

  // Search address using Nominatim
  const searchAddress = async (query) => {
    if (!query || query.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      setSearchingAddress(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(query)}, Córdoba, Argentina&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setAddressSuggestions(data);
    } catch (error) {
      console.error('Error searching address:', error);
      setAddressSuggestions([]);
    } finally {
      setSearchingAddress(false);
    }
  };

  // Handle address input change with debounce
  const handleAddressInputChange = (value) => {
    setHomeAddressInput(value);

    // Debounce search
    if (window.addressSearchTimeout) {
      clearTimeout(window.addressSearchTimeout);
    }

    window.addressSearchTimeout = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  // Handle address selection from suggestions
  const handleAddressSelect = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    setHomeAddressInput(suggestion.display_name);
    setAddress(suggestion.display_name);
    setLocation({ lat, lng });

    // Zoom in to the selected address (17 for street level detail)
    setMapZoom(17);

    // Extract country/province info
    const province = suggestion.address?.state || suggestion.address?.province || '';
    const country = suggestion.address?.country || 'Argentina';
    setCountryName(province && country ? `${province}, ${country}` : country);

    // Clear suggestions
    setAddressSuggestions([]);

    toast({
      title: "Dirección encontrada",
      description: "El mapa se ha centrado en tu dirección. Puedes ajustar el marcador si es necesario.",
    });
  };

  const handleLocationTypeChange = (newType) => {
    // Clear previous selections when changing location type
    setLocation(null);
    setAddress('');
    setHomeAddressInput('');
    setAddressSuggestions([]);
    setMapZoom(12); // Reset to default zoom

    setLocationType(newType);

    // If third_party_property, show permission modal
    if (newType === 'third_party_property' && location && !locationPermissionId) {
      setShowPermissionModal(true);
    }

    toast({
      title: "Tipo de ubicación cambiado",
      description: "Selecciona una nueva ubicación en el mapa",
    });
  };

  const handlePermissionGranted = (permission) => {
    setLocationPermissionId(permission.id);
    toast({
      title: 'Permiso concedido',
      description: 'Puedes continuar con la plantación',
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate location
      if (!location) {
        toast({
          title: "Ubicación requerida",
          description: locationType === 'own_property'
            ? "Por favor ingresa tu dirección y selecciona una ubicación en el mapa"
            : "Por favor selecciona una ubicación en el mapa haciendo clic sobre él",
          variant: "destructive"
        });
        return;
      }

      // Validate home address input for own_property
      if (locationType === 'own_property' && !homeAddressInput.trim()) {
        toast({
          title: "Dirección requerida",
          description: "Por favor ingresa tu dirección completa para verificación posterior",
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

    if (currentStep === 2) {
      // Validate nursery selection
      if (!selectedNursery) {
        toast({
          title: "Vivero requerido",
          description: "Por favor selecciona un vivero para continuar",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 3) {
      // Validate tree selection
      if (!selectedTree) {
        toast({
          title: "Árbol requerido",
          description: "Por favor selecciona un árbol del catálogo para continuar",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 4) {
      // Validate personal info
      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        toast({
          title: "Datos incompletos",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive"
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Email inválido",
          description: "Por favor ingresa un email válido",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 5) {
      // Validate tree name
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

  const handlePlantTree = async () => {
    try {
      setLoading(true);

      // Update user info if changed
      if (firstName !== user?.first_name || lastName !== user?.last_name) {
        await userService.updateUser(user.id, {
          first_name: firstName,
          last_name: lastName
        });
      }

      const treePayload = {
        name: treeName.trim(),
        email: email.trim(),
        message: message.trim() || null,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        latitude: location.lat,
        longitude: location.lng,
        location_type: locationType,
        address: address ? address.trim() : null,
        country: countryName,
        location_permission_id: locationType === 'third_party_property' ? locationPermissionId : null,
        paymentAmount: 24000,
        paymentStatus: 'completed',
      };

      const newTree = await plantTree(treePayload);

      // If location type is own_property, show address verification modal
      if (locationType === 'own_property') {
        setPlantedTree(newTree);
        toast({
          title: "¡Árbol plantado exitosamente!",
          description: "Ahora verifica tu domicilio para completar el proceso",
        });

        setTimeout(() => {
          setShowVerificationModal(true);
        }, 1500);
      } else {
        // For public or third party, proceed normally
        toast({
          title: "¡Árbol plantado exitosamente!",
          description: onComplete ? "Tu árbol ha sido registrado." : "Tu certificado está siendo generado...",
        });

        setTimeout(() => {
          if (onComplete) {
            onComplete(newTree);
          } else {
            navigate(`/certificado/${newTree.id}`);
          }
        }, 1500);
      }

    } catch (error) {
      console.error('Error planting tree:', error);
      toast({
        title: "Error al plantar árbol",
        description: error.message || "Por favor intenta nuevamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {currentStep === 1 && '¿Dónde quieres plantar tu árbol?'}
              {currentStep === 2 && 'Selecciona un vivero cercano'}
              {currentStep === 3 && 'Elige tu árbol del catálogo'}
              {currentStep === 4 && 'Tus datos personales'}
              {currentStep === 5 && 'Personaliza tu árbol'}
              {currentStep === 6 && 'Confirma tu plantación'}
            </CardTitle>

            {/* Navigation buttons in header */}
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
              )}

              {currentStep < 6 && (
                <Button
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}

              {currentStep === 6 && (
                <Button
                  onClick={handlePlantTree}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 flex items-center gap-2"
                >
                  {loading ? (
                    <>Procesando...</>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pagar ${selectedTree?.price ? selectedTree.price.toLocaleString('es-AR') : '24.000'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Location Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className={`flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  locationType === 'own_property' ? 'border-green-500 bg-green-50' : ''
                }`}>
                  <input
                    type="radio"
                    name="locationType"
                    value="own_property"
                    checked={locationType === 'own_property'}
                    onChange={(e) => handleLocationTypeChange(e.target.value)}
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
                      Catálogo completo (nativas, exóticas, frutales). Verificación de domicilio después del pago.
                    </p>
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

              {/* Home Address Search - Only for Own Property */}
              {locationType === 'own_property' && (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2 mb-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Ingresa tu dirección</h4>
                        <p className="text-sm text-blue-800">
                          Escribe tu dirección completa. El mapa se centrará automáticamente y podrás ajustar el marcador si es necesario.
                          <br />
                          <span className="font-medium">En 7 días deberás verificar tu domicilio con una foto de tu DNI.</span>
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Ej: Av. Colón 1234, Córdoba"
                        value={homeAddressInput}
                        onChange={(e) => handleAddressInputChange(e.target.value)}
                        className="text-base pr-10"
                      />
                      {searchingAddress && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        </div>
                      )}

                      {/* Address Suggestions Dropdown */}
                      {addressSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleAddressSelect(suggestion)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {suggestion.display_name}
                                  </p>
                                  {suggestion.address && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {suggestion.address.road && `${suggestion.address.road}, `}
                                      {suggestion.address.suburb || suggestion.address.city || suggestion.address.town}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {homeAddressInput && !location && (
                      <p className="text-xs text-gray-500 mt-2">
                        Selecciona una dirección de las sugerencias
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Mapa */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {locationType === 'own_property'
                      ? location
                        ? 'Puedes ajustar el marcador haciendo clic en otra ubicación'
                        : 'El mapa se centrará cuando ingreses tu dirección'
                      : 'Haz clic en el mapa para seleccionar la ubicación exacta'
                    }
                  </label>
                  {location && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      ✓ Ubicación seleccionada
                    </span>
                  )}
                </div>
                <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-300">
                  <TreeMap
                    key={`map-zoom-${mapZoom}`}
                    trees={collaborativeTrees}
                    height="100%"
                    onMapClick={handleMapClick}
                    center={location ? [location.lat, location.lng] : [-31.4201, -64.1888]}
                    zoom={mapZoom}
                    selectedLocation={location ? [location.lat, location.lng] : null}
                    restrictToGreenSpaces={locationType === 'public'}
                    showGreenSpaces={locationType === 'public'}
                    onNotInGreenSpace={() => {
                      toast({
                        title: "Ubicación no permitida",
                        description: "Solo puedes plantar árboles en espacios verdes de Córdoba Capital (plazas, parques, veredas)",
                        variant: "destructive"
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Nursery Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 mb-4">
                <div className="flex items-start gap-3">
                  <Store className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Viveros cercanos a tu ubicación</h4>
                    <p className="text-sm text-green-800">
                      Se encontraron {nurseries.length} viveros en un radio de 50 km. Elige el que más te convenga por distancia, precio o rating.
                    </p>
                  </div>
                </div>
              </div>

              {loadingNurseries ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
                </div>
              ) : nurseries.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No se encontraron viveros cercanos</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nurseries.map((nursery) => (
                    <button
                      key={nursery.id}
                      onClick={() => setSelectedNursery(nursery)}
                      className={`text-left p-4 border-2 rounded-lg hover:border-green-500 transition-all ${
                        selectedNursery?.id === nursery.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{nursery.name || `Vivero #${nursery.id}`}</h3>
                        {selectedNursery?.id === nursery.id && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          A {nursery.distance ? Number(nursery.distance).toFixed(1) : '0'} km de distancia
                        </p>
                        <p className="flex items-center gap-2">
                          ⭐ {nursery.rating ? Number(nursery.rating).toFixed(1) : '5.0'}/5 ({nursery.reviews_count || 0} valoraciones)
                        </p>
                        <p className="flex items-center gap-2">
                          ⏱️ Preparación: {nursery.avg_preparation_days || '2-3'} días
                        </p>
                        <p className="flex items-center gap-2">
                          🌳 {nursery.species_count || '0'} especies disponibles
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Tree Catalog */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200 mb-4">
                <div className="flex items-start gap-3">
                  <Leaf className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Catálogo de {selectedNursery?.name || 'vivero seleccionado'}
                    </h4>
                    <p className="text-sm text-amber-800">
                      {locationType === 'public'
                        ? 'Mostrando solo especies nativas aprobadas para espacios públicos'
                        : 'Catálogo completo: nativas, exóticas, frutales y ornamentales'}
                    </p>
                  </div>
                </div>
              </div>

              {loadingCatalog ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full"></div>
                </div>
              ) : catalog.length === 0 ? (
                <div className="text-center py-12">
                  <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay árboles disponibles en este vivero</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalog.map((tree) => (
                    <button
                      key={tree.id}
                      onClick={() => setSelectedTree(tree)}
                      className={`text-left p-4 border-2 rounded-lg hover:border-amber-500 transition-all ${
                        selectedTree?.id === tree.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{tree.common_name || tree.scientific_name}</h3>
                        {selectedTree?.id === tree.id && (
                          <Check className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      {tree.scientific_name && (
                        <p className="text-sm italic text-gray-500 mb-2">{tree.scientific_name}</p>
                      )}
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-semibold text-green-700 text-lg">
                          ${tree.price ? tree.price.toLocaleString('es-AR') : '0'}
                        </p>
                        <p>Stock: {tree.stock || 0} disponibles</p>
                        <p>Altura: {tree.height || '1.5'}m</p>
                        <p>Preparación: {tree.preparation_days || 2} días</p>
                        {tree.category && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tree.category}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Personal Info */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">👤</span>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Información del certificado
                    </h4>
                    <p className="text-sm text-purple-700">
                      Estos datos aparecerán en tu certificado digital personalizado
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aparecerá en tu certificado
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu apellido *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Pérez"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aparecerá en tu certificado
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu email *
                </label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recibirás tu certificado a este email
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Tree Details (Personalization) */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">🌳</span>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">
                      Dale identidad a tu árbol
                    </h4>
                    <p className="text-sm text-green-700">
                      Este nombre aparecerá en tu certificado y en el mapa global
                    </p>
                  </div>
                </div>
              </div>

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
                  Dale un nombre especial que represente tu contribución
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje personal (opcional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px] resize-none"
                  placeholder="Escribe un mensaje especial...
Ej: Plantado con amor para celebrar el nacimiento de nuestra hija Emma."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length}/500 caracteres
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Payment */}
          {currentStep === 6 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  <span>Resumen de tu plantación</span>
                </h3>

                <div className="space-y-4">
                  <div className="border-t pt-4 space-y-3">
                    {/* Name */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Propietario:</span>
                      <span className="font-medium text-gray-900">{firstName} {lastName}</span>
                    </div>

                    {/* Tree Name */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre del árbol:</span>
                      <span className="font-medium text-gray-900">{treeName}</span>
                    </div>

                    {/* Location */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium text-gray-900">
                        {locationType === 'public' && '🌍 Espacio Público'}
                        {locationType === 'own_property' && '🏠 Mi Domicilio'}
                        {locationType === 'third_party_property' && '🔑 Propiedad Ajena'}
                      </span>
                    </div>

                    {/* Country */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">País:</span>
                      <span className="font-medium text-gray-900">{countryName}</span>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center pt-3 border-t-2">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-3xl font-bold text-green-600">
                        $24.000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span>🎁</span>
                  <span>Incluido en tu plantación</span>
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Plantación de un árbol REAL en la ubicación seleccionada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Certificado digital personalizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Tu árbol aparece en el mapa global</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Evidencia fotográfica del proceso de plantación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Seguimiento completo hasta plantación final</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>100 EcoPoints de recompensa</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
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

      {/* Address Verification Modal */}
      <AddressVerificationModal
        open={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          // Navigate to certificate after closing modal
          if (plantedTree) {
            if (onComplete) {
              onComplete(plantedTree);
            } else {
              navigate(`/certificado/${plantedTree.id}`);
            }
          }
        }}
        treeId={plantedTree?.id}
        treeLocation={location}
        onVerificationSubmitted={(data) => {
          // Verification submitted successfully
          if (plantedTree) {
            if (onComplete) {
              onComplete(plantedTree);
            } else {
              navigate(`/certificado/${plantedTree.id}`);
            }
          }
        }}
      />
    </div>
  );
};

export default PlantTreeWizard;
