const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
const HEADERS = {
  'Accept-Language': 'es',
  'User-Agent': 'SanosYSalvos/1.0 (contacto@sanosysalvos.cl)'
};

// Buscar lugar por nombre → devuelve coordenadas
// GET /buscar?q=Parque Bicentenario Santiago
app.get('/buscar', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "El parámetro 'q' es requerido" });
  }

  try {
    const response = await fetch(
      `${NOMINATIM_URL}/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=cl`,
      { headers: HEADERS }
    );
    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: "No se encontró el lugar" });
    }

    // Formatear respuesta
    const resultados = data.map((lugar) => ({
      nombre: lugar.display_name,
      lat: parseFloat(lugar.lat),
      lng: parseFloat(lugar.lon),
    }));

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Geocodificación inversa → coordenadas a dirección
// GET /reverse?lat=-33.4569&lng=-70.6483
app.get('/reverse', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Los parámetros 'lat' y 'lng' son requeridos" });
  }

  try {
    const response = await fetch(
      `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: HEADERS }
    );
    const data = await response.json();

    res.json({
      direccion: data.display_name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3002, () => console.log("ms-geolocalizacion corriendo en puerto 3002"));