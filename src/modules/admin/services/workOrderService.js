import api from '@core/config/api';
import { API_ENDPOINTS } from '@core/config/api.config';

export const workOrderService = {
  // Get all work orders
  async getWorkOrders(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${API_ENDPOINTS.WORK_ORDERS}?${params}` : API_ENDPOINTS.WORK_ORDERS;
    const response = await api.get(url);
    return response.data.workOrders;
  },

  // Get work order by ID
  async getWorkOrderById(id) {
    const response = await api.get(API_ENDPOINTS.WORK_ORDER_BY_ID(id));
    return response.data.workOrder;
  },

  // Update work order status
  async updateWorkOrderStatus(id, status, notes) {
    const response = await api.put(API_ENDPOINTS.WORK_ORDER_BY_ID(id), { status, notes });
    return response.data.workOrder;
  }
};

export default workOrderService;
