import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { availableTreeService } from '../services';
import { Button } from '@shared/components/ui/button';
import AuthenticatedLayout from '@shared/components/layout/AuthenticatedLayout';
import PurchaseWizard from '@features/trees/components/PurchaseWizard';
import { toast } from '@shared/components/ui/use-toast';

const AvailableTreeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTree();
  }, [id]);

  const loadTree = async () => {
    try {
      setLoading(true);
      const data = await availableTreeService.getAvailableTreeById(id);
      setTree(data);
    } catch (error) {
      console.error('Error loading tree:', error);
      toast({
        title: "Error",
        description: "Error al cargar el árbol",
        variant: "destructive"
      });
      navigate('/catalogo');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseComplete = (result) => {
    // Navigate to user's trees after successful purchase
    navigate('/usuario/mis-arboles');
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded w-1/4" />
              <div className="h-96 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!tree) {
    return null;
  }

  const isOutOfStock = tree.stock_quantity === 0;

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/catalogo')}
            className="mb-6"
          >
            ← Volver al catálogo
          </Button>

          {/* Out of Stock Warning */}
          {isOutOfStock && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold text-center">
                😔 Este árbol está agotado. Vuelve pronto para ver más disponibles.
              </p>
            </div>
          )}

          {/* Purchase Wizard */}
          {!isOutOfStock ? (
            <PurchaseWizard
              tree={tree}
              onComplete={handlePurchaseComplete}
            />
          ) : (
            <div className="text-center py-12">
              <Button
                onClick={() => navigate('/catalogo')}
                className="bg-green-600 hover:bg-green-700"
              >
                Ver otros árboles disponibles
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AvailableTreeDetailPage;
