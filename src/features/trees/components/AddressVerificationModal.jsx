import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { toast } from '@shared/components/ui/use-toast';
import addressVerificationService from '@shared/services/addressVerificationService';

const AddressVerificationModal = ({ open, onClose, treeId, treeLocation, onVerificationSubmitted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!open) return null;

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor sube una imagen JPG, PNG o HEIC",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo debe ser menor a 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "Documento requerido",
        description: "Por favor sube una foto de tu documento",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('tree_id', treeId);
      formData.append('latitude', treeLocation.lat);
      formData.append('longitude', treeLocation.lng);

      // Call backend service
      const data = await addressVerificationService.uploadDocument(formData);

      toast({
        title: "Documento enviado exitosamente",
        description: data.auto_verified
          ? "✅ Dirección verificada automáticamente"
          : "Tu documento está en revisión. Te notificaremos cuando sea verificado (1-2 horas)",
      });

      if (onVerificationSubmitted) {
        onVerificationSubmitted(data);
      }

      onClose();

    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error al subir documento",
        description: "Por favor intenta nuevamente",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Recordatorio",
      description: "Recuerda verificar tu domicilio en los próximos 7 días para completar tu árbol",
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <FileText className="h-7 w-7" />
                  Verificación de Domicilio
                </h2>
                <p className="text-blue-100 text-sm">
                  Sube una foto de tu documento para verificar tu dirección
                </p>
              </div>
              <button
                onClick={handleSkip}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">
                    ¿Por qué necesitamos esto?
                  </p>
                  <p className="text-blue-700">
                    Para plantar árboles en domicilios particulares, necesitamos verificar que la ubicación seleccionada coincida con tu dirección registrada. Esto garantiza la legitimidad del proceso.
                  </p>
                </div>
              </div>
            </div>

            {/* Accepted Documents */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Documentos aceptados
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>DNI o Cédula de identidad (frente y dorso si la dirección está atrás)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Pasaporte con comprobante de domicilio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Licencia de conducir con dirección visible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Servicio público (luz, agua, gas) reciente</span>
                </li>
              </ul>
            </div>

            {/* Upload Area */}
            <div>
              <label className="block font-semibold text-gray-900 mb-3">
                Subir foto del documento
              </label>

              {!previewUrl ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Arrastra tu foto aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    JPG, PNG o HEIC - Máximo 10MB
                  </p>
                  <input
                    type="file"
                    id="document-upload"
                    accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="document-upload"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors"
                  >
                    <Upload className="h-5 w-5" />
                    Seleccionar archivo
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Foto cargada correctamente</p>
                      <p className="text-green-700">Asegúrate de que la dirección sea legible</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
              <p className="font-semibold text-gray-900 mb-1">🔒 Privacidad y Seguridad</p>
              <p>
                Tu documento se encripta y se usa ÚNICAMENTE para verificar tu dirección. No compartimos esta información con terceros. Puedes tapar datos sensibles que no sean necesarios (ej: número de documento).
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl flex flex-col sm:flex-row gap-3 border-t">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 border-2"
            >
              Lo haré después
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>Subiendo...</>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Verificar ahora
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressVerificationModal;
