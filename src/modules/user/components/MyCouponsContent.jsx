import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { useToast } from '@shared/components/ui/use-toast';
import { Ticket, Copy, Check, Calendar, AlertCircle, Gift, TrendingUp } from 'lucide-react';
import raffleService from '@/services/raffleService';

const MyCouponsContent = () => {
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [expiredCoupons, setExpiredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await raffleService.getMyCoupons();
      setActiveCoupons(data.active_coupons || []);
      setExpiredCoupons(data.expired_coupons || []);
    } catch (error) {
      console.error('Error cargando cupones:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus cupones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Código copiado",
      description: `El código ${code} se copió al portapapeles`,
    });

    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const CouponCard = ({ coupon, isActive }) => (
    <Card className={`border-2 ${isActive ? 'border-green-300 bg-gradient-to-br from-green-50 to-white' : 'border-gray-200 bg-gray-50 opacity-75'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-800">{coupon.project.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{coupon.company.name}</p>
          </div>
          {coupon.company.logo && (
            <img
              src={coupon.company.logo}
              alt={coupon.company.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Discount Badge */}
          <div className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <div className="text-center text-white">
              <Gift className="h-8 w-8 mx-auto mb-2" />
              <p className="text-4xl font-bold">{coupon.discount.display}</p>
              <p className="text-sm opacity-90 mt-1">de descuento</p>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-xs text-gray-600 mb-2">Código de cupón</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-lg font-mono font-bold text-purple-600 flex-1">
                {coupon.coupon_code}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyCouponCode(coupon.coupon_code)}
                className="shrink-0"
              >
                {copiedCode === coupon.coupon_code ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            {/* Expiry */}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {isActive ? (
                  <>
                    Válido hasta: <strong>{formatDate(coupon.expires_at)}</strong>
                    {coupon.days_until_expiry <= 7 && (
                      <Badge variant="destructive" className="ml-2">
                        {coupon.days_until_expiry} días restantes
                      </Badge>
                    )}
                  </>
                ) : coupon.redeemed_at ? (
                  <>Canjeado el {formatDate(coupon.redeemed_at)}</>
                ) : (
                  <>Expiró el {formatDate(coupon.expires_at)}</>
                )}
              </span>
            </div>

            {/* Min Purchase */}
            {coupon.min_purchase_amount && (
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>
                  Compra mínima: <strong>${coupon.min_purchase_amount.toLocaleString()}</strong>
                </span>
              </div>
            )}

            {/* Applicable Products */}
            {coupon.applicable_products && (
              <div className="flex items-start gap-2 text-gray-600">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span className="text-xs">{coupon.applicable_products}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          {!isActive && (
            <div className="pt-2">
              {coupon.redeemed_at ? (
                <Badge variant="success" className="w-full justify-center">
                  ✓ Cupón Utilizado
                </Badge>
              ) : (
                <Badge variant="secondary" className="w-full justify-center">
                  Expirado
                </Badge>
              )}
            </div>
          )}

          {/* Won Date */}
          <p className="text-xs text-gray-500 text-center pt-2 border-t">
            Ganado el {formatDate(coupon.won_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Ticket className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando tus cupones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-800">Mis Cupones</h1>
        <p className="text-gray-600 mt-1">Cupones ganados en sorteos de proyectos colaborativos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Cupones Activos</p>
                <p className="text-4xl font-bold mt-1">{activeCoupons.length}</p>
              </div>
              <Ticket className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm">Cupones Usados/Expirados</p>
                <p className="text-4xl font-bold mt-1">{expiredCoupons.length}</p>
              </div>
              <Ticket className="h-12 w-12 text-gray-200 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Coupons */}
      {activeCoupons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Cupones Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} isActive={true} />
            ))}
          </div>
        </div>
      )}

      {/* Expired Coupons */}
      {expiredCoupons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Historial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiredCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} isActive={false} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeCoupons.length === 0 && expiredCoupons.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes cupones aún
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Participa en proyectos colaborativos de empresas para tener la oportunidad de ganar cupones de descuento en sorteos
            </p>
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700">
              <Gift className="h-4 w-4 mr-2" />
              Explorar Proyectos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      {(activeCoupons.length > 0 || expiredCoupons.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">¿Cómo usar tus cupones?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p>1. <strong>Copia el código</strong> del cupón que quieras usar</p>
            <p>2. <strong>Visita la tienda</strong> de la empresa que lo emitió</p>
            <p>3. <strong>Aplica el código</strong> al momento de pagar</p>
            <p>4. <strong>Verifica los requisitos:</strong> compra mínima, productos aplicables, fecha de vencimiento</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyCouponsContent;
