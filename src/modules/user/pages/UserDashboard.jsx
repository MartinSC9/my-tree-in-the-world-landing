import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import api from '@core/config/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, TreePine, Award, Lightbulb, Star, Download,
  Share2, MapPin, Calendar, Mail, Lock, LogOut,
  Trophy, Target, Leaf, Heart, Users,
  Camera, Edit3, Send, Bell, Gift, Zap, Globe,
  ThumbsUp, Eye, Plus, Search, Filter, TrendingUp, X,
  MessageCircle, Percent, BookOpen, ShoppingBag, CheckCircle, Sprout, Clock,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Checkbox } from '@shared/components/ui/checkbox';
import { Label } from '@shared/components/ui/label';
import { useAuth } from '@core/contexts/AuthContext';
import { useTree } from '@core/contexts/TreeContext';
import { toast } from '@shared/components/ui/use-toast';
import TreeMap from '@features/trees/components/TreeMap';
import Modal from '@shared/components/ui/modal';
import TreeProgressTimeline from '@features/trees/components/TreeProgressTimeline';
import TreeChat from '@features/trees/components/TreeChat';
import PlanterRating from '@modules/plantador/components/PlanterRating';
import TreeTrackingMap from '@features/trees/components/TreeTrackingMap';
import TreeDetailsPage from '@features/trees/pages/TreeDetailsPage';
import PlantTreeWizard from '@features/trees/components/PlantTreeWizard';
import CreateCollaborativeTreeWizard from '@features/collaborative-trees/components/CreateCollaborativeTreeWizard';
import ArbolesUnifiedSection from '@modules/user/components/ArbolesUnifiedSection';
import { userService } from '@shared/services/userService';
import postService from '@shared/services/postService';
import notificationService from '@shared/services/notificationService';
import { workOrderService } from '@modules/admin/services/workOrderService';
import collaborativeTreeService from '@features/collaborative-trees/services';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Componente para manejar eventos del mapa
const MapEventsHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });
  return null;
};

// Componente de mapa memoizado para evitar re-renders
const PlantTreeMapComponent = React.memo(({ selectedLocation, onLocationSelect }) => {
  const markerIcon = React.useMemo(() => new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }), []);

  return (
    <MapContainer
      center={[-31.4201, -64.1888]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      key="plant-tree-map-static"
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapEventsHandler onLocationSelect={onLocationSelect} />
      {selectedLocation && (
        <Marker
          position={[selectedLocation.latitude, selectedLocation.longitude]}
          icon={markerIcon}
        />
      )}
    </MapContainer>
  );
});

PlantTreeMapComponent.displayName = 'PlantTreeMapComponent';

// Componente de Eco Tip memoizado para evitar re-renders
const EcoTipComponent = React.memo(() => {
  const ecoTips = [
    "Reducí el uso de plásticos de un solo uso",
    "Plantá especies nativas en tu jardín",
    "Evitá derrochar agua en actividades diarias",
    "Sumate a iniciativas locales de reforestación",
    "Usa transporte público o bicicleta",
    "Consume productos locales y de temporada"
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % ecoTips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2 mb-2">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Tip Ecológico</span>
      </div>
      <p className="text-xs text-blue-700">{ecoTips[currentTip]}</p>
    </div>
  );
});

EcoTipComponent.displayName = 'EcoTipComponent';

// Función auxiliar para obtener iniciales
const getInitials = (user) => {
  if (!user) return 'U';

  // Si tiene first_name y last_name
  if (user.first_name && user.last_name) {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  }

  // Si tiene name
  if (user.name) {
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }

  // Si tiene username
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }

  // Si tiene email
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }

  return 'U';
};

// Componente memoizado para cada post individual del feed
const FeedPostCard = React.memo(({
  post,
  currentUser,
  expandedComments,
  postComments,
  onLike,
  onComment,
  onShare,
  onOpenCommentModal,
  onUserClick
}) => {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 rounded-xl">
        <CardContent className="p-0">
          {/* Post Header */}
          <div className="p-4 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              {post.user.avatar ? (
                <img src={post.user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-base font-bold">
                    {getInitials(currentUser)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <button
                onClick={() => onUserClick && post.user.id && onUserClick(post.user.id)}
                className="font-semibold text-gray-900 hover:text-green-600 transition-colors text-left"
              >
                {post.user.name}
              </button>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(post.timestamp).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop';
                  e.target.onerror = null;
                }}
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(post.id)}
                  className={`hover:bg-green-50 ${post.user_has_liked ? 'text-green-600' : 'text-gray-600'}`}
                >
                  <ThumbsUp className={`h-5 w-5 mr-2 ${post.user_has_liked ? 'fill-current' : ''}`} />
                  <span className="font-semibold">{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment(post.id)}
                  className="hover:bg-blue-50 text-gray-600"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span className="font-semibold">{post.comments}</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(post.id)}
                className="hover:bg-purple-50 text-gray-600"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Compartir
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {expandedComments[post.id] && (
            <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between pt-4 mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comentarios
                </h4>
                <Button
                  size="sm"
                  onClick={() => onOpenCommentModal(post.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Comentar
                </Button>
              </div>

              {postComments[post.id] && postComments[post.id].length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {postComments[post.id].map(comment => (
                    <div key={comment.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {comment.user_name ? comment.user_name.substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">{comment.user_name || 'Usuario'}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No hay comentarios aún.</p>
                  <p className="text-xs text-gray-400">¡Sé el primero en comentar!</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renders innecesarios
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.likes === nextProps.post.likes &&
    prevProps.post.comments === nextProps.post.comments &&
    prevProps.post.user_has_liked === nextProps.post.user_has_liked &&
    prevProps.expandedComments[prevProps.post.id] === nextProps.expandedComments[nextProps.post.id] &&
    JSON.stringify(prevProps.postComments[prevProps.post.id]) === JSON.stringify(nextProps.postComments[nextProps.post.id])
  );
});

FeedPostCard.displayName = 'FeedPostCard';

 const ProfileSection = ({
  isEditingProfile,
  setIsEditingProfile,
  editedProfile,
  setEditedProfile,
  user,
  userProfile,
  setUserProfile,
  updateUser,
  userTrees,
  coverImage,
  handleUploadPhoto,
  handlePasswordChange,
  passwordData,
  setPasswordData,
  showPasswordChange,
  setShowPasswordChange,
  toast
}) => {

  const handleSaveProfile = async () => {
    try {
      // Preparar datos para actualizar
      const updateData = {
        first_name: editedProfile.firstName || '',
        last_name: editedProfile.lastName || '',
        email: editedProfile.email || user.email,
        document_number: editedProfile.documentNumber || '',
        bio: editedProfile.bio || '',
        location: editedProfile.location || '',
        website: editedProfile.website || ''
      };

      // Llamar al backend para actualizar
      await userService.updateUser(user.id, updateData);

      // Actualizar el contexto de usuario
      updateUser({
        ...updateData,
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        email: updateData.email,
        document_number: updateData.document_number
      });

      // Actualizar el perfil local
      setUserProfile(prev => ({
        ...prev,
        bio: editedProfile.bio,
        location: editedProfile.location,
        website: editedProfile.website
      }));

      setIsEditingProfile(false);
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados exitosamente"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

    return (
      <div className="space-y-6">
        {/* Foto de portada */}
        <Card className="overflow-hidden">
          <div className="relative h-32 sm:h-48 bg-gradient-to-r from-green-400 to-blue-500">
            {coverImage ? (
              <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500" />
            )}
          </div>

          {/* Información del perfil */}
          <div className="px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16">
              {/* Avatar e información */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full p-1.5 shadow-xl ring-4 ring-white">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl sm:text-4xl font-bold">
                          {getInitials(user)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del usuario */}
                <div className="text-center sm:text-left pb-0 sm:pb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.name || user?.username || user?.email}
                  </h1>
                  {user?.email && (
                    <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Botón editar */}
              <div className="mt-4 sm:mt-0 sm:pb-2 flex justify-center sm:justify-end">
                <Button
                  onClick={() => {
                    setEditedProfile({
                      firstName: user?.first_name || '',
                      lastName: user?.last_name || '',
                      email: user?.email || '',
                      documentNumber: user?.document_number || '',
                      bio: userProfile.bio || '',
                      location: userProfile.location || '',
                      website: userProfile.website || ''
                    });
                    setIsEditingProfile(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="flex gap-6 sm:gap-8 mt-4 pt-4 border-t border-gray-200 justify-center sm:justify-start">
              <div className="text-center sm:text-left">
                <div className="font-bold text-lg sm:text-xl text-gray-900">{userTrees.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Árboles plantados</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-lg sm:text-xl text-gray-900">{userProfile.ecoPoints}</div>
                <div className="text-xs sm:text-sm text-gray-600">EcoPoints</div>
              </div>
            </div>
          </div>
        </Card>
    
          {/* Formulario de edición */}
        {isEditingProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5" />
                <span>Editar información personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <Input
                      value={editedProfile.firstName}
                      onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <Input
                      value={editedProfile.lastName}
                      onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                      placeholder="Tu apellido"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de DNI
                    </label>
                    <Input
                      value={editedProfile.documentNumber}
                      onChange={(e) => setEditedProfile({...editedProfile, documentNumber: e.target.value})}
                      placeholder="12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía personal
                    </label>
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      placeholder="Cuéntanos sobre ti y tu pasión por el medio ambiente..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <Input
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                      placeholder="Ciudad, País"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitio web
                    </label>
                    <Input
                      value={editedProfile.website}
                      onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                      placeholder="https://tu-sitio-web.com"
                    />
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    
        {/* Información del perfil (vista) */}
        {!isEditingProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Sobre mí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Biografía */}
              <div>
                {userProfile.bio ? (
                  <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No has agregado una biografía aún.</p>
                )}
              </div>

              {/* Información adicional */}
              {(user?.document_number || userProfile.location || userProfile.website) && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {user?.document_number && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>DNI: {user.document_number}</span>
                    </div>
                  )}
                  {userProfile.location && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.website && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a
                        href={userProfile.website.startsWith('http') ? userProfile.website : `https://${userProfile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 hover:underline"
                      >
                        {userProfile.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Configuración de contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Seguridad</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showPasswordChange ? (
              <Button
                onClick={() => setShowPasswordChange(true)}
                variant="outline"
                className="w-full"
              >
                Cambiar contraseña
              </Button>
            ) : (
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Contraseña actual"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                />
                <Input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                />
                <Input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowPasswordChange(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handlePasswordChange}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Actualizar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
// Obtener configuración de estado para work orders y árboles (movido fuera para evitar recreación)
// Obtener configuración de estado para work orders y árboles
const getStatusConfig = (status) => {
  const statusConfig = {
    // Estados de work_orders
    'pendiente_autorizacion': {
      emoji: '⏳',
      label: 'Pendiente Autorización',
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      progress: 1
    },
    'autorizada': {
      emoji: '✅',
      label: 'Autorizada por Admin',
      bg: 'bg-green-100',
      text: 'text-green-700',
      progress: 2
    },
    'asignada_vivero': {
      emoji: '🏭',
      label: 'Asignada a Vivero',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      progress: 3
    },
    'vivero_preparando': {
      emoji: '📦',
      label: 'Vivero Preparando',
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      progress: 4
    },
    'planta_lista': {
      emoji: '🌱',
      label: 'Planta Lista',
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      progress: 5
    },
    'entregada_plantador': {
      emoji: '🚚',
      label: 'Entregada a Plantador',
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      progress: 6
    },
    'plantador_en_camino': {
      emoji: '👷',
      label: 'Plantador en Camino',
      bg: 'bg-cyan-100',
      text: 'text-cyan-700',
      progress: 7
    },
    'plantando': {
      emoji: '🚀',
      label: 'Plantando',
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      progress: 8
    },
    'plantada': {
      emoji: '🌳',
      label: 'Plantada',
      bg: 'bg-green-200',
      text: 'text-green-900',
      progress: 9
    },
    'cancelada': {
      emoji: '❌',
      label: 'Cancelada',
      bg: 'bg-red-100',
      text: 'text-red-700',
      progress: 0
    },
    // Estados de árboles (trees.status)
    'sin_plantar': {
      emoji: '🌱',
      label: 'Pendiente de Proceso',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      progress: 0
    },
    'en_proceso': {
      emoji: '⚙️',
      label: 'En Proceso',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      progress: 5
    },
    'plantado': {
      emoji: '🌳',
      label: 'Plantado',
      bg: 'bg-green-200',
      text: 'text-green-900',
      progress: 9
    },
    'verificado': {
      emoji: '✅',
      label: 'Verificado',
      bg: 'bg-green-100',
      text: 'text-green-700',
      progress: 9
    },
    'cancelado': {
      emoji: '❌',
      label: 'Cancelado',
      bg: 'bg-red-100',
      text: 'text-red-700',
      progress: 0
    }
  };

  return statusConfig[status] || {
    emoji: '❓',
    label: status || 'Desconocido',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    progress: 0
  };
};

const UserDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const { loadTrees } = useTree();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  
  // Estados
  const [userTrees, setUserTrees] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', image: null, type: 'text' });
  const [friends, setFriends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [userProfile, setUserProfile] = useState({
    avatar: null,
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    level: 'Explorador Ecológico',
    badges: [],
    ecoPoints: 0
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedTab, setSelectedTab] = useState('feed');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [coverImage, setCoverImage] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    documentNumber: '',
    bio: '',
    location: '',
    website: ''
  });

  const [showTreeDetails, setShowTreeDetails] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [treeWorkOrders, setTreeWorkOrders] = useState({});

  // Estados para datos batch (optimización - lazy loading)
  const [allMessages, setAllMessages] = useState({});
  const [allHistories, setAllHistories] = useState({});
  const [batchDataLoaded, setBatchDataLoaded] = useState(false); // Flag para no recargar
  const [loadingBatchData, setLoadingBatchData] = useState(false);

  // Estados para modal de progreso
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTreeForProgress, setSelectedTreeForProgress] = useState(null);
  const [selectedWorkOrderForProgress, setSelectedWorkOrderForProgress] = useState(null);

  // Estados para árboles colaborativos
  const [myCollaborativeProjects, setMyCollaborativeProjects] = useState([]);
  const [myContributions, setMyContributions] = useState([]);
  const [loadingCollaborative, setLoadingCollaborative] = useState(false);
  const [hasLoadedCollaborative, setHasLoadedCollaborative] = useState(false);
  const [showExploreProjectsModal, setShowExploreProjectsModal] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Refs para control de carga
  const lastLoadedKey = React.useRef(null);
  const loadingUserData = React.useRef(false);
  const loadingWorkOrders = React.useRef(false);
  const loadingCollaborativeData = React.useRef(false);

  // Flag para work orders cargados
  const [workOrdersLoaded, setWorkOrdersLoaded] = useState(false);

  // Estado para proyectos colaborativos disponibles
  const [availableProjects, setAvailableProjects] = useState([]);

  // Estado para todos los árboles colaborativos
  const [allCollaborativeTrees, setAllCollaborativeTrees] = useState([]);

  // Estado para el filtro del mapa
  const [mapFilter, setMapFilter] = useState('all'); // 'all', 'my_projects', 'my_contributions', 'active', 'completed'

  // Filtrar árboles colaborativos según el filtro seleccionado
  const filteredCollaborativeTrees = React.useMemo(() => {
    if (!allCollaborativeTrees.length) return [];

    switch (mapFilter) {
      case 'my_projects':
        return allCollaborativeTrees.filter(tree => tree.isMyProject);

      case 'my_contributions':
        const myContributionIds = myContributions.map(c => c.id);
        return allCollaborativeTrees.filter(tree => myContributionIds.includes(tree.id));

      case 'active':
        return allCollaborativeTrees.filter(tree => tree.funding_percentage < 100);

      case 'completed':
        return allCollaborativeTrees.filter(tree => tree.funding_percentage >= 100);

      case 'all':
      default:
        return allCollaborativeTrees;
    }
  }, [allCollaborativeTrees, mapFilter, myContributions]);

  // Funciones de carga de datos - Definir ANTES de los useEffects
  const loadPosts = useCallback(async () => {
    try {
      const postsData = await postService.getPosts(20, 0);
      if (postsData && postsData.posts) {
        const transformedPosts = postsData.posts.map(post => ({
          id: post.id,
          user: {
            id: post.user_id,
            name: post.user_name || post.username || post.email,
            avatar: post.avatar,
            username: post.username
          },
          content: post.content,
          image: post.image_url || null,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          timestamp: post.created_at,
          user_has_liked: post.user_has_liked
        }));
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }, []);

  const loadNotificationsData = useCallback(async () => {
    try {
      const notificationsData = await notificationService.getNotifications(false, 50, 0);
      if (notificationsData && notificationsData.notifications) {
        const transformedNotifications = notificationsData.notifications.map(notif => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          timestamp: notif.created_at,
          read: notif.is_read
        }));
        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  const loadSocialMockData = useCallback(() => {
    setFriends([
      { id: 1, name: 'Ana García', avatar: null, treesPlanted: 15 },
      { id: 2, name: 'Carlos López', avatar: null, treesPlanted: 8 }
    ]);

    setChallenges([
      {
        id: 1,
        title: 'Plantador Semanal',
        description: 'Planta 3 árboles esta semana',
        progress: 1,
        target: 3,
        reward: '50 EcoPoints',
        deadline: '2024-01-15'
      }
    ]);
  }, []);

  // Efectos
  useEffect(() => {
    if (user && location.key !== lastLoadedKey.current) {
      lastLoadedKey.current = location.key;
      loadUserData();
      // NO cargar datos sociales aquí para evitar re-renders innecesarios
      // Cada sección cargará sus propios datos cuando sea necesaria

      // Actualizar userProfile con los datos del usuario
      setUserProfile(prev => ({
        ...prev,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      }));
    }
  }, [user, location.key]); // Recargar datos cuando se navegue de vuelta al dashboard

  // Cargar posts solo cuando se visite el feed
  useEffect(() => {
    const isFeedPage = location.pathname.includes('/feed');
    if (isFeedPage && user && posts.length === 0) {
      loadPosts();
    }
  }, [location.pathname, user, posts.length, loadPosts]);

  // Cargar notificaciones solo cuando se visite la sección de notificaciones
  useEffect(() => {
    const isNotificationsPage = location.pathname.includes('/notificaciones');
    if (isNotificationsPage && user && notifications.length === 0) {
      loadNotificationsData();
    }
  }, [location.pathname, user, notifications.length, loadNotificationsData]);

  // Cargar datos mock solo cuando se visita la sección de retos (challenges)
  useEffect(() => {
    const isChallengesPage = location.pathname.includes('/retos');
    if (isChallengesPage && user && friends.length === 0) {
      loadSocialMockData();
    }
  }, [location.pathname, user, friends.length, loadSocialMockData]);

  // Cargar datos colaborativos solo cuando se visita esa sección
  useEffect(() => {
    const isCollaborativePage = location.pathname.includes('/colaborativos');

    if (isCollaborativePage && !hasLoadedCollaborative && user) {
      const loadCollaborativeData = async () => {
        // Evitar ejecuciones concurrentes
        if (loadingCollaborativeData.current) {
          return;
        }

        try {
          loadingCollaborativeData.current = true;
          setLoadingCollaborative(true);
          const [projects, contributions, allTrees] = await Promise.all([
            collaborativeTreeService.getMyProjects(),
            collaborativeTreeService.getMyContributions(),
            collaborativeTreeService.getCollaborativeTrees({ status: 'active', limit: 200 })
          ]);
          const myProjects = projects.my_projects || [];
          setMyCollaborativeProjects(myProjects);
          setMyContributions(contributions.my_contributions || []);

          // Mapear árboles colaborativos para el mapa con type='collaborative'
          // Marcar cuáles son proyectos del usuario actual
          const myProjectIds = myProjects.map(p => p.id);
          const treesWithType = (allTrees.collaborative_trees || allTrees.trees || []).map(tree => ({
            ...tree,
            type: 'collaborative',
            isMyProject: myProjectIds.includes(tree.id) // Marcar proyectos propios
          }));
          setAllCollaborativeTrees(treesWithType);
          setHasLoadedCollaborative(true);
        } catch (error) {
          console.error('❌ Error al cargar datos colaborativos:', error);
          console.error('❌ Error completo:', JSON.stringify(error, null, 2));
          if (error.response) {
            console.error('❌ Response data:', error.response.data);
            console.error('❌ Response status:', error.response.status);
          }
          // No limpiar los arrays si hay error - mantener el estado anterior
          toast.error(`Error al cargar proyectos: ${error.error || error.message || 'Error desconocido'}`);
          setHasLoadedCollaborative(true);
        } finally {
          setLoadingCollaborative(false);
          loadingCollaborativeData.current = false;
        }
      };

      loadCollaborativeData();
    }
  }, [location.pathname, hasLoadedCollaborative, user]);

  // Funciones
  const loadUserData = async () => {
    // Evitar ejecuciones múltiples simultáneas
    if (loadingUserData.current) {
      return;
    }

    try {
      loadingUserData.current = true;
      // Cargar solo los árboles del usuario actual
      const trees = await loadTrees({ user_id: user?.id });
      setUserTrees(trees || []);
      loadUserCertificates(trees || []);
      setUserProfile(prev => ({
        ...prev,
        ecoPoints: (trees?.length || 0) * 10
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      loadingUserData.current = false;
    }
  };

  // Cargar work orders - LAZY LOADING (solo cuando se necesita)
  const loadWorkOrders = useCallback(async () => {
    // Si ya se cargaron o están cargando, no recargar
    if (workOrdersLoaded || loadingWorkOrders.current) {
      return;
    }

    try {
      loadingWorkOrders.current = true;
      const token = localStorage.getItem('token');
      const workOrdersRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/work-orders?user_id=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Mapear work orders por tree_id
      const workOrdersMap = {};
      if (workOrdersRes.data.workOrders) {
        workOrdersRes.data.workOrders.forEach(wo => {
          if (wo.tree_id) {
            workOrdersMap[wo.tree_id] = wo;
          }
        });
      }

      setTreeWorkOrders(workOrdersMap);
      setWorkOrdersLoaded(true);
    } catch (err) {
      console.error('❌ Error loading work orders:', err);
    } finally {
      loadingWorkOrders.current = false;
    }
  }, [workOrdersLoaded, user]);

  // useEffect para cargar work orders solo cuando se visita la sección de árboles
  useEffect(() => {
    const isTreesPage = location.pathname.includes('/arboles') && !location.pathname.includes('/plantararbol');
    if (isTreesPage && user && !workOrdersLoaded) {
      loadWorkOrders();
    }
  }, [location.pathname, user, workOrdersLoaded, loadWorkOrders]);

  // Cargar datos batch (mensajes e historiales) - LAZY LOADING
  const loadBatchData = async () => {
    // Si ya se cargaron, no recargar
    if (batchDataLoaded || loadingBatchData) {
      return;
    }

    try {
      setLoadingBatchData(true);
      const token = localStorage.getItem('token');
      // Cargar mensajes e historiales en paralelo
      const [messagesRes, historiesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/messages/user/all`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/stats/user/all-histories`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAllMessages(messagesRes.data.messagesByWorkOrder || {});
      setAllHistories(historiesRes.data.historyByWorkOrder || {});
      setBatchDataLoaded(true);
    } catch (err) {
      console.error('❌ Error loading batch data:', err);
    } finally {
      setLoadingBatchData(false);
    }
  };

  const loadUserCertificates = (trees) => {
    const certs = trees.map(tree => ({
      id: tree.id,
      treeName: tree.name || 'Árbol',
      location: tree.country || 'Ubicación no especificada',
      date: tree.planted_at || new Date().toISOString(),
      certificateUrl: `/certificate/${tree.id}`
    }));
    setCertificates(certs);
  };

  const getEcoLevel = (treeCount) => {
    if (treeCount >= 50) return 'Guardián del Bosque';
    if (treeCount >= 20) return 'Protector Verde';
    if (treeCount >= 10) return 'Cultivador Ecológico';
    if (treeCount >= 5) return 'Sembrador Consciente';
    return 'Explorador Ecológico';
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;

    try {
      const postData = {
        content: newPost.content,
        tree_id: null
      };

      const response = await postService.createPost(postData);

      if (response && response.post) {
        const transformedPost = {
          id: response.post.id,
          user: {
            name: response.post.user_name || response.post.username || response.post.email,
            avatar: response.post.avatar
          },
          content: response.post.content,
          image: null,
          likes: 0,
          comments: 0,
          timestamp: response.post.created_at,
          user_has_liked: false
        };

        setPosts(prev => [transformedPost, ...prev]);
        setNewPost({ content: '', image: null, type: 'text' });
        setShowCreatePost(false);
        toast({ title: "Publicación creada", description: "Tu post ha sido compartido exitosamente" });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el post",
        variant: "destructive"
      });
    }
  };

  const handleLikePost = useCallback(async (postId) => {
    try {
      const response = await postService.toggleLike(postId);

      if (response) {
        setPosts(prev => prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likes: response.likes_count,
                user_has_liked: response.user_has_liked
              }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el like",
        variant: "destructive"
      });
    }
  }, []);

  const loadPostComments = useCallback(async (postId) => {
    try {
      const comments = await postService.getComments(postId);
      setPostComments(prev => ({ ...prev, [postId]: comments.comments || [] }));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, []);

  const handleCommentPost = useCallback(async (postId) => {
    // Toggle comentarios expandidos
    if (expandedComments[postId]) {
      setExpandedComments(prev => ({ ...prev, [postId]: false }));
    } else {
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
      // Cargar comentarios si no están cargados
      if (!postComments[postId]) {
        await loadPostComments(postId);
      }
    }
  }, [expandedComments, postComments, loadPostComments]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await postService.createComment(selectedPostForComment, commentText);

      if (response) {
        setPosts(prev => prev.map(post =>
          post.id === selectedPostForComment
            ? { ...post, comments: post.comments + 1 }
            : post
        ));

        setCommentText('');
        setShowCommentModal(false);
        setSelectedPostForComment(null);

        // Recargar comentarios para mostrar el nuevo
        await loadPostComments(selectedPostForComment);

        toast({ title: "Comentario agregado", description: "Tu comentario ha sido publicado" });
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el comentario",
        variant: "destructive"
      });
    }
  };

  const handleSharePost = useCallback((postId) => {
    toast({ title: "Post compartido", description: "El post ha sido compartido en tu perfil" });
  }, []);

  const handleUserClick = useCallback((userId) => {
    navigate(`/usuario/${userId}/perfil`);
  }, [navigate]);

  const handleUploadPhoto = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          if (type === 'profile') {
            setUserProfile(prev => ({ ...prev, avatar: imageUrl }));
            toast({ title: "Foto de perfil actualizada", description: "Tu avatar ha sido cambiado exitosamente" });
          } else if (type === 'cover') {
            setCoverImage(imageUrl);
            toast({ title: "Foto de portada actualizada", description: "Tu portada ha sido cambiada exitosamente" });
          } else if (type === 'post') {
            setNewPost(prev => ({ ...prev, image: imageUrl }));
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }
    if (passwordData.new.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return;
    }

    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
    toast({ title: "Contraseña actualizada", description: "Tu contraseña ha sido cambiada exitosamente" });
  };

  // Memoizar callback de abrir modal de comentarios
  const handleOpenCommentModal = useCallback((postId) => {
    setSelectedPostForComment(postId);
    setShowCommentModal(true);
  }, []);

  const handleOpenTreeDetails = async (tree) => {
    setSelectedTree(tree);
    setSelectedWorkOrder(null);

    // Cargar work orders y datos batch (lazy loading) solo cuando se necesita
    await Promise.all([
      loadWorkOrders(),
      loadBatchData()
    ]);

    // Cargar el work_order asociado
    try {
        const response = await api.get(`/work-orders?tree_id=${tree.id}`);

        if (response.data.workOrders && response.data.workOrders.length > 0) {
          setSelectedWorkOrder(response.data.workOrders[0]);
        }
      } catch (error) {
        console.error('Error al cargar work order:', error);
      }

    setShowTreeDetails(true);
  };

  const handleOpenProgressTracking = async (tree, workOrder) => {
    // Cargar work orders y datos batch (lazy loading) solo cuando se necesita
    await Promise.all([
      loadWorkOrders(),
      loadBatchData()
    ]);

    setSelectedTreeForProgress(tree);
    setSelectedWorkOrderForProgress(workOrder);
    setShowProgressModal(true);
  };

  const sidebarItems = [
    { id: 'trees', label: 'Árboles', icon: TreePine, path: `/usuario/${userId}/arboles` },
    { id: 'collaborative', label: 'Árboles Colaborativos', icon: Users, path: `/usuario/${userId}/colaborativos` },
    { id: 'feed', label: 'Feed', icon: Heart, path: `/usuario/${userId}/feed` },
    { id: 'profile', label: 'Perfil', icon: User, path: `/usuario/${userId}/perfil` },
    { id: 'rewards', label: 'Premios', icon: Gift, path: `/usuario/${userId}/premios` },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, path: `/usuario/${userId}/notificaciones` },
    // { id: 'challenges', label: 'Aprende jugando', icon: Target, path: `/usuario/${userId}/retos` },    //     // 
    { id: 'certificates', label: 'Certificados', icon: Award, path: `/usuario/${userId}/certificados` }
  ];

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/feed')) return 'feed';
    if (path.includes('/perfil')) return 'profile';
    if (path.includes('/colaborativos')) return 'collaborative';
    if (path.includes('/arboles')) return 'trees';
    if (path.includes('/premios')) return 'rewards';
    if (path.includes('/notificaciones')) return 'notifications';
    if (path.includes('/retos')) return 'challenges';
    if (path.includes('/certificados')) return 'certificates';
    return 'feed';
  };

  // Componentes para cada sección
  const FeedSection = () => (
    <div className="space-y-6">
      {/* Header con botón de crear post */}
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            Feed Ecológico
          </h2>
          <p className="text-gray-600 mt-1 ml-15">Comparte tu pasión por el medio ambiente</p>
        </div>
        <Button onClick={() => setShowCreatePost(true)} size="lg" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-5 w-5 mr-2" />
          Crear post
        </Button>
      </div>

      {/* Posts - Estilo Instagram */}
      <div className="max-w-2xl mx-auto space-y-6 px-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <FeedPostCard
              key={post.id}
              post={post}
              currentUser={user}
              expandedComments={expandedComments}
              postComments={postComments}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onShare={handleSharePost}
              onOpenCommentModal={handleOpenCommentModal}
              onUserClick={handleUserClick}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay posts aún</h3>
                <p className="text-gray-600 mb-6">
                  Sé el primero en compartir tu experiencia ambiental
                </p>
                <Button onClick={() => setShowCreatePost(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Crear tu primer post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  // Memoizar el mapa de árboles del usuario para evitar re-renders innecesarios
  const memoizedUserTreesMap = useMemo(() => {
    if (userTrees.length === 0) return null;
    return <TreeMap trees={userTrees} height="384px" />;
  }, [userTrees]);

  const TreesSection = () => (
    <div className="space-y-6 max-w-full">
      <Card className="max-w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TreePine className="h-6 w-6 text-green-600" />
              <span>Mis Árboles Individuales</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/usuario/${userId}/colaborativos`)}
                variant="outline"
                className="border-purple-600 text-purple-700 hover:bg-purple-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Ver Colaborativos
              </Button>
              <Button onClick={() => navigate(`/usuario/${userId}/plantararbol`)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Plantar árbol
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userTrees.length > 0 ? (
            <div
              className="flex gap-4 overflow-x-auto pb-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#22c55e #e5e7eb',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {userTrees.map(tree => {
                // Construir ubicación solo con país/región (sin coordenadas)
                let locationText = tree.country || 'Ubicación no especificada';

                // Obtener work order si existe
                const workOrder = treeWorkOrders[tree.id];
                const statusInfo = workOrder ? getStatusConfig(workOrder.status) : null;

                return (
                  <div key={tree.id} className="border rounded-lg p-4 space-y-2 min-w-[280px] flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <TreePine className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{tree.name || 'Árbol sin nombre'}</span>
                    </div>
                    <p className="text-sm text-gray-600">{locationText}</p>

                    <div className="space-y-2">
                      {/* Estado del árbol */}
                      {tree.status && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tree.status === 'plantado' || tree.status === 'verificado' ? 'bg-green-100 text-green-800' :
                          tree.status === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tree.status === 'sin_plantar' && '⏳ Sin Plantar'}
                          {tree.status === 'en_proceso' && '🌱 En Proceso'}
                          {tree.status === 'plantado' && '🌳 Plantado'}
                          {tree.status === 'verificado' && '✅ Verificado'}
                        </span>
                      )}

                      {/* Progress Indicator */}
                      {statusInfo && (
                        <div className="space-y-1">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                            <span className="mr-1">{statusInfo.emoji}</span>
                            {statusInfo.label}
                          </div>

                          {/* Progress Bar */}
                          {workOrder.status !== 'cancelada' && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${(statusInfo.progress / 9) * 100}%` }}
                              ></div>
                            </div>
                          )}

                          <p className="text-xs text-gray-500">
                            Paso {statusInfo.progress} de 9
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className={`flex-1 ${workOrder ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                        onClick={() => navigate(`/usuario/${userId}/arboles/${tree.id}`)}
                      >
                        {workOrder ? (
                          <>
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Ver progreso
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver detalles
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aún no has plantado ningún árbol</p>
              <Button onClick={() => navigate(`/usuario/${userId}/plantararbol`)} className="bg-green-600 hover:bg-green-700">
                Plantar tu primer árbol
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {userTrees.length > 0 && (
        <Card className="max-w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mapa de mis árboles</span>
              <span className="text-sm font-normal text-gray-500">
                {userTrees.length} {userTrees.length === 1 ? 'árbol' : 'árboles'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Mostrando solo los árboles que has plantado
              </p>
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-inner bg-gray-50">
                {memoizedUserTreesMap}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );


  const NotificationsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification.id} className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes notificaciones nuevas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const ChallengesSection = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);

  // Datos de los juegos
  const ecoGames = {
    quiz1: {
      title: "Árboles y Medio Ambiente",
      icon: "🌱",
      description: "Aprende sobre el impacto de los árboles en nuestro planeta",
      questions: [
        {
          question: "¿Cuántos árboles se necesitan para compensar las emisiones anuales de un auto?",
          options: ["2-3 árboles", "10-15 árboles", "50-100 árboles", "200-300 árboles"],
          correct: 2,
          explanation: "Se necesitan aproximadamente 50-100 árboles para compensar las emisiones de CO2 de un auto promedio durante un año."
        },
        {
          question: "¿Cuál es el árbol más alto del mundo?",
          options: ["Secuoya gigante", "Eucalipto australiano", "Pino de Montezuma", "Baobab"],
          correct: 0,
          explanation: "La secuoya gigante 'Hyperion' en California mide 115.7 metros, el árbol vivo más alto conocido."
        },
        {
          question: "¿Cuánto oxígeno produce un árbol adulto por día?",
          options: ["Suficiente para 1 persona", "Suficiente para 2-3 personas", "Suficiente para 4-5 personas", "Suficiente para 10 personas"],
          correct: 2,
          explanation: "Un árbol adulto produce oxígeno suficiente para 4-5 personas durante un día completo."
        },
        {
          question: "¿Qué porcentaje de las especies terrestres viven en los bosques?",
          options: ["30%", "50%", "70%", "80%"],
          correct: 3,
          explanation: "Los bosques albergan aproximadamente el 80% de la biodiversidad terrestre del planeta."
        },
        {
          question: "¿Cuántas toneladas de CO2 puede absorber un árbol en su vida?",
          options: ["100 kg", "500 kg", "1 tonelada", "2-3 toneladas"],
          correct: 2,
          explanation: "Un árbol puede absorber aproximadamente 1 tonelada de CO2 durante toda su vida, ayudando significativamente a combatir el cambio climático."
        },
        {
          question: "¿Cuánto puede reducir la temperatura un árbol en su entorno?",
          options: ["1-2°C", "3-5°C", "8-10°C", "15°C"],
          correct: 1,
          explanation: "Los árboles pueden reducir la temperatura ambiente hasta 3-5°C gracias a su sombra y el proceso de evapotranspiración."
        },
        {
          question: "¿Cuántos litros de agua filtra un árbol por año?",
          options: ["100 litros", "1,000 litros", "10,000 litros", "100,000 litros"],
          correct: 3,
          explanation: "Un árbol adulto puede filtrar hasta 100,000 litros de agua al año, mejorando la calidad del agua subterránea."
        }
      ]
    },
    quiz2: {
      title: "Árboles y Naturaleza",
      icon: "🌳",
      description: "Descubre datos fascinantes sobre los árboles del mundo",
      questions: [
        {
          question: "¿Cuál es el árbol más alto del mundo?",
          options: ["Secuoya gigante", "Eucalipto australiano", "Pino de Montezuma", "Baobab"],
          correct: 0,
          explanation: "La secuoya gigante 'Hyperion' en California mide 115.7 metros, el árbol vivo más alto conocido."
        },
        {
          question: "¿Cuál es el árbol más antiguo del mundo?",
          options: ["Pino Bristlecone", "Secuoya", "Olivo de Vouves", "Ciprés de Montezuma"],
          correct: 0,
          explanation: "El Pino Bristlecone 'Matusalén' en California tiene más de 4,850 años de edad."
        },
        {
          question: "¿Los árboles pueden comunicarse entre sí?",
          options: ["No, es imposible", "Solo algunos árboles", "Sí, a través de sus raíces", "Solo en bosques tropicales"],
          correct: 2,
          explanation: "Los árboles se comunican usando redes de hongos micorrícicos (llamada 'Wood Wide Web'), compartiendo nutrientes y señales de alerta."
        },
        {
          question: "¿Qué árbol crece más rápido en el mundo?",
          options: ["Eucalipto", "Bambú", "Sauce llorón", "Paulownia"],
          correct: 1,
          explanation: "El bambú puede crecer hasta 91 cm en un solo día, siendo la planta de crecimiento más rápido del mundo."
        },
        {
          question: "¿Cuántas especies de árboles existen en el mundo?",
          options: ["10,000 especies", "30,000 especies", "60,000 especies", "100,000 especies"],
          correct: 2,
          explanation: "Se estima que existen alrededor de 60,000 especies diferentes de árboles en todo el planeta."
        }
      ]
    },
    quiz3: {
      title: "Cuidado del Medio Ambiente",
      icon: "🌍",
      description: "Aprende acciones para cuidar nuestro planeta",
      questions: [
        {
          question: "¿Cuánto tiempo tarda una bolsa de plástico en descomponerse?",
          options: ["10 años", "50 años", "100 años", "Más de 400 años"],
          correct: 3,
          explanation: "Las bolsas de plástico pueden tardar entre 400 y 1000 años en descomponerse completamente, por eso es vital reducir su uso."
        },
        {
          question: "¿Cuánta agua se ahorra al cerrar la llave mientras te cepillas los dientes?",
          options: ["1 litro", "5 litros", "12 litros", "20 litros"],
          correct: 2,
          explanation: "Cerrar la llave mientras te cepillas puede ahorrar hasta 12 litros de agua por minuto. ¡Pequeñas acciones hacen grandes diferencias!"
        },
        {
          question: "¿Qué porcentaje de energía se ahorra al reciclar una lata de aluminio?",
          options: ["20%", "45%", "75%", "95%"],
          correct: 3,
          explanation: "Reciclar aluminio ahorra el 95% de la energía necesaria para producir una lata nueva. ¡Reciclar es poder!"
        },
        {
          question: "¿Cuántos árboles se salvan al reciclar una tonelada de papel?",
          options: ["5 árboles", "10 árboles", "17 árboles", "25 árboles"],
          correct: 2,
          explanation: "Reciclar una tonelada de papel salva aproximadamente 17 árboles y ahorra 26,000 litros de agua."
        },
        {
          question: "¿Cuál es la mejor forma de reducir tu huella de carbono en el transporte?",
          options: ["Conducir más despacio", "Usar transporte público o bicicleta", "Cambiar de auto cada año", "Lavar el auto seguido"],
          correct: 1,
          explanation: "El transporte público, bicicleta o caminar reducen significativamente las emisiones de CO2 comparado con el uso individual del auto."
        }
      ]
    }
  };

  const startGame = (gameType) => {
    setSelectedGame(gameType);
    setCurrentQuestion(0);
    setScore(0);
    setGameCompleted(false);
    setUserAnswer('');
    setShowResult(false);
  };

  const handleQuizAnswer = (answerIndex) => {
    const currentGame = ecoGames[selectedGame];
    const question = currentGame.questions[currentQuestion];

    const isCorrect = answerIndex === question.correct;
    setIsCurrentAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < currentGame.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowResult(false);
        setIsCurrentAnswerCorrect(false);
      } else {
        setGameCompleted(true);
      }
    }, 2000);
  };


  const resetGame = () => {
    setSelectedGame(null);
    setCurrentQuestion(0);
    setScore(0);
    setGameCompleted(false);
    setUserAnswer('');
    setShowResult(false);
  };

  if (selectedGame && !gameCompleted) {
    const currentGame = ecoGames[selectedGame];
    const question = currentGame.questions[currentQuestion];
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentGame.title} {currentGame.icon}</span>
              <Button variant="outline" onClick={resetGame}>
                <X className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Pregunta {currentQuestion + 1} de {currentGame.questions.length}
                </span>
                <span className="text-sm font-medium text-green-600">
                  Puntuación: {score}/{currentGame.questions.length}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestion + 1) / currentGame.questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-medium mb-6">{question.question}</h3>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200"
                      disabled={showResult}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                
                {showResult && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    isCurrentAnswerCorrect
                      ? 'bg-green-100 border border-green-200'
                      : 'bg-red-100 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-center mb-2">
                      {isCurrentAnswerCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      ) : (
                        <X className="h-6 w-6 text-red-600 mr-2" />
                      )}
                      <span className="font-medium">
                        {isCurrentAnswerCorrect ? '¡Correcto!' : 'Incorrecto'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{question.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (gameCompleted) {
    const currentGame = ecoGames[selectedGame];
    const percentage = Math.round((score / currentGame.questions.length) * 100);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              ¡Juego Completado! {currentGame.icon}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="text-6xl">
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : percentage >= 40 ? '🥉' : '🌱'}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {percentage >= 80 ? '¡Excelente!' : percentage >= 60 ? '¡Muy bien!' : percentage >= 40 ? '¡Bien hecho!' : '¡Sigue practicando!'}
                </h3>
                <p className="text-lg text-gray-600">
                  Puntuación: {score}/{currentGame.questions.length} ({percentage}%)
                </p>
              </div>
              
              <div className="space-y-2">
                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700 mr-4">
                  Volver a juegos
                </Button>
                <Button onClick={() => startGame(selectedGame)} variant="outline">
                  Jugar de nuevo
                </Button>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  🌍 ¡Cada respuesta correcta es un paso hacia un planeta más verde!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Juegos Ecológicos 🌱</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(ecoGames).map(([gameType, game]) => (
              <div key={gameType} className="border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-3">{game.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-500">
                  {gameType === 'quiz1' && (
                    <div>
                      <p>• {game.questions.length} preguntas</p>
                      <p>• Impacto ambiental</p>
                      <p>• Oxígeno y biodiversidad</p>
                    </div>
                  )}
                  {gameType === 'quiz2' && (
                    <div>
                      <p>• {game.questions.length} preguntas</p>
                      <p>• Árboles del mundo</p>
                      <p>• Datos curiosos y récords</p>
                    </div>
                  )}
                  {gameType === 'quiz3' && (
                    <div>
                      <p>• {game.questions.length} preguntas</p>
                      <p>• Acciones ecológicas</p>
                      <p>• Reciclaje y ahorro</p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => startGame(gameType)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Jugar ahora
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">💡 ¿Sabías que...?</h4>
            <p className="text-blue-700 text-sm">
              Jugar estos juegos no solo es divertido, sino que también te ayuda a aprender sobre el cuidado del medio ambiente. 
              ¡Cada conocimiento cuenta para hacer la diferencia en nuestro planeta!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

  const CertificatesSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mis Certificados</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Certificado de Plantación</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><strong>Árbol:</strong> {cert.treeName}</p>
                    <p><strong>Ubicación:</strong> {cert.location}</p>
                    <p><strong>Fecha:</strong> {new Date(cert.date).toLocaleDateString()}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`/certificado/${cert.id}`, '_blank')}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Ver certificado
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aún no tienes certificados</p>
              <p className="text-sm text-gray-400">Los certificados se generan automáticamente cuando plantas un árbol</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );


  // Memoizar handlePlantComplete para evitar re-renders de PlantTreeWizard
  const handlePlantComplete = useCallback((newTree) => {
    // Actualizar la lista de árboles del usuario
    setUserTrees(prevTrees => [newTree, ...prevTrees]);
    // Navegar de vuelta a la sección de árboles
    navigate(`/usuario/${userId}/arboles`);
  }, [navigate, userId]);

  // Memoizar PlantarArbolSection para evitar re-creación
  const PlantarArbolSection = React.memo(() => {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <div className="mb-4">
          <Button
            onClick={() => navigate(`/usuario/${userId}/arboles-catalogo`)}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a mis árboles
          </Button>
        </div>
        <PlantTreeWizard onComplete={handlePlantComplete} />
      </div>
    );
  });

  const CollaborativeTreesSection = () => {
    const handleCreateProject = () => {
      setShowCreateWizard(true);
    };

    const handleExploreProjects = async () => {
      try {
        setLoadingCollaborative(true);
        const data = await collaborativeTreeService.getCollaborativeTrees({
          status: 'active',
          limit: 50
        });
        setAvailableProjects(data.collaborative_trees || []);
        setShowExploreProjectsModal(true);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        setAvailableProjects([]);
        setShowExploreProjectsModal(true);
      } finally {
        setLoadingCollaborative(false);
      }
    };

    const handleViewProject = (project) => {
      setSelectedProject(project);
      setShowProjectDetailModal(true);
    };

    const handleContribute = (project, amount, message) => {
      // Mock: simular contribución
      const newContribution = {
        id: Date.now(),
        collaborative_tree_id: project.id,
        amount: parseFloat(amount),
        percentage: (parseFloat(amount) / project.target_amount) * 100,
        message: message,
        contribution_date: new Date().toISOString(),
        collaborative_tree: {
          ...project,
          current_amount: project.current_amount + parseFloat(amount),
          total_contributors: project.total_contributors + 1
        }
      };

      setMyContributions([...myContributions, newContribution]);

      // Actualizar el proyecto en availableProjects
      const updatedProjects = availableProjects.map(p =>
        p.id === project.id
          ? { ...p, current_amount: p.current_amount + parseFloat(amount), total_contributors: p.total_contributors + 1 }
          : p
      );

      toast({
        title: "¡Contribución exitosa!",
        description: `Has contribuido $${parseFloat(amount).toLocaleString('es-AR')} al proyecto ${project.tree_name}`,
      });

      setShowProjectDetailModal(false);
      setSelectedProject(null);
    };

    const handleCreateNewProject = (projectData) => {
      // Mock: crear nuevo proyecto
      const newProject = {
        id: Date.now(),
        ...projectData,
        current_amount: 0,
        total_contributors: 0,
        status: 'active',
        creator_name: `${user?.first_name} ${user?.last_name}` || user?.email,
        created_at: new Date().toISOString()
      };

      setMyCollaborativeProjects([...myCollaborativeProjects, newProject]);

      toast({
        title: "¡Proyecto creado!",
        description: `Tu proyecto "${projectData.tree_name}" ha sido creado exitosamente`,
      });

      setShowCreateProjectModal(false);
    };

    return (
      <div className="flex flex-col gap-6">
        {showCreateWizard ? (
          // Mostrar wizard de creación
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="h-6 w-6 text-green-600" />
                  <span>Crear mi Árbol Colaborativo</span>
                </div>
                <Button
                  onClick={() => setShowCreateWizard(false)}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CreateCollaborativeTreeWizard
                onComplete={async (tree) => {
                  setShowCreateWizard(false);
                  // Recargar proyectos
                  try {
                    const data = await collaborativeTreeService.getMyProjects();
                    setMyCollaborativeProjects(data.my_projects || []);
                  } catch (error) {
                    console.error('Error al recargar proyectos:', error);
                  }
                }}
                onCancel={() => setShowCreateWizard(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Header compacto */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-purple-900">Árboles Colaborativos</h2>
              </div>
              <Button
                onClick={handleCreateProject}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={myCollaborativeProjects.length > 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                {myCollaborativeProjects.length > 0 ? 'Proyecto Creado' : 'Crear Proyecto'}
              </Button>
            </div>

            {/* Mapa de Proyectos Colaborativos */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Mapa de Proyectos</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span>{filteredCollaborativeTrees.length} {mapFilter === 'all' ? 'proyectos' : 'proyectos filtrados'}</span>
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMapFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      mapFilter === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setMapFilter('my_projects')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      mapFilter === 'my_projects'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Mis Proyectos
                  </button>
                  <button
                    onClick={() => setMapFilter('my_contributions')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      mapFilter === 'my_contributions'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Mis Contribuciones
                  </button>
                  <button
                    onClick={() => setMapFilter('active')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      mapFilter === 'active'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Activos
                  </button>
                  <button
                    onClick={() => setMapFilter('completed')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      mapFilter === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Completados
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingCollaborative ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Cargando mapa...</p>
                  </div>
                ) : allCollaborativeTrees.length > 0 ? (
                  <div className="h-[500px] rounded-lg overflow-hidden border border-purple-200">
                    <TreeMap
                      trees={filteredCollaborativeTrees}
                      height="100%"
                      center={[-31.4201, -64.1888]}
                      zoom={12}
                      onProjectClick={handleViewProject}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TreePine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay proyectos colaborativos activos</p>
                  </div>
                )}
              </CardContent>
            </Card>

        {/* Árboles Colaborativos en los que he Colaborado */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Mis Contribuciones</h3>
            </div>
          </CardHeader>
          <CardContent>
            {loadingCollaborative ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Cargando contribuciones...</p>
              </div>
            ) : myContributions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myContributions.map(contribution => {
                  const fundingPercentage = collaborativeTreeService.calculateFundingPercentage(
                    contribution.current_amount || 0,
                    contribution.target_amount || 24000
                  );
                  return (
                    <div
                      key={contribution.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleViewProject({ id: contribution.collaborative_tree_id, tree_name: contribution.tree_name })}
                    >
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {contribution.tree_name || 'Proyecto'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {contribution.tree_species || 'Especie no especificada'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Mi contribución</span>
                          <span className="font-semibold text-green-600">
                            {collaborativeTreeService.formatCurrency(contribution.amount || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Mi participación</span>
                          <span className="font-semibold text-blue-600">
                            {(parseFloat(contribution.percentage) || 0).toFixed(1)}%
                          </span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progreso total</span>
                            <span className="font-medium text-green-600">{fundingPercentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${fundingPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No has colaborado en ningún árbol aún</p>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}

        {/* Modal: Explorar Proyectos */}
        {showExploreProjectsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowExploreProjectsModal(false)}>
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-green-800">Proyectos Colaborativos Disponibles</h3>
                <button onClick={() => setShowExploreProjectsModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableProjects.map(project => {
                    const fundingPercentage = (parseFloat(project.current_amount) / parseFloat(project.target_amount)) * 100;
                    const isFullyFunded = fundingPercentage >= 100;
                    return (
                      <Card key={project.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <CardTitle className="text-lg">{project.tree_name}</CardTitle>
                              <p className="text-sm text-gray-500">{project.tree_species}</p>
                            </div>
                            {isFullyFunded && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                ✓ Completado
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progreso</span>
                              <span className="font-medium text-green-600">{fundingPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${fundingPercentage}%` }} />
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>${parseFloat(project.current_amount).toLocaleString('es-AR')}</span>
                              <span>de ${parseFloat(project.target_amount).toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t">
                              <Users className="h-4 w-4" />
                              <span>{project.total_contributors} contribuyentes</span>
                            </div>
                            <Button
                              onClick={() => {
                                setShowExploreProjectsModal(false);
                                handleViewProject(project);
                              }}
                              className={`w-full mt-4 ${isFullyFunded ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                              {isFullyFunded ? 'Ver detalles' : 'Contribuir'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Modal: Detalle de Proyecto y Contribuir */}
        {showProjectDetailModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowProjectDetailModal(false)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-green-800">{selectedProject.tree_name}</h3>
                  <p className="text-gray-600">{selectedProject.tree_species}</p>
                </div>
                <button onClick={() => setShowProjectDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Descripción</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedProject.description}</p>
                        {selectedProject.message && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-gray-700 italic">"{selectedProject.message}"</p>
                            <p className="text-sm text-gray-600 mt-2">- {selectedProject.creator_name}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Ubicación</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {selectedProject.city}, {selectedProject.country}
                        </p>
                        {selectedProject.latitude && selectedProject.longitude && (
                          <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                            <MapContainer
                              center={[parseFloat(selectedProject.latitude), parseFloat(selectedProject.longitude)]}
                              zoom={15}
                              style={{ height: '100%', width: '100%' }}
                              scrollWheelZoom={false}
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <Marker
                                position={[parseFloat(selectedProject.latitude), parseFloat(selectedProject.longitude)]}
                                icon={L.divIcon({
                                  className: 'custom-marker',
                                  html: `<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                      <path d="M2 17L12 22L22 17" />
                                      <path d="M2 12L12 17L22 12" />
                                    </svg>
                                  </div>`,
                                  iconSize: [30, 30],
                                  iconAnchor: [15, 15]
                                })}
                              />
                            </MapContainer>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card className="sticky top-24">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-2xl font-bold text-green-800">${parseFloat(selectedProject.current_amount).toLocaleString('es-AR')}</h4>
                            <p className="text-gray-600">de ${parseFloat(selectedProject.target_amount).toLocaleString('es-AR')}</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: `${(parseFloat(selectedProject.current_amount) / parseFloat(selectedProject.target_amount)) * 100}%` }} />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Progreso: {((parseFloat(selectedProject.current_amount) / parseFloat(selectedProject.target_amount)) * 100).toFixed(1)}%</span>
                            <span>{selectedProject.total_contributors} contribuyentes</span>
                          </div>
                          {(parseFloat(selectedProject.current_amount) / parseFloat(selectedProject.target_amount)) < 1 && (
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.target);
                              handleContribute(selectedProject, formData.get('amount'), formData.get('message'));
                            }}>
                              <div className="space-y-3 pt-4 border-t">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Monto a Contribuir (ARS)</label>
                                  <Input name="amount" type="number" required min="100" max={parseFloat(selectedProject.target_amount) - parseFloat(selectedProject.current_amount)} placeholder="1000" />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Máximo: ${(parseFloat(selectedProject.target_amount) - parseFloat(selectedProject.current_amount)).toLocaleString('es-AR')}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Mensaje (opcional)</label>
                                  <Textarea name="message" rows={2} placeholder="Deja un mensaje de apoyo..." />
                                </div>
                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                  Contribuir Ahora
                                </Button>
                              </div>
                            </form>
                          )}
                          {(selectedProject.current_amount / selectedProject.target_amount) >= 1 && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <p className="text-green-800 font-semibold">¡Proyecto completado!</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RewardsSection = () => {
    return (
      <div className="space-y-6">
        {/* Cupones ganados en sorteos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="h-6 w-6 text-purple-600" />
              <span>Mis Cupones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Percent className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">¿Cómo obtener cupones?</h3>
              <p className="text-gray-600 mb-4">
                Los cupones de descuento se obtienen participando en proyectos colaborativos de empresas.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg text-left mb-4">
                <h4 className="font-medium text-blue-800 mb-2">📊 Sistema de sorteo:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Cada $1 ARS aportado = 1 ticket para el sorteo</li>
                  <li>• Más aportas, más chances de ganar</li>
                  <li>• El sorteo se realiza cuando el proyecto llega al 100%</li>
                  <li>• Los cupones son de 10%, 20%, 30% o 50% de descuento</li>
                </ul>
              </div>
              <Button
                onClick={() => navigate(`/usuario/${user?.id}/colaborativos`)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Ver proyectos colaborativos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Componente principal
  return (
    <div className="max-w-full">
      <Routes>
            <Route path="/feed" element={<FeedSection />} />
            <Route path="/perfil" element={<ProfileSection 
    isEditingProfile={isEditingProfile}
    setIsEditingProfile={setIsEditingProfile}
    editedProfile={editedProfile}
    setEditedProfile={setEditedProfile}
    user={user}
    userProfile={userProfile}
    setUserProfile={setUserProfile}
    updateUser={updateUser}
    userTrees={userTrees}
    coverImage={coverImage}
    handleUploadPhoto={handleUploadPhoto}
    handlePasswordChange={handlePasswordChange}
    passwordData={passwordData}
    setPasswordData={setPasswordData}
    showPasswordChange={showPasswordChange}
    setShowPasswordChange={setShowPasswordChange}
    toast={toast}
  />} />
            <Route path="/arboles-catalogo" element={<ArbolesUnifiedSection />} />
            <Route path="/plantararbol" element={<PlantarArbolSection />} />
            <Route path="/arboles/:treeId" element={<TreeDetailsPage />} />
            <Route path="/colaborativos" element={<CollaborativeTreesSection />} />
            <Route path="/premios" element={<RewardsSection />} />
            <Route path="/notificaciones" element={<NotificationsSection />} />
            <Route path="/retos" element={<ChallengesSection />} />
            <Route path="/certificados" element={<CertificatesSection />} />
            <Route path="/" element={<Navigate to={`/usuario/${userId}/feed`} replace />} />
      </Routes>

      {/* Modal para crear post */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Crear nueva publicación</h3>
            <Textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="¿Qué quieres compartir sobre tu experiencia ecológica?"
              rows={4}
              className="mb-4"
            />
            <div className="flex justify-end items-center">
              <div className="space-x-2">
                <Button
                  onClick={() => setShowCreatePost(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreatePost}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para comentarios */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Agregar comentario</h3>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe tu comentario..."
              rows={3}
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowCommentModal(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitComment}
                className="bg-green-600 hover:bg-green-700"
              >
                Comentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del árbol */}
      <Modal
        isOpen={showTreeDetails && selectedTree}
        onClose={() => setShowTreeDetails(false)}
        maxWidth="max-w-4xl"
        headerContent={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <TreePine className="h-9 w-9" />
              <h2 className="text-3xl font-bold">{selectedTree?.name || 'Árbol'}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-base font-medium ${
                selectedTree?.status === 'plantado' || selectedTree?.status === 'verificado' ? 'bg-green-200 text-green-900' :
                selectedTree?.status === 'en_proceso' ? 'bg-blue-200 text-blue-900' :
                'bg-yellow-200 text-yellow-900'
              }`}>
                {selectedTree?.status === 'sin_plantar' && '⏳ Sin Plantar'}
                {selectedTree?.status === 'en_proceso' && '🌱 En Proceso'}
                {selectedTree?.status === 'plantado' && '🌳 Plantado'}
                {selectedTree?.status === 'verificado' && '✅ Verificado'}
                {selectedTree?.status === 'cancelado' && '❌ Cancelado'}
              </span>
            </div>
          </div>
        }
      >
        {selectedTree && (
          <div className="space-y-5">
              {/* Layout principal: Información + Mapa */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Columna izquierda: Información */}
                <div className="space-y-4">
                  {/* Grid de información compacta */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1.5">Ubicación</h3>
                      <p className="text-base text-gray-900">{selectedTree.country || 'No especificada'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1.5">Fecha de plantación</h3>
                      <p className="text-base text-gray-900">
                        {selectedTree.planted_at
                          ? new Date(selectedTree.planted_at).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'No disponible'}
                      </p>
                    </div>

                    {selectedTree.is_physical === true && selectedTree.physical_tree_status && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1.5">Estado</h3>
                        <p className="text-base text-gray-900 capitalize">
                          {selectedTree.physical_tree_status.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )}

                    {selectedTree.payment_amount && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1.5">Contribución</h3>
                        <p className="text-base text-gray-900 font-semibold">
                          ${parseFloat(selectedTree.payment_amount).toLocaleString('es-AR')} ARS
                        </p>
                      </div>
                    )}

                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-gray-500 mb-1.5">Coordenadas</h3>
                      <p className="text-base text-gray-900 font-mono">
                        {selectedTree.latitude && selectedTree.longitude
                          ? `${parseFloat(selectedTree.latitude).toFixed(6)}, ${parseFloat(selectedTree.longitude).toFixed(6)}`
                          : 'No disponibles'}
                      </p>
                    </div>
                  </div>

                  {/* Mensaje dedicado */}
                  {selectedTree.message && (
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Mensaje dedicado</h3>
                      <p className="text-base text-gray-900 italic">"{selectedTree.message}"</p>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">Información adicional</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">ID del árbol:</span>
                        <span className="ml-2 font-mono font-semibold">#{selectedTree.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Creado:</span>
                        <span className="ml-2">{new Date(selectedTree.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna derecha: Mapa */}
                {selectedTree.latitude && selectedTree.longitude && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Ubicación en el mapa</h3>
                    <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden border-2 border-green-200" style={{ zIndex: 1 }}>
                      <TreeMap trees={[selectedTree]} height="100%" />
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de seguimiento de plantación */}
              {selectedWorkOrder && (
                <div className="space-y-6 mt-6 pt-6 border-t-2 border-green-200">
                  <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Plantación</h2>

                  {/* Timeline de progreso */}
                  <TreeProgressTimeline
                    workOrderId={selectedWorkOrder.id}
                    initialHistory={allHistories[selectedWorkOrder.id] || null}
                    initialStatus={selectedWorkOrder.status}
                  />

                  {/* Grid: Mapa de tracking + Chat */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <TreeTrackingMap tree={selectedTree} workOrder={selectedWorkOrder} />
                    <TreeChat
                      workOrderId={selectedWorkOrder.id}
                      currentUserId={user?.id}
                      initialMessages={allMessages[selectedWorkOrder.id] || null}
                    />
                  </div>

                  {/* Sección de calificación (solo si está plantada) */}
                  {selectedWorkOrder.status === 'plantada' && selectedWorkOrder.planter_id && (
                    <PlanterRating
                      workOrderId={selectedWorkOrder.id}
                      planterId={selectedWorkOrder.planter_id}
                      isOwner={true}
                    />
                  )}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowTreeDetails(false)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    window.open(`/certificado/${selectedTree.id}`, '_blank');
                    setShowTreeDetails(false);
                  }}
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Award className="h-5 w-5 mr-2" />
                  Ver Certificado
                </Button>
              </div>
            </div>
        )}
      </Modal>

      {/* Modal de Seguimiento de Progreso */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setSelectedTreeForProgress(null);
          setSelectedWorkOrderForProgress(null);
        }}
        maxWidth="max-w-6xl"
        headerContent={
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Seguimiento de Plantación
              </h2>
              <p className="text-sm text-gray-600">
                {selectedTreeForProgress?.name || 'Árbol'} - {selectedTreeForProgress?.country || 'Ubicación'}
              </p>
            </div>
          </div>
        }
      >
        {selectedTreeForProgress && selectedWorkOrderForProgress && (
          <div className="space-y-6">
            {/* Timeline de Progreso */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Línea de Tiempo del Progreso
              </h3>
              <TreeProgressTimeline
                workOrderId={selectedWorkOrderForProgress.id}
                initialHistory={allHistories[selectedWorkOrderForProgress.id] || null}
                initialStatus={selectedWorkOrderForProgress.status}
              />
            </div>

            {/* Mapa y Chat lado a lado */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Mapa de Ubicación */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Ubicación del Árbol
                </h3>
                <TreeTrackingMap
                  tree={selectedTreeForProgress}
                  workOrder={selectedWorkOrderForProgress}
                />
              </div>

              {/* Chat de Comunicación */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  Comunicación
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <TreeChat
                    workOrderId={selectedWorkOrderForProgress.id}
                    currentUserId={user?.id}
                    initialMessages={allMessages[selectedWorkOrderForProgress.id] || null}
                  />
                </div>
              </div>
            </div>

            {/* Calificación del Plantador */}
            {selectedWorkOrderForProgress.status === 'plantada' && selectedWorkOrderForProgress.planter_id && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  Califica al Plantador
                </h3>
                <PlanterRating
                  workOrderId={selectedWorkOrderForProgress.id}
                  planterId={selectedWorkOrderForProgress.planter_id}
                  isOwner={true}
                />
              </div>
            )}

            {/* Información Adicional */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {getStatusConfig(selectedWorkOrderForProgress.status).emoji}{' '}
                    {getStatusConfig(selectedWorkOrderForProgress.status).label}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">ID de Orden:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    #{selectedWorkOrderForProgress.id}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Fecha de Creación:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {selectedWorkOrderForProgress.created_at
                      ? new Date(selectedWorkOrderForProgress.created_at).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Progreso:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {getStatusConfig(selectedWorkOrderForProgress.status).progress} de 9 pasos
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDashboard;