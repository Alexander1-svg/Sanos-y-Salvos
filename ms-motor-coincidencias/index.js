const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URI = "mongodb://admin:password123@mongo:27017/sanosysalvos?authSource=admin";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Motor coincidencias conectado a MongoDB"))
  .catch((err) => console.error("Error:", err));

const Reporte = mongoose.model('Reporte', new mongoose.Schema({}, { strict: false }));

// Buscar coincidencias por especie y comuna
app.get('/coincidencias', async (req, res) => {
  const { especie, comuna } = req.query;
  try {
    const filtro = {};
    if (especie) filtro.especie = especie;
    if (comuna) filtro.comuna = new RegExp(comuna, 'i');

    const coincidencias = await Reporte.find({ ...filtro, estado: "activo" })
      .sort({ creadoEn: -1 });
    res.json(coincidencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`ms-motor-coincidencias corriendo en puerto ${PORT}`));
