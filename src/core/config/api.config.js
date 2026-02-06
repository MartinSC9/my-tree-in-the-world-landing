// Production: Render backend, Development: localhost
const PRODUCTION_API_URL = 'https://my-tree-in-the-world-back.onrender.com/api';
const DEVELOPMENT_API_URL = 'http://localhost:5000/api';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_API_URL : DEVELOPMENT_API_URL);

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Trees
  TREES: '/trees',
  TREE_MARKERS: '/trees/markers',
  TREE_BY_ID: (id) => `/trees/${id}`,

  // Collaborative Trees
  COLLABORATIVE_TREES: '/collaborative-trees',
  COLLABORATIVE_TREE_BY_ID: (id) => `/collaborative-trees/${id}`,

  // Available Trees (Catalog)
  AVAILABLE_TREES: '/available-trees',
  AVAILABLE_TREE_BY_ID: (id) => `/available-trees/${id}`,
  AVAILABLE_TREES_BY_NURSERY: (nurseryId) => `/available-trees/nursery/${nurseryId}`,

  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,

  // Work Orders
  WORK_ORDERS: '/work-orders',
  WORK_ORDER_BY_ID: (id) => `/work-orders/${id}`,

  // Carbon
  CARBON_CONFIG: '/carbon/config',
  CARBON_CALCULATE: '/carbon/calculate',

  // Audit
  AUDIT_LOGS: '/audit/logs',
  AUDIT_LOG_BY_ID: (id) => `/audit/logs/${id}`,

  // Moderation
  MODERATION_POSTS: '/moderation/posts',

  // Stats
  STATS_LANDING: '/stats/landing',
  STATS_TOP_COMPANIES: '/stats/top-companies',
  STATS_TOP_CONTRIBUTORS: '/stats/top-contributors',
  STATS_SYSTEM: '/stats/system',
  STATS_PLANTER: (id) => `/stats/planter/${id}`,
  STATS_PLANTERS_RANKING: '/stats/planters/ranking',
  STATS_WORK_ORDER_HISTORY: (id) => `/stats/work-order/${id}/history`,
  STATS_WORK_ORDERS_SUMMARY: '/stats/work-orders/summary',
  STATS_PHYSICAL_TREES_FULL: '/stats/physical-trees/full',
  STATS_USER_HISTORY: (id) => `/stats/user/${id}/history`,

  // Raffle / Cupones
  RAFFLE_EXECUTE: (id) => `/raffle/${id}/execute`,
  RAFFLE_RESULTS: (id) => `/raffle/${id}/results`,
  RAFFLE_MY_COUPONS: '/raffle/my-coupons',
  RAFFLE_VALIDATE_COUPON: (code) => `/raffle/coupons/${code}/validate`,
  RAFFLE_REDEEM_COUPON: (code) => `/raffle/coupons/${code}/redeem`,

  // Alerts (Admin)
  ALERTS_STUCK_ORDERS: '/alerts/stuck-orders',
  ALERTS_STATS: '/alerts/stats',
  ALERTS_RESOLVE: (id) => `/alerts/resolve/${id}`,

  // Profile Approval (Admin)
  PROFILE_PENDING_APPROVALS: '/users/pending-approvals',
  PROFILE_APPROVE: (id) => `/users/${id}/approve-profile`,
  PROFILE_REJECT: (id) => `/users/${id}/reject-profile`,

  // Contact
  CONTACT: '/contact',

  // Chat
  CHAT: '/chat',
};
