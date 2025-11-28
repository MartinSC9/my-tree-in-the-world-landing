import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom tree marker icon
const treeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwNTk2NjkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMTJ2OCIvPjxwYXRoIGQ9Ik0xMiAyMHY0Ii8+PHBhdGggZD0iTTEyIDRhNCA0IDAgMCAwLTQgNGMwIDEuNjkuNjQgMy4yOCAxLjY4IDQuNDdBNCA0IDAgMCAwIDEyIDIwYTQgNCAwIDAgMCAyLjMyLTcuNTNBNS43NSA1Ljc1IDAgMCAwIDE2IDhjMC0yLjIxLTEuNzktNC00LTR6Ii8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to update map view when coordinates change
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const TreeTrackingMap = ({ tree, workOrder }) => {
  const [mapCenter, setMapCenter] = useState(null);
  const [hasActualLocation, setHasActualLocation] = useState(false);

  useEffect(() => {
    // Priorizar coordenadas reales de plantación si existen
    if (workOrder?.actual_latitude && workOrder?.actual_longitude) {
      setMapCenter([
        parseFloat(workOrder.actual_latitude),
        parseFloat(workOrder.actual_longitude)
      ]);
      setHasActualLocation(true);
    } else if (tree?.latitude && tree?.longitude) {
      setMapCenter([
        parseFloat(tree.latitude),
        parseFloat(tree.longitude)
      ]);
      setHasActualLocation(false);
    }
  }, [tree, workOrder]);

  if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Ubicación no disponible
        </h3>
        <p className="text-sm text-gray-500">
          La ubicación del árbol aún no ha sido registrada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Map Info Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <h3 className="font-semibold">Ubicación del Árbol</h3>
        </div>
        {hasActualLocation && (
          <div className="flex items-center space-x-1 bg-green-700 px-2 py-1 rounded text-xs">
            <Navigation className="h-3 w-3" />
            <span>Ubicación Real</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <ChangeView center={mapCenter} zoom={15} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={mapCenter} icon={treeIcon}>
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-green-700 mb-1">
                  {tree?.name || 'Árbol'}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {tree?.country || 'Ubicación'}
                </p>
                {hasActualLocation && (
                  <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-700">
                    ✓ Ubicación confirmada por el plantador
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  <div>Lat: {mapCenter[0].toFixed(6)}</div>
                  <div>Lng: {mapCenter[1].toFixed(6)}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Map Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Latitud:</span>
            <span className="font-medium text-gray-900 ml-2">
              {mapCenter[0].toFixed(6)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Longitud:</span>
            <span className="font-medium text-gray-900 ml-2">
              {mapCenter[1].toFixed(6)}
            </span>
          </div>
        </div>

        {!hasActualLocation && tree?.country && (
          <p className="text-xs text-gray-500 mt-2">
            📍 Ubicación planificada: {tree.country}
          </p>
        )}

        {hasActualLocation && workOrder?.planting_evidence_url && (
          <a
            href={workOrder.planting_evidence_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 mt-2"
          >
            <span>Ver foto de evidencia</span>
            <span>→</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default TreeTrackingMap;
