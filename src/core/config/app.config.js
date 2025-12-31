// Production: Hostinger app, Development: localhost
const PRODUCTION_APP_URL = 'https://app.miarbolenelmundo.com';
const DEVELOPMENT_APP_URL = 'http://localhost:5174';

export const APP_URL =
  import.meta.env.VITE_APP_URL || (import.meta.env.PROD ? PRODUCTION_APP_URL : DEVELOPMENT_APP_URL);
