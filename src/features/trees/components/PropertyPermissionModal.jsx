import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@shared/components/ui/dialog';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@shared/components/ui/alert';
import { Mail, Phone, Key, Loader2, Send, CheckCircle, Info } from 'lucide-react';
import locationService from '@shared/services/locationService';
import { toast } from '@shared/components/ui/use-toast';

const PropertyPermissionModal = ({ open, onClose, location, address, onPermissionGranted }) => {
  const [step, setStep] = useState(1); // 1: solicitar, 2: validar código
  const [loading, setLoading] = useState(false);

  // Step 1: Solicitar permiso
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [permissionId, setPermissionId] = useState(null);

  // Step 2: Validar código
  const [permissionCode, setPermissionCode] = useState('');

  const handleRequestPermission = async () => {
    // Validaciones
    if (!ownerEmail.trim() && !ownerPhone.trim()) {
      toast({
        title: 'Datos requeridos',
        description: 'Debes proporcionar al menos el email o teléfono del propietario',
        variant: 'destructive'
      });
      return;
    }

    if (ownerEmail && !isValidEmail(ownerEmail)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor ingresa un email válido',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await locationService.requestLocationPermission({
        property_owner_email: ownerEmail.trim() || null,
        property_owner_phone: ownerPhone.trim() || null,
        latitude: location.lat,
        longitude: location.lng,
        address: address || null
      });

      setPermissionId(response.permission.id);
      setStep(2);

      toast({
        title: 'Solicitud enviada',
        description: 'El propietario recibirá un código de autorización'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'No se pudo enviar la solicitud',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCode = async () => {
    if (!permissionCode.trim() || permissionCode.length !== 6) {
      toast({
        title: 'Código inválido',
        description: 'El código debe tener 6 dígitos',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await locationService.validatePermissionCode(
        permissionCode.trim(),
        location.lat,
        location.lng
      );

      toast({
        title: 'Código válido',
        description: 'Permiso concedido. Ahora puedes continuar con la plantación'
      });

      // Pasar datos de permiso al padre
      if (onPermissionGranted) {
        onPermissionGranted(response.permission);
      }

      handleClose();
    } catch (error) {
      toast({
        title: 'Código inválido',
        description: error.response?.data?.error || 'El código es inválido o ha expirado',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOwnerEmail('');
    setOwnerPhone('');
    setPermissionCode('');
    setPermissionId(null);
    onClose();
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-orange-600" />
            Permiso de Propiedad Ajena
          </DialogTitle>
          <DialogDescription>
            Esta ubicación no es un espacio público ni tu domicilio registrado. Necesitas autorización del propietario.
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          // STEP 1: Solicitar permiso
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>¿Cómo funciona?</AlertTitle>
              <AlertDescription>
                <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
                  <li>Ingresas el email o teléfono del propietario</li>
                  <li>Le enviamos un código de 6 dígitos</li>
                  <li>El propietario te comparte el código</li>
                  <li>Ingresas el código aquí para continuar</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="owner-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email del Propietario
                </Label>
                <Input
                  id="owner-email"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="propietario@example.com"
                  disabled={loading}
                />
              </div>

              <div className="text-center text-sm text-gray-500">
                - o -
              </div>

              <div>
                <Label htmlFor="owner-phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono del Propietario (Opcional)
                </Label>
                <Input
                  id="owner-phone"
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  También recibirá el código por SMS si proporcionas su teléfono
                </p>
              </div>

              {address && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm text-blue-800">
                    <strong>Dirección:</strong> {address}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleRequestPermission} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Solicitar Permiso
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // STEP 2: Validar código
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Solicitud enviada</AlertTitle>
              <AlertDescription className="text-green-700">
                El propietario recibirá un código de 6 dígitos por email
                {ownerPhone && ' y SMS'}.
                <br />
                Ingresa el código que te compartió:
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="permission-code" className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4" />
                Código de Autorización
              </Label>
              <Input
                id="permission-code"
                value={permissionCode}
                onChange={(e) => {
                  // Solo números, máximo 6 dígitos
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPermissionCode(value);
                }}
                placeholder="123456"
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                ⏰ El código expira en 24 horas
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Contacta al propietario para que te comparta el código que recibió
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Volver
              </Button>
              <Button
                onClick={handleValidateCode}
                disabled={loading || permissionCode.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Validar Código
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyPermissionModal;
