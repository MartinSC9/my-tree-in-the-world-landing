import api from '@core/config/api';

const API_BASE = '/api/address-verification';

export const addressVerificationService = {
  /**
   * Upload document for address verification
   * @param {FormData} formData - Contains document file, tree_id, latitude, longitude
   * @returns {Promise<Object>} Verification result
   */
  async uploadDocument(formData) {
    const response = await api.post(`${API_BASE}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get verification status for a tree
   * @param {number} treeId - Tree ID
   * @returns {Promise<Object>} Verification status
   */
  async getVerificationStatus(treeId) {
    const response = await api.get(`${API_BASE}/status/${treeId}`);
    return response.data;
  },

  /**
   * Resubmit document after rejection
   * @param {number} verificationId - Verification record ID
   * @param {FormData} formData - New document
   * @returns {Promise<Object>} New verification result
   */
  async resubmitDocument(verificationId, formData) {
    const response = await api.post(`${API_BASE}/resubmit/${verificationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all pending verifications (admin only)
   * @returns {Promise<Array>} Pending verifications
   */
  async getPendingVerifications() {
    const response = await api.get(`${API_BASE}/pending`);
    return response.data.verifications;
  },

  /**
   * Approve or reject a verification (admin only)
   * @param {number} verificationId - Verification record ID
   * @param {string} status - 'approved' or 'rejected'
   * @param {string} rejectionReason - Reason if rejected
   * @returns {Promise<Object>} Updated verification
   */
  async updateVerificationStatus(verificationId, status, rejectionReason = null) {
    const response = await api.put(`${API_BASE}/${verificationId}/status`, {
      status,
      rejection_reason: rejectionReason,
    });
    return response.data;
  },
};

export default addressVerificationService;
