import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@shared/components/ui/dialog';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Textarea } from '@shared/components/ui/textarea';
import { Progress } from '@shared/components/ui/progress';
import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { contributeToTree } from '@features/collaborative-trees/services';
import { formatCurrency, calculateFundingPercentage, calculateRemainingAmount } from '@/utils';
import { FaTree, FaHeart, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ContributeModal = ({ project, isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const currentAmount = parseFloat(project.current_amount) || 0;
  const targetAmount = parseFloat(project.target_amount) || 0;
  const remainingAmount = calculateRemainingAmount(currentAmount, targetAmount);
  const fundingPercentage = calculateFundingPercentage(currentAmount, targetAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const contributionAmount = parseFloat(amount);

    // Validaciones
    if (!contributionAmount || contributionAmount <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    if (contributionAmount > remainingAmount) {
      setError(`El monto no puede exceder el faltante de ${formatCurrency(remainingAmount)}`);
      return;
    }

    if (contributionAmount < 100) {
      setError('El monto mínimo de contribución es $100');
      return;
    }

    try {
      setLoading(true);

      const contributionData = {
        amount: contributionAmount,
        message: message.trim() || null,
        payment_method: paymentMethod
      };

      const response = await contributeToTree(project.id, contributionData);

      setSuccess(true);

      // Esperar 2 segundos antes de cerrar para mostrar el mensaje de éxito
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(response);
        }
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error al contribuir:', err);
      setError(err.error || 'Error al procesar la contribución. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setMessage('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-800">
            <FaHeart className="text-red-500" />
            Contribuir al Proyecto
          </DialogTitle>
          <DialogDescription>
            Ayuda a plantar "{project.tree_name}" en {project.city || project.country}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              ¡Contribución exitosa!
            </h3>
            <p className="text-gray-600">
              Gracias por tu aporte. Juntos estamos haciendo la diferencia.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Progreso actual */}
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-green-800">
                  {formatCurrency(currentAmount)}
                </span>
                <span className="text-gray-600">
                  de {formatCurrency(targetAmount)}
                </span>
              </div>
              <Progress value={fundingPercentage} className="h-2" />
              <p className="text-xs text-gray-600 text-center">
                {fundingPercentage.toFixed(1)}% completado • Faltan {formatCurrency(remainingAmount)}
              </p>
            </div>

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <FaExclamationTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Monto a contribuir <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="pl-7"
                  min="100"
                  max={remainingAmount}
                  step="100"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500">
                Monto mínimo: $100 • Máximo: {formatCurrency(remainingAmount)}
              </p>

              {/* Montos rápidos */}
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.filter(qa => qa <= remainingAmount).map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    disabled={loading}
                    className="text-xs"
                  >
                    {formatCurrency(quickAmount)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mensaje opcional */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Mensaje (opcional)
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje de apoyo..."
                rows={3}
                maxLength={500}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                {message.length}/500 caracteres
              </p>
            </div>

            {/* Método de pago */}
            <div className="space-y-2">
              <Label htmlFor="payment-method">
                Método de pago
              </Label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              >
                <option value="mercadopago">MercadoPago</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            {/* Información */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">ℹ️ Información importante:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Tu contribución ayudará a plantar este árbol</li>
                <li>Recibirás notificaciones sobre el progreso</li>
                <li>Obtendrás un certificado al completarse el proyecto</li>
              </ul>
            </div>

            {/* Botones */}
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaHeart className="mr-2" />
                    Contribuir {amount && `${formatCurrency(parseFloat(amount))}`}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContributeModal;
