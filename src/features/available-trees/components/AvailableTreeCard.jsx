import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';

const AvailableTreeCard = ({ tree }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/catalogo/${tree.id}`);
  };

  const isOutOfStock = tree.stock_quantity === 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {tree.image_url ? (
          <img
            src={tree.image_url}
            alt={tree.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🌳</span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <Badge variant="destructive">Agotado</Badge>
          ) : tree.stock_quantity < 10 ? (
            <Badge variant="warning" className="bg-yellow-500 text-white">
              Últimas {tree.stock_quantity} unidades
            </Badge>
          ) : (
            <Badge variant="default" className="bg-green-600 text-white">
              En stock
            </Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{tree.name}</CardTitle>
        {tree.scientific_name && (
          <p className="text-sm text-gray-500 italic line-clamp-1">
            {tree.scientific_name}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {/* Species */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Especie:</span>
            <Badge variant="outline">{tree.species}</Badge>
          </div>

          {/* Description */}
          {tree.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {tree.description}
            </p>
          )}

          {/* Nursery Info */}
          {tree.nursery_name && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>🌱</span>
              <span>{tree.nursery_name}</span>
            </div>
          )}

          {/* Location */}
          {tree.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>📍</span>
              <span className="line-clamp-1">{tree.location}</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Precio:</span>
              <span className="text-2xl font-bold text-green-600">
                ${parseFloat(tree.price || 0).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 text-right">USD por árbol</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleViewDetails}
        >
          Ver Detalles
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={handleViewDetails}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Agotado' : 'Comprar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvailableTreeCard;
