import React, { useState, useEffect } from 'react';
import api from '@core/config/api';
import { Star, Send, CheckCircle } from 'lucide-react';

const PlanterRating = ({ workOrderId, planterId, isOwner = false }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingRating, setExistingRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [planterStats, setPlanterStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener calificación existente si hay
        const ratingRes = await api.get(`/ratings/work-order/${workOrderId}`);

        if (ratingRes.data.rating) {
          setExistingRating(ratingRes.data.rating);
          setRating(ratingRes.data.rating.rating);
          setComment(ratingRes.data.rating.comment || '');
        }

        // Obtener stats del plantador
        if (planterId) {
          const statsRes = await api.get(`/ratings/planter/${planterId}/average`);
          setPlanterStats(statsRes.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar calificación:', err);
        setLoading(false);
      }
    };

    if (workOrderId) {
      fetchData();
    }
  }, [workOrderId, planterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/ratings/work-order/${workOrderId}`, { rating, comment });

      setSuccess(true);
      setSubmitting(false);

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error al enviar calificación:', err);
      alert(err.response?.data?.error || 'Error al enviar calificación');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* Estadísticas del Plantador */}
      {planterStats && planterStats.total_ratings > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">Calificaciones del Plantador</h4>

          <div className="flex items-center space-x-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">
                {parseFloat(planterStats.average_rating).toFixed(1)}
              </div>
              <div className="flex items-center justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(planterStats.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = planterStats[`${['one', 'two', 'three', 'four', 'five'][stars - 1]}_star`] || 0;
                const percentage = (count / planterStats.total_ratings) * 100;

                return (
                  <div key={stars} className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600 w-8">{stars} ⭐</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-sm text-green-700">
            Basado en <span className="font-semibold">{planterStats.total_ratings}</span> calificaciones
          </p>
        </div>
      )}

      {/* Formulario de Calificación */}
      {isOwner ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {existingRating ? 'Tu Calificación' : 'Califica el Trabajo del Plantador'}
            </label>

            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {rating} de 5 estrellas
                </span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (Opcional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Cuéntanos sobre tu experiencia con este plantador..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>{existingRating ? 'Actualizar Calificación' : 'Enviar Calificación'}</span>
              </>
            )}
          </button>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Calificación guardada exitosamente
              </span>
            </div>
          )}
        </form>
      ) : (
        existingRating && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= existingRating.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-gray-700">
                {existingRating.rating} de 5
              </span>
            </div>

            {existingRating.comment && (
              <p className="text-sm text-gray-600 mt-2">{existingRating.comment}</p>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Calificado el {new Date(existingRating.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default PlanterRating;
