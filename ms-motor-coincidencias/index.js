/**
 * ms-motor-coincidencias
 * Microservicio que cruza reportes de mascotas PERDIDAS con AVISTAMIENTOS
 * y calcula un score de similitud ponderado para facilitar el reencuentro.
 */

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const app = express();

// ─── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Prevenir payloads gigantes

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta más tarde.' },
});
app.use(limiter);

// ─── Conexión MongoDB ────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: La variable de entorno MONGODB_URI no está definida.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Motor de coincidencias conectado a MongoDB'))
  .catch((err) => {
    console.error('❌ Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });

// ─── Schema de Avistamiento ──────────────────────────────────────────────────
/**
 * Un avistamiento es reportado por cualquier persona que encontró o vio
 * una mascota suelta. No requiere ser el dueño.
 */
const AvistamientoSchema = new mongoose.Schema({
  // Quien reporta
  nombreReportante: { type: String, required: true, trim: true },
  telefonoReportante: { type: String, required: true, trim: true },

  // Descripción de la mascota avistada
  especie:    { type: String, required: true, lowercase: true, trim: true },
  raza:       { type: String, default: '', lowercase: true, trim: true },
  color:      { type: String, required: true, lowercase: true, trim: true },
  sexo:       { type: String, default: 'desconocido', lowercase: true },
  descripcion:{ type: String, default: '' },

  // Ubicación del avistamiento
  lugarAvistamiento: { type: String, required: true },
  coordenadas: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  // Fecha y estado
  fechaAvistamiento: { type: Date, required: true },
  estado: {
    type: String,
    enum: ['activo', 'resuelto'],
    default: 'activo',
  },
  creadoEn: { type: Date, default: Date.now },
});

// Índice geoespacial para búsquedas por proximidad
AvistamientoSchema.index({ 'coordenadas.lat': 1, 'coordenadas.lng': 1 });
AvistamientoSchema.index({ especie: 1, estado: 1 });

const Avistamiento = mongoose.model('Avistamiento', AvistamientoSchema);

// ─── Schema de Reporte (espejo del ms-gestion-mascotas, solo lectura) ────────
/**
 * Este microservicio NO escribe en la colección de reportes.
 * Solo la lee para cruzar con los avistamientos.
 * strict: false permite leer sin importar cambios en el schema original.
 */
const Reporte = mongoose.model(
  'Reporte',
  new mongoose.Schema({
    especie:    { type: String },
    raza:       { type: String },
    color:      { type: String },
    sexo:       { type: String },
    coordenadas:{ lat: Number, lng: Number },
    comuna:     { type: String },
    estado:     { type: String },
    creadoEn:   { type: Date },
  }, { strict: false })
);

// ─── Algoritmo de Scoring ────────────────────────────────────────────────────
/**
 * Calcula la distancia en km entre dos coordenadas usando la fórmula de Haversine.
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} Distancia en kilómetros
 */
function calcularDistanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Compara si dos strings comparten palabras relevantes (ignorando mayúsculas).
 * Útil para comparar razas y colores con descripciones variadas.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function coincidenciaParcial(a = '', b = '') {
  if (!a || !b) return false;
  const wordsA = a.toLowerCase().split(/\s+/);
  const wordsB = b.toLowerCase().split(/\s+/);
  return wordsA.some((w) => w.length > 2 && wordsB.includes(w));
}

/**
 * Calcula el score de similitud entre un reporte de pérdida y un avistamiento.
 *
 * Puntaje máximo: 100
 * ┌─────────────────────┬────────┬──────────────────────────────────┐
 * │ Criterio            │ Puntos │ Lógica                           │
 * ├─────────────────────┼────────┼──────────────────────────────────┤
 * │ Especie             │  30    │ Exacto o nulo (filtro previo)    │
 * │ Distancia ≤ 2km     │  30    │ Escala inversa hasta 10km        │
 * │ Color               │  20    │ Exacto=20, parcial=10            │
 * │ Raza                │  10    │ Exacto=10, parcial=5             │
 * │ Sexo                │  10    │ Exacto o desconocido             │
 * └─────────────────────┴────────┴──────────────────────────────────┘
 *
 * @param {object} reporte   - Documento de mascota perdida
 * @param {object} avistamiento - Documento de avistamiento
 * @returns {{ score: number, detalle: object }}
 */
function calcularScore(reporte, avistamiento) {
  let score = 0;
  const detalle = {};

  // 1. Especie (30 pts) — ya viene filtrado, pero validamos igual
  if (reporte.especie?.toLowerCase() === avistamiento.especie?.toLowerCase()) {
    score += 30;
    detalle.especie = 30;
  } else {
    detalle.especie = 0;
  }

  // 2. Distancia geográfica (30 pts)
  if (
    reporte.coordenadas?.lat && reporte.coordenadas?.lng &&
    avistamiento.coordenadas?.lat && avistamiento.coordenadas?.lng
  ) {
    const distKm = calcularDistanciaKm(
      reporte.coordenadas.lat, reporte.coordenadas.lng,
      avistamiento.coordenadas.lat, avistamiento.coordenadas.lng
    );
    detalle.distanciaKm = parseFloat(distKm.toFixed(2));

    // 30 pts a 0km, 0 pts a 10km, escala lineal
    const ptsDistancia = Math.max(0, Math.round(30 * (1 - distKm / 10)));
    score += ptsDistancia;
    detalle.distancia = ptsDistancia;
  } else {
    detalle.distanciaKm = null;
    detalle.distancia = 0;
  }

  // 3. Color (20 pts)
  const colorExacto = reporte.color?.toLowerCase() === avistamiento.color?.toLowerCase();
  const colorParcial = coincidenciaParcial(reporte.color, avistamiento.color);
  if (colorExacto) {
    score += 20;
    detalle.color = 20;
  } else if (colorParcial) {
    score += 10;
    detalle.color = 10;
  } else {
    detalle.color = 0;
  }

  // 4. Raza (10 pts)
  if (reporte.raza && avistamiento.raza) {
    const razaExacta = reporte.raza.toLowerCase() === avistamiento.raza.toLowerCase();
    const razaParcial = coincidenciaParcial(reporte.raza, avistamiento.raza);
    if (razaExacta) {
      score += 10;
      detalle.raza = 10;
    } else if (razaParcial) {
      score += 5;
      detalle.raza = 5;
    } else {
      detalle.raza = 0;
    }
  } else {
    detalle.raza = 0;
  }

  // 5. Sexo (10 pts)
  const sexoReporte = reporte.sexo?.toLowerCase();
  const sexoAvist  = avistamiento.sexo?.toLowerCase();
  if (
    sexoReporte && sexoAvist &&
    sexoReporte !== 'desconocido' && sexoAvist !== 'desconocido' &&
    sexoReporte === sexoAvist
  ) {
    score += 10;
    detalle.sexo = 10;
  } else {
    detalle.sexo = 0;
  }

  return { score, detalle };
}

// ─── Middlewares de validación ───────────────────────────────────────────────
/**
 * Valida que req.params.reporteId sea un ObjectId válido de MongoDB.
 * Usado en la ruta GET /coincidencias/:reporteId
 */
function validarReporteId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.reporteId)) {
    return res.status(400).json({ error: 'ID de reporte inválido.' });
  }
  next();
}

