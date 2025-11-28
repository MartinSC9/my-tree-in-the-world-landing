import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@shared/components/ui/alert';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Home, MapPin, CheckCircle, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import locationService from '@shared/services/locationService';
import { toast } from '@shared/components/ui/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clicks en el mapa
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const HomeAddressSettings = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasAddress, setHasAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  // Formulario
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([-31.4201, -64.1888]); // Córdoba, Argentina

  useEffect(() => {
    loadCurrentAddress();
  }, []);

  const loadCurrentAddress = async () => {
    try {
      setInitialLoading(true);
      const data = await locationService.getHomeAddress();

      if (data.has_home_address) {
        setHasAddress(true);
        setCurrentAddress(data.home_address);
        setAddress(data.home_address.address);

        if (data.home_address.latitude && data.home_address.longitude) {
          const coords = [data.home_address.latitude, data.home_address.longitude];
          setSelectedLocation(coords);
          setMapCenter(coords);
        }
      }
    } catch (error) {
      console.error('Error al cargar domicilio:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleMapClick = async (latlng) => {
    setSelectedLocation([latlng.lat, latlng.lng]);

    // Geocodificación reversa para obtener dirección
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&accept-language=es`
      );
      const data = await response.json();

      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error en geocodificación reversa:', error);
    }
  };

  const handleSaveAddress = async () => {
    if (!address.trim()) {
      toast({
        title: 'Dirección requerida',
        description: 'Por favor ingresa tu dirección',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: 'Ubicación requerida',
        description: 'Por favor selecciona tu ubicación en el mapa haciendo clic',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await locationService.saveHomeAddress({
        address: address.trim(),
        latitude: selectedLocation[0],
        longitude: selectedLocation[1]
      });

      toast({
        title: 'Domicilio registrado',
        description: 'Tu domicilio ha sido verificado exitosamente'
      });

      await loadCurrentAddress();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'No se pudo registrar el domicilio',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu domicilio registrado?')) {
      return;
    }

    try {
      setLoading(true);
      await locationService.deleteHomeAddress();

      toast({
        title: 'Domicilio eliminado',
        description: 'Tu domicilio ha sido eliminado exitosamente'
      });

      setHasAddress(false);
      setCurrentAddress(null);
      setAddress('');
      setSelectedLocation(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'No se pudo eliminar el domicilio',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setSelectedLocation(coords);
          setMapCenter(coords);
          handleMapClick({ lat: coords[0], lng: coords[1] });
        },
        (error) => {
          toast({
            title: 'Error de geolocalización',
            description: 'No se pudo obtener tu ubicación actual',
            variant: 'destructive'
          });
        }
      );
    } else {
      toast({
        title: 'Geolocalización no disponible',
        description: 'Tu navegador no soporta geolocalización',
        variant: 'destructive'
      });
    }
  };

  if (initialLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Mi Domicilio
            </CardTitle>
            <CardDescription>
              Registra tu dirección para plantar árboles con catálogo completo
            </CardDescription>
          </div>
          {hasAddress && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAddress}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información actual */}
        {hasAddress && currentAddress?.verified && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Domicilio verificado</AlertTitle>
            <AlertDescription className="text-green-700">
              <strong>{currentAddress.address}</strong>
              <br />
              Ahora puedes plantar especies completas en un radio de 50 metros
            </AlertDescription>
          </Alert>
        )}

        {/* Explicación */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>¿Para qué sirve registrar mi domicilio?</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Acceso a <strong>catálogo completo</strong> de especies (nativas, exóticas, frutales, ornamentales)</li>
              <li>Detección automática cuando plantas dentro de tu propiedad (radio 50m)</li>
              <li>Sin restricciones municipales para tu jardín privado</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Dirección Completa</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle Falsa 123, Córdoba, Argentina"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              También puedes hacer clic en el mapa para seleccionar tu ubicación
            </p>
          </div>

          {/* Mapa */}
          <div>
            <Label className="mb-2 block">Ubicación en el Mapa</Label>
            <div className="relative">
              <Button
                type="button"
                size="sm"
                onClick={handleUseCurrentLocation}
                className="absolute top-2 right-2 z-[1000] bg-white text-gray-700 hover:bg-gray-100 border"
                disabled={loading}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Usar mi ubicación actual
              </Button>

              <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onLocationSelect={handleMapClick} />
                  {selectedLocation && (
                    <Marker position={selectedLocation} />
                  )}
                </MapContainer>
              </div>
            </div>

            {selectedLocation && (
              <p className="text-xs text-gray-500 mt-2">
                Coordenadas: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
              </p>
            )}
          </div>

          {/* Botón de guardar */}
          <Button
            onClick={handleSaveAddress}
            disabled={loading || !address.trim() || !selectedLocation}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : hasAddress ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Actualizar Domicilio
              </>
            ) : (
              <>
                <Home className="h-4 w-4 mr-2" />
                Registrar Domicilio
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeAddressSettings;
