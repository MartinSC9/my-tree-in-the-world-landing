import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, TreePine, Award, Calendar, MapPin, Clock } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@shared/components/ui/button';
import { toast } from '@shared/components/ui/use-toast';
import { useTree } from '@core/contexts/TreeContext';
import { useTheme } from '@core/contexts/ThemeContext';
import CertificatePDF from '@features/certificates/components/CertificatePDF';

const CertificatePage = () => {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const { getTreeById } = useTree();
  const { isDark } = useTheme();
  const [tree, setTree] = useState(null);
  const [treeOwner, setTreeOwner] = useState(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const foundTree = await getTreeById(treeId);
        if (foundTree) {
          setTree(foundTree);
          // El owner ya viene incluido en la respuesta del árbol
          if (foundTree.owner) {
            setTreeOwner(foundTree.owner);
          }
        } else {
          toast({
            title: 'Árbol no encontrado',
            description: 'El árbol que buscas no existe',
            variant: 'destructive',
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching tree:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el árbol',
          variant: 'destructive',
        });
        navigate('/');
      }
    };

    fetchTree();
  }, [treeId, getTreeById, navigate]);

  if (!tree) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Cargando certificado...
          </span>
        </div>
      </div>
    );
  }

  const isPlanted = tree.status === 'plantado' || tree.status === 'verificado';

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDark
          ? 'bg-gray-900'
          : isPlanted
            ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50'
            : 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100'
      }`}
    >
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Certificado */}
          <div
            className={`relative rounded-xl border-4 overflow-hidden shadow-2xl mb-5 ${
              isPlanted
                ? isDark
                  ? 'bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-orange-900/40 border-amber-600'
                  : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-400'
                : isDark
                  ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-700 border-gray-600'
                  : 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 border-gray-300'
            }`}
          >
            {/* Decorative corners */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${
                isPlanted
                  ? isDark
                    ? 'from-amber-700/30'
                    : 'from-amber-200/50'
                  : isDark
                    ? 'from-gray-600/30'
                    : 'from-gray-200/50'
              } to-transparent`}
            />
            <div
              className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${
                isPlanted
                  ? isDark
                    ? 'from-amber-700/30'
                    : 'from-amber-200/50'
                  : isDark
                    ? 'from-gray-600/30'
                    : 'from-gray-200/50'
              } to-transparent`}
            />

            {/* Certificate number badge */}
            <div
              className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-full ${
                isPlanted ? 'bg-amber-600' : 'bg-gray-500'
              }`}
            >
              #{tree.id}
            </div>

            {/* Status badge */}
            <div
              className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
                isPlanted
                  ? isDark
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-green-100 text-green-700'
                  : isDark
                    ? 'bg-orange-900/50 text-orange-400'
                    : 'bg-orange-100 text-orange-700'
              }`}
            >
              {isPlanted ? '✓ Plantado' : '⏳ Pendiente'}
            </div>

            <div className="relative p-8 pt-14">
              {/* Certificate icon */}
              <div className="flex justify-center mb-4">
                <div
                  className={`p-4 rounded-full shadow-lg ${
                    isPlanted
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}
                >
                  <Award className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1
                className={`text-center text-2xl md:text-3xl font-bold mb-3 ${
                  isPlanted
                    ? isDark
                      ? 'text-amber-400'
                      : 'text-amber-800'
                    : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                {isPlanted ? 'Certificado de Plantación' : 'Certificado Pendiente'}
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-5">
                <div
                  className={`flex-1 h-px bg-gradient-to-r from-transparent ${
                    isPlanted
                      ? isDark
                        ? 'via-amber-600'
                        : 'via-amber-300'
                      : isDark
                        ? 'via-gray-600'
                        : 'via-gray-300'
                  } to-transparent`}
                />
                <TreePine
                  className={`h-5 w-5 ${
                    isPlanted
                      ? isDark
                        ? 'text-green-400'
                        : 'text-green-600'
                      : isDark
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  }`}
                />
                <div
                  className={`flex-1 h-px bg-gradient-to-r from-transparent ${
                    isPlanted
                      ? isDark
                        ? 'via-amber-600'
                        : 'via-amber-300'
                      : isDark
                        ? 'via-gray-600'
                        : 'via-gray-300'
                  } to-transparent`}
                />
              </div>

              {/* Certification text */}
              <div className="text-center mb-6">
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Por la presente se certifica que
                </p>
                <p
                  className={`text-2xl font-bold mb-2 ${
                    isPlanted
                      ? isDark
                        ? 'text-amber-300'
                        : 'text-amber-700'
                      : isDark
                        ? 'text-white'
                        : 'text-gray-800'
                  }`}
                >
                  {treeOwner?.first_name || treeOwner?.last_name
                    ? `${treeOwner.first_name || ''} ${treeOwner.last_name || ''}`.trim()
                    : 'Un usuario'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isPlanted
                    ? 'ha plantado exitosamente un árbol que contribuye a la conservación del medio ambiente.'
                    : 'ha adoptado un árbol que será plantado próximamente y contribuirá a la conservación del medio ambiente.'}
                </p>
              </div>

              {/* Tree details */}
              <div
                className={`rounded-xl p-5 mb-6 ${
                  isPlanted
                    ? isDark
                      ? 'bg-amber-900/30 border border-amber-700'
                      : 'bg-amber-100/50 border border-amber-200'
                    : isDark
                      ? 'bg-gray-700/50 border border-gray-600'
                      : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}
                    >
                      <TreePine
                        className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`}
                      />
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Árbol
                      </div>
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {tree.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                      <MapPin className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isPlanted ? 'Ubicación' : 'Destino'}
                      </div>
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {tree.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}
                    >
                      <Calendar
                        className={`h-4 w-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                      />
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Adopción
                      </div>
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {new Date(tree.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isPlanted
                          ? isDark
                            ? 'bg-green-900/50'
                            : 'bg-green-100'
                          : isDark
                            ? 'bg-orange-900/50'
                            : 'bg-orange-100'
                      }`}
                    >
                      <Clock
                        className={`h-4 w-4 ${
                          isPlanted
                            ? isDark
                              ? 'text-green-400'
                              : 'text-green-600'
                            : isDark
                              ? 'text-orange-400'
                              : 'text-orange-600'
                        }`}
                      />
                    </div>
                    <div>
                      <div
                        className={`text-xs ${
                          isPlanted
                            ? isDark
                              ? 'text-gray-400'
                              : 'text-gray-500'
                            : isDark
                              ? 'text-orange-400'
                              : 'text-orange-500'
                        }`}
                      >
                        Plantación
                      </div>
                      <div
                        className={`font-semibold ${
                          isPlanted
                            ? isDark
                              ? 'text-white'
                              : 'text-gray-800'
                            : isDark
                              ? 'text-orange-400'
                              : 'text-orange-600'
                        }`}
                      >
                        {isPlanted && tree.planted_at
                          ? new Date(tree.planted_at).toLocaleDateString('es-AR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'En espera'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental impact */}
              <div
                className={`flex items-center justify-center gap-8 px-6 py-4 rounded-xl text-white ${
                  isPlanted
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">22kg</div>
                  <div className="text-xs opacity-90">CO₂/año</div>
                </div>
                <div className={`w-px h-10 ${isPlanted ? 'bg-amber-300/30' : 'bg-gray-400/30'}`} />
                <div className="text-center">
                  <div className="text-2xl font-bold">730</div>
                  <div className="text-xs opacity-90">L O₂/día</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-dashed border-gray-300/50">
                <TreePine
                  className={`h-6 w-6 ${
                    isPlanted
                      ? isDark
                        ? 'text-green-400'
                        : 'text-green-600'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-gray-500'
                  }`}
                />
                <div className="text-center">
                  <div
                    className={`font-bold text-sm ${
                      isPlanted
                        ? isDark
                          ? 'text-amber-300'
                          : 'text-amber-800'
                        : isDark
                          ? 'text-gray-300'
                          : 'text-gray-700'
                    }`}
                  >
                    Mi Árbol en el Mundo
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Certificado Digital
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {isPlanted ? (
              <PDFDownloadLink
                document={<CertificatePDF tree={tree} treeOwner={treeOwner} />}
                fileName={`certificado-${tree.name?.replace(/\s+/g, '-') || 'arbol'}-${tree.id}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Generando...' : 'Descargar PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <span
                className={`text-sm px-4 py-2 rounded-lg ${
                  isDark ? 'text-orange-400 bg-orange-900/30' : 'text-orange-600 bg-orange-50'
                }`}
              >
                Descarga disponible cuando se plante
              </span>
            )}

            <Button
              onClick={() => navigate(`/mapa/${tree.id}`)}
              variant="outline"
              className={
                isDark
                  ? 'border-blue-500 text-blue-400 hover:bg-blue-900/30'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }
            >
              <MapPin className="h-4 w-4 mr-2" />
              Ver en Mapa
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificatePage;
