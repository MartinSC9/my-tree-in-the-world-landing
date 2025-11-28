import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Progress } from '@shared/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/components/ui/dialog';
import Navbar from '@shared/components/layout/Navbar';
import TreeMap from '@features/trees/components/TreeMap';
import { FaTree, FaUsers, FaMapMarkerAlt, FaCalendar, FaCheckCircle, FaHeart } from 'react-icons/fa';
import {
  getCollaborativeTreeById,
  getContributors,
  contributeToTree,
  formatCurrency,
  calculateFundingPercentage
} from '@features/collaborative-trees/services';
import { useAuth } from '@core/contexts/AuthContext';
import { useToast } from '@shared/components/ui/use-toast';

const CollaborativeTreeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributing, setContributing] = useState(false);

  // Form state for contribution
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionMessage, setContributionMessage] = useState('');

  useEffect(() => {
    loadProjectDetails();
    loadContributors();
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCollaborativeTreeById(id);
      setProject(data.collaborative_tree);
    } catch (err) {
      console.error('Error al cargar proyecto:', err);
      setError('No se pudo cargar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const loadContributors = async () => {
    try {
      const data = await getContributors(id);
      setContributors(data.contributors || []);
    } catch (err) {
      console.error('Error al cargar contribuyentes:', err);
    }
  };

  const handleContribute = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Monto inválido",
        description: "Por favor ingresa un monto válido",
        variant: "destructive"
      });
      return;
    }

    const remaining = parseFloat(project.target_amount) - parseFloat(project.current_amount);
    if (parseFloat(contributionAmount) > remaining) {
      toast({
        title: "Monto excede el objetivo",
        description: `El monto máximo que puedes contribuir es $${remaining.toLocaleString('es-AR')}`,
        variant: "destructive"
      });
      return;
    }

    try {
      setContributing(true);

      const response = await contributeToTree(id, {
        amount: parseFloat(contributionAmount),
        message: contributionMessage,
        payment_method: 'mercadopago'
      });

      toast({
        title: response.is_fully_funded ? "¡Proyecto completado!" : "¡Gracias por tu contribución!",
        description: response.is_fully_funded
          ? "El proyecto ha alcanzado su objetivo. El árbol será plantado pronto."
          : "Tu aporte ha sido registrado exitosamente",
        variant: "success"
      });

      // Recargar datos
      setShowContributeModal(false);
      setContributionAmount('');
      setContributionMessage('');
      loadProjectDetails();
      loadContributors();

    } catch (err) {
      console.error('Error al contribuir:', err);
      toast({
        title: "Error",
        description: err.error || "No se pudo procesar tu contribución",
        variant: "destructive"
      });
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 font-semibold text-lg">{error}</p>
              <Button
                onClick={() => navigate('/arboles-colaborativos')}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Volver a Proyectos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const fundingPercentage = calculateFundingPercentage(
    parseFloat(project.current_amount),
    parseFloat(project.target_amount)
  );
  const isFullyFunded = fundingPercentage >= 100;
  const remainingAmount = parseFloat(project.target_amount) - parseFloat(project.current_amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/arboles-colaborativos')}
              variant="outline"
              className="mb-4"
            >
              ← Volver a Proyectos
            </Button>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <FaTree className="text-white text-4xl" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-green-800">
                    {project.tree_name}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">{project.tree_species}</p>
                </div>
              </div>
              {isFullyFunded && (
                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  ✓ Completado
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {project.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-800">Descripción del Proyecto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Message */}
              {project.message && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <p className="text-gray-700 italic">"{project.message}"</p>
                    <p className="text-sm text-gray-600 mt-2">- {project.creator_name}</p>
                  </CardContent>
                </Card>
              )}

              {/* Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    {project.city ? `${project.city}, ` : ''}{project.country}
                  </p>
                  {project.location_type === 'public' && (
                    <div className="h-96 rounded-lg overflow-hidden">
                      <TreeMap
                        trees={[]}
                        center={[parseFloat(project.latitude), parseFloat(project.longitude)]}
                        zoom={14}
                        selectedLocation={[parseFloat(project.latitude), parseFloat(project.longitude)]}
                      />
                    </div>
                  )}
                  {project.location_type === 'private' && (
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
                      <p className="text-blue-700">
                        🔒 La ubicación exacta es privada
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <FaUsers />
                    Contribuyentes ({contributors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contributors.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                      Aún no hay contribuyentes. ¡Sé el primero en contribuir!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {contributors.map((contributor) => (
                        <div
                          key={contributor.id}
                          className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FaHeart className="text-red-500 text-sm" />
                              <p className="font-semibold text-gray-800">
                                {contributor.contributor_name}
                              </p>
                            </div>
                            {contributor.message && (
                              <p className="text-sm text-gray-600 italic mt-1">
                                "{contributor.message}"
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(contributor.contribution_date).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              {formatCurrency(contributor.amount)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {contributor.percentage.toFixed(1)}% del total
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Progress */}
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-1">
                      {formatCurrency(project.current_amount)}
                    </h3>
                    <p className="text-gray-600">
                      de {formatCurrency(project.target_amount)}
                    </p>
                  </div>

                  <Progress value={fundingPercentage} className="h-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progreso:</span>
                      <span className="font-semibold text-green-600">
                        {fundingPercentage.toFixed(1)}%
                      </span>
                    </div>
                    {!isFullyFunded && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Falta:</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(remainingAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contribuyentes:</span>
                      <span className="font-semibold">{contributors.length}</span>
                    </div>
                  </div>

                  {!isFullyFunded && (
                    <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-bold">
                          Contribuir Ahora
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contribuir al Proyecto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Monto a contribuir (ARS)
                            </label>
                            <Input
                              type="number"
                              min="1"
                              max={remainingAmount}
                              value={contributionAmount}
                              onChange={(e) => setContributionAmount(e.target.value)}
                              placeholder="Ej: 5000"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Máximo: {formatCurrency(remainingAmount)}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Mensaje (opcional)
                            </label>
                            <Textarea
                              value={contributionMessage}
                              onChange={(e) => setContributionMessage(e.target.value)}
                              placeholder="Deja un mensaje de apoyo..."
                              rows={3}
                            />
                          </div>

                          {contributionAmount && parseFloat(contributionAmount) > 0 && (
                            <div className="p-4 bg-green-50 rounded-lg">
                              <p className="text-sm text-green-800 font-medium">
                                Tu aporte representará el{' '}
                                {((parseFloat(contributionAmount) / parseFloat(project.current_amount + parseFloat(contributionAmount))) * 100).toFixed(1)}%
                                {' '}del total recaudado
                              </p>
                            </div>
                          )}

                          <Button
                            onClick={handleContribute}
                            disabled={contributing}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {contributing ? 'Procesando...' : 'Confirmar Contribución'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {isFullyFunded && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                      <FaCheckCircle className="text-green-600 text-3xl mx-auto mb-2" />
                      <p className="text-green-800 font-semibold">
                        ¡Proyecto completado!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        El árbol será plantado pronto
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-purple-600" />
                      <span>
                        Creado el {new Date(project.created_at).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-600" />
                      <span>Por {project.creator_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CollaborativeTreeDetailPage;
