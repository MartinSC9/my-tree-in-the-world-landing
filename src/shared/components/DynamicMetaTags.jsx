import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que actualiza dinámicamente los meta tags de Open Graph y Twitter
 * basándose en la URL actual del sitio (funciona en todos los ambientes)
 */
const DynamicMetaTags = () => {
  const location = useLocation();

  useEffect(() => {
    // Obtener la URL base actual (funciona en dev, QA, y producción)
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}${location.pathname}`;

    // Actualizar meta tags de Open Graph
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:image', `${baseUrl}/og-image.jpg`, 'property');

    // Actualizar meta tags de Twitter
    updateMetaTag('twitter:url', currentUrl, 'name');
    updateMetaTag('twitter:image', `${baseUrl}/twitter-card.jpg`, 'name');

    // Actualizar URL canónica
    updateCanonicalLink(currentUrl);

    // Actualizar Schema.org JSON-LD
    updateSchemaOrg(baseUrl);
  }, [location]);

  return null; // Este componente no renderiza nada
};

/**
 * Actualiza o crea un meta tag
 */
function updateMetaTag(property, content, attributeName = 'property') {
  let element = document.querySelector(`meta[${attributeName}="${property}"]`);

  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attributeName, property);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

/**
 * Actualiza el link canónico
 */
function updateCanonicalLink(url) {
  let canonical = document.querySelector('link[rel="canonical"]');

  if (canonical) {
    canonical.setAttribute('href', url);
  } else {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    document.head.appendChild(canonical);
  }
}

/**
 * Actualiza los scripts de Schema.org JSON-LD
 */
function updateSchemaOrg(baseUrl) {
  // Actualizar WebApplication schema
  const webAppSchema = document.querySelector('script[type="application/ld+json"]');
  if (webAppSchema) {
    try {
      const data = JSON.parse(webAppSchema.textContent);
      if (data['@type'] === 'WebApplication') {
        data.url = baseUrl;
        if (data.author) {
          data.author.url = baseUrl;
        }
        webAppSchema.textContent = JSON.stringify(data, null, 2);
      }
    } catch (e) {
      console.error('Error updating WebApplication schema:', e);
    }
  }

  // Actualizar Organization schema
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'Organization') {
        data.url = baseUrl;
        data.logo = `${baseUrl}/logo.png`;
        script.textContent = JSON.stringify(data, null, 2);
      }
    } catch (e) {
      console.error('Error updating Organization schema:', e);
    }
  });
}

export default DynamicMetaTags;
