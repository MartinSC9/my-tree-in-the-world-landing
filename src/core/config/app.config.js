// Production: Hostinger app, Development: localhost
// TODO: Cambiar a 'https://app.miarbolenelmundo.com' cuando esté listo
const PRODUCTION_APP_URL = 'https://my-tree-in-the-world-front.vercel.app';
const DEVELOPMENT_APP_URL = 'http://localhost:5174';

export const APP_URL = import.meta.env.VITE_APP_URL ||
  (import.meta.env.PROD ? PRODUCTION_APP_URL : DEVELOPMENT_APP_URL);
