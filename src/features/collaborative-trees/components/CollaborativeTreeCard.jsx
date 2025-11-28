import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Progress } from '@shared/components/ui/progress';
import { FaTree, FaUsers, FaMapMarkerAlt, FaCalendar, FaGift, FaCertificate } from 'react-icons/fa';
import { formatCurrency, calculateFundingPercentage } from '@/utils';

const CollaborativeTreeCard = ({ project, onContribute, showActions = true }) => {
  const navigate = useNavigate();

  // Determinar tipo de creador
  const isUserProject = project.creator_type === 'user';
  const isCompanyProject = project.creator_type === 'company';

  // Calcular porcentaje de financiamiento
  const fundingPercentage = calculateFundingPercentage(
    parseFloat(project.current_amount),
    parseFloat(project.target_amount)
  );

  const isFullyFunded = fundingPercentage >= 100;
  const totalContributors = project.total_contributors || 0;

  // Obtener información del creador
  const creatorInfo = project.creator_info ?
    (typeof project.creator_info === 'string' ? JSON.parse(project.creator_info) : project.creator_info)
    : null;

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha desconocida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleViewDetails = () => {
    navigate(`/arboles-colaborativos/${project.id}`);
  };

  const handleContribute = () => {
    if (onContribute) {
      onContribute(project);
    } else {
      navigate(`/arboles-colaborativos/${project.id}`);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader className="pb-3">
        {/* Badge de tipo de creador */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isUserProject && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1">
                👤 Proyecto Personal
              </span>
            )}
            {isCompanyProject && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold flex items-center gap-1">
                🏢 Proyecto Empresarial
              </span>
            )}
          </div>
          {isFullyFunded && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              ✓ Completado
            </span>
          )}
        </div>

        {/* Título y especie */}
        <div className="flex items-start gap-2">
          <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
            <FaTree className="text-green-600 text-xl" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-green-800">
              {project.tree_name}
            </CardTitle>
            <p className="text-sm text-gray-600">{project.tree_species}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Descripción */}
        {project.description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Mensaje del creador */}
        {project.message && (
          <p className="text-sm text-gray-600 italic line-clamp-2">
            "{project.message}"
          </p>
        )}

        {/* Información de ubicación */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaMapMarkerAlt className="text-green-600" />
          <span>
            {project.city ? `${project.city}, ` : ''}{project.country || 'Ubicación no especificada'}
          </span>
        </div>

        {/* Información del creador */}
        {creatorInfo && (
          <div className="flex items-center gap-2 text-sm">
            {/* Avatar/Logo */}
            {(creatorInfo.avatar || creatorInfo.logo) ? (
              <img
                src={creatorInfo.avatar || creatorInfo.logo}
                alt={creatorInfo.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {creatorInfo.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">
                {isUserProject ? 'Creado por' : 'Empresa'}
              </p>
              <p className="font-semibold text-gray-700">{creatorInfo.name}</p>
            </div>
          </div>
        )}

        {/* Beneficios del proyecto */}
        {isCompanyProject && project.coupon_raffle_enabled && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaGift className="text-yellow-600 text-lg" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  🎁 Sorteo de cupones
                </p>
                <p className="text-xs text-yellow-700">
                  Participa al contribuir
                </p>
              </div>
            </div>
          </div>
        )}

        {isUserProject && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaCertificate className="text-blue-600 text-lg" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  📜 Certificado compartido
                </p>
                <p className="text-xs text-blue-700">
                  Todos los contribuidores incluidos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-green-800">
              {formatCurrency(project.current_amount)}
            </span>
            <span className="text-gray-600">
              de {formatCurrency(project.target_amount)}
            </span>
          </div>
          <Progress value={fundingPercentage} className="h-3" />
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span className="font-medium">{fundingPercentage.toFixed(1)}% completado</span>
            {!isFullyFunded && (
              <span>
                Faltan {formatCurrency(project.target_amount - project.current_amount)}
              </span>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaUsers className="text-blue-600" />
            <span>
              {totalContributors} {totalContributors === 1 ? 'contribuyente' : 'contribuyentes'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendar className="text-purple-600" />
            <span>{formatDate(project.created_at)}</span>
          </div>
        </div>

        {/* Acciones */}
        {showActions && (
          <div className="flex gap-2 mt-auto pt-4">
            <Button
              onClick={handleViewDetails}
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
            >
              Ver detalles
            </Button>
            {!isFullyFunded && (
              <Button
                onClick={handleContribute}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Contribuir
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollaborativeTreeCard;
