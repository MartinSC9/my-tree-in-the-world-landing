import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './modal.css';

/**
 * Modal reutilizable con animaciones y cierre automático al hacer clic fuera
 *
 * @param {boolean} isOpen - Estado de apertura del modal
 * @param {function} onClose - Función para cerrar el modal
 * @param {React.ReactNode} children - Contenido del modal
 * @param {string} title - Título del modal (opcional)
 * @param {React.ReactNode} headerContent - Contenido personalizado del header (opcional)
 * @param {string} maxWidth - Ancho máximo del modal (default: 'max-w-2xl')
 * @param {boolean} closeOnBackdropClick - Cerrar al hacer clic fuera (default: true)
 * @param {boolean} showCloseButton - Mostrar botón de cerrar (default: true)
 * @param {string} className - Clases adicionales para el contenedor del modal
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  headerContent,
  maxWidth = 'max-w-2xl',
  closeOnBackdropClick = true,
  showCloseButton = true,
  className = '',
}) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Manejar clic en el backdrop
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[1010] flex items-center justify-center p-4"
            onClick={handleBackdropClick}
            aria-hidden="true"
          >
            {/* Contenedor del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`bg-white rounded-lg ${maxWidth} w-full max-h-[90vh] overflow-y-auto shadow-2xl modal-scrollbar ${className}`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              {(title || headerContent || showCloseButton) && (
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-5 rounded-t-lg z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {headerContent || (
                        title && <h2 className="text-2xl font-bold">{title}</h2>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors ml-4 flex-shrink-0"
                        aria-label="Cerrar modal"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
