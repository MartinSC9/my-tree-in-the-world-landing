import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share2, TreePine, Award, Calendar, MapPin } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import { toast } from '@shared/components/ui/use-toast';
import { useTree } from '@core/contexts/TreeContext';
import { userService } from '@shared/services/userService';
import CertificatePDF from '@features/certificates/components/CertificatePDF';

const CertificatePage = () => {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const { getTreeById } = useTree();
  const [tree, setTree] = useState(null);
  const [treeOwner, setTreeOwner] = useState(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const foundTree = await getTreeById(treeId);
        if (foundTree) {
          setTree(foundTree);
          // Obtener datos del usuario que plantó el árbol
          if (foundTree.user_id) {
            try {
              const owner = await userService.getUserById(foundTree.user_id);
              setTreeOwner(owner);
            } catch (err) {
              console.error('Error fetching tree owner:', err);
            }
          }
        } else {
          toast({
            title: "Árbol no encontrado",
            description: "El árbol que buscas no existe",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching tree:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el árbol",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    fetchTree();
  }, [treeId, getTreeById, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Mi Árbol: ${tree.name}`,
        text: `¡He plantado un árbol en ${tree.country}! Únete a la causa ambiental.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace del certificado se ha copiado al portapapeles",
      });
    }
  };

  if (!tree) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              ¡Felicitaciones!
            </h1>
            <p className="text-lg text-green-600">
              Has contribuido exitosamente al planeta
            </p>
          </div>

          <Card className="certificate-border p-2 shadow-2xl mb-6">
            <div className="bg-white rounded-lg p-6 md:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-6"
              >
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                  Certificado de Plantación
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto"></div>
              </motion.div>

              <div className="space-y-4 text-left max-w-2xl mx-auto">
                <p className="text-base text-green-700 text-center">
                  Por la presente se certifica que
                </p>

                <div className="text-center py-3">
                  <p className="text-2xl font-bold text-green-800">
                    {treeOwner?.first_name || treeOwner?.last_name
                      ? `${treeOwner.first_name || ''} ${treeOwner.last_name || ''}`.trim()
                      : 'Un usuario'}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <TreePine className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-green-600">Nombre del Árbol</div>
                        <div className="font-semibold text-green-800 text-sm">{tree.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-green-600">Ubicación</div>
                        <div className="font-semibold text-green-800 text-sm">{tree.country}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-green-600">Fecha de Plantación</div>
                        <div className="font-semibold text-green-800 text-sm">
                          {tree.planted_at ? new Date(tree.planted_at).toLocaleDateString('es-ES') : 'No disponible'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-green-600">Contribución</div>
                        <div className="font-semibold text-green-800 text-sm">$12.000 COP</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-green-700 text-sm">
                  ha plantado exitosamente un árbol que contribuye a la
                  conservación del medio ambiente y la lucha contra el cambio climático.
                </p>

                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Tu Impacto Ambiental</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xl font-bold">22kg</div>
                      <div className="text-xs">CO₂ absorbido/año</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">730</div>
                      <div className="text-xs">Litros O₂/día</div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-green-600 mb-3 text-sm">
                    Certificado ID: {tree.id}
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <img  alt="Logo Mi Árbol en el Mundo" className="h-10" src="https://images.unsplash.com/photo-1701593246649-12244687b73d" />
                    <div className="text-left">
                      <div className="font-bold text-green-800 text-sm">Mi Árbol en el Mundo</div>
                      <div className="text-xs text-green-600">Certificado Digital</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {tree && (
              <PDFDownloadLink
                document={<CertificatePDF tree={tree} treeOwner={treeOwner} />}
                fileName={`certificado-${tree.name?.replace(/\s+/g, '-') || 'arbol'}-${tree.id}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    disabled={loading}
                    className="nature-gradient text-white px-6 py-2"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Generando PDF...' : 'Descargar PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            )}

            <Button
              onClick={handleShare}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>

            <Button
              onClick={() => navigate('/mapa')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Ver en Mapa
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-6 p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg"
          >
            <h3 className="text-xl font-bold mb-2">¡Gracias por ayudar al planeta!</h3>
            <p className="text-green-100 max-w-2xl mx-auto text-sm">
              Tu contribución es parte de un movimiento global para crear un futuro más sostenible.
              Cada árbol cuenta y tu acción inspira a otros a seguir tu ejemplo.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificatePage;