export const countries = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'España',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
];

export const getRandomCoordinates = (country) => {
  const countryCoordinates = {
    Argentina: { lat: -34.6037, lng: -58.3816, radius: 10 },
    Bolivia: { lat: -16.2902, lng: -63.5887, radius: 8 },
    Brasil: { lat: -14.235, lng: -51.9253, radius: 15 },
    Chile: { lat: -35.6751, lng: -71.543, radius: 8 },
    Colombia: { lat: 4.5709, lng: -74.2973, radius: 6 },
    'Costa Rica': { lat: 9.7489, lng: -83.7534, radius: 2 },
    Cuba: { lat: 21.5218, lng: -77.7812, radius: 3 },
    Ecuador: { lat: -1.8312, lng: -78.1834, radius: 3 },
    'El Salvador': { lat: 13.7942, lng: -88.8965, radius: 1 },
    España: { lat: 40.4637, lng: -3.7492, radius: 6 },
    Guatemala: { lat: 15.7835, lng: -90.2308, radius: 2 },
    Honduras: { lat: 15.2, lng: -86.2419, radius: 2 },
    México: { lat: 23.6345, lng: -102.5528, radius: 12 },
    Nicaragua: { lat: 12.8654, lng: -85.2072, radius: 2 },
    Panamá: { lat: 8.538, lng: -80.7821, radius: 2 },
    Paraguay: { lat: -23.4425, lng: -58.4438, radius: 4 },
    Perú: { lat: -9.19, lng: -75.0152, radius: 8 },
    'República Dominicana': { lat: 18.7357, lng: -70.1627, radius: 2 },
    Uruguay: { lat: -32.5228, lng: -55.7658, radius: 3 },
    Venezuela: { lat: 6.4238, lng: -66.5897, radius: 6 },
  };

  const coords = countryCoordinates[country] || countryCoordinates['Colombia'];

  // Generate random coordinates within the country's radius
  const randomLat = coords.lat + (Math.random() - 0.5) * coords.radius;
  const randomLng = coords.lng + (Math.random() - 0.5) * coords.radius;

  return {
    lat: randomLat,
    lng: randomLng,
  };
};