/**
 * Valida que req.params.id sea un ObjectId válido de MongoDB.
 * Usado en rutas como PATCH /avistamientos/:id/resuelto
 */
function validarAvistamientoId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID de avistamiento inválido.' });
  }
  next();
}

// ─── Rutas: Avistamientos ────────────────────────────────────────────────────

/**
 * POST /avistamientos
 * Cualquier persona puede reportar haber visto una mascota suelta.
 */
app.post('/avistamientos', async (req, res) => {
  try {
    const {
      nombreReportante, telefonoReportante,
      especie, raza, color, sexo, descripcion,
      lugarAvistamiento, coordenadas, fechaAvistamiento,
    } = req.body;

    // Validación mínima
    if (!nombreReportante || !telefonoReportante || !especie || !color ||
        !lugarAvistamiento || !coordenadas?.lat || !coordenadas?.lng || !fechaAvistamiento) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: nombreReportante, telefonoReportante, especie, color, lugarAvistamiento, coordenadas y fechaAvistamiento.',
      });
    }

    const avistamiento = await Avistamiento.create({
      nombreReportante, telefonoReportante,
      especie, raza, color, sexo, descripcion,
      lugarAvistamiento, coordenadas, fechaAvistamiento,
    });

    res.status(201).json(avistamiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /avistamientos
 * Lista todos los avistamientos activos. Soporta filtro por especie.
 * Query params: ?especie=perro
 */
app.get('/avistamientos', async (req, res) => {
  try {
    const filtro = { estado: 'activo' };
    if (req.query.especie) filtro.especie = req.query.especie.toLowerCase();

    const avistamientos = await Avistamiento.find(filtro).sort({ creadoEn: -1 });
    res.json(avistamientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /avistamientos/:id/resuelto
 * Marca un avistamiento como resuelto (la mascota fue identificada/reunida).
 */
app.patch('/avistamientos/:id/resuelto', validarAvistamientoId, async (req, res) => {
  try {
    const avistamiento = await Avistamiento.findByIdAndUpdate(
      req.params.id,
      { estado: 'resuelto' },
      { new: true }
    );
    if (!avistamiento) return res.status(404).json({ error: 'Avistamiento no encontrado.' });
    res.json(avistamiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Rutas: Motor de Coincidencias ──────────────────────────────────────────

/**
 * GET /coincidencias/:reporteId
 * Dado el ID de un reporte de mascota perdida, devuelve los avistamientos
 * más similares ordenados de mayor a menor score.
 *
 * Query params:
 *   - minScore: número entre 0-100 (default: 20)
 *   - limite:   número máximo de resultados (default: 10, max: 50)
 *   - radioKm:  solo considerar avistamientos dentro de N km (default: 15)
 */
app.get('/coincidencias/:reporteId', validarReporteId, async (req, res) => {
  try {
    const minScore = parseInt(req.query.minScore) || 20;
    const limite   = Math.min(parseInt(req.query.limite) || 10, 50);
    const radioKm  = parseFloat(req.query.radioKm) || 15;

    // 1. Buscar el reporte de pérdida
    const reporte = await Reporte.findById(req.params.reporteId);
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte de mascota perdida no encontrado.' });
    }
    if (reporte.estado === 'encontrado') {
      return res.json({ mensaje: 'Esta mascota ya fue marcada como encontrada.', coincidencias: [] });
    }

    // 2. Pre-filtrar avistamientos por especie (obligatorio) y estado activo
    const filtroBase = { estado: 'activo' };
    if (reporte.especie) filtroBase.especie = reporte.especie.toLowerCase();

    const candidatos = await Avistamiento.find(filtroBase).lean();

    // 3. Calcular score para cada candidato y filtrar por radio y minScore
    const resultados = candidatos
      .map((av) => {
        const { score, detalle } = calcularScore(reporte, av);
        return { avistamiento: av, score, detalle };
      })
      .filter(({ score, detalle }) => {
        // Descartar si está fuera del radio máximo (cuando hay coordenadas)
        if (detalle.distanciaKm !== null && detalle.distanciaKm > radioKm) return false;
        return score >= minScore;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limite);

    res.json({
      reporteId:   reporte._id,
      mascota:     reporte.nombreMascota || 'Sin nombre',
      especie:     reporte.especie,
      totalEncontrados: resultados.length,
      coincidencias: resultados,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /health
 * Endpoint de salud para el orquestador de contenedores.
 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    servicio: 'ms-motor-coincidencias',
    db: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    timestamp: new Date().toISOString(),
  });
});

// ─── Error handler global ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ─── Inicio ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`🚀 ms-motor-coincidencias corriendo en puerto ${PORT}`)
);