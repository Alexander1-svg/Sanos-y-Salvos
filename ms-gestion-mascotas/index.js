const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:password123@mongo:27017/sanosysalvos_db?authSource=admin";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB en Docker"))
  .catch((err) => console.error("Error conectando a la DB:", err));

const ReporteSchema = new mongoose.Schema({
  nombreDueno:   { type: String, required: true },
  telefono:      { type: String, required: true },
  email:         { type: String, required: true },
  comuna:        { type: String, required: true },
  direccion:     { type: String },
  nombreMascota: { type: String, required: true },
  especie:       { type: String, required: true },
  raza:          { type: String },
  color:         { type: String, required: true },
  edad:          { type: String },
  sexo:          { type: String },
  tieneChip:     { type: String },
  fechaPerdida:  { type: Date, required: true },
  lugarPerdida:  { type: String, required: true },
  coordenadas: {
    lat: { type: Number },
    lng: { type: Number },
  },
  descripcion:   { type: String },
  estado: { type: String, enum: ["activo", "encontrado"], default: "activo" },
  creadoEn: { type: Date, default: Date.now },
});

const Reporte = mongoose.model('Reporte', ReporteSchema);

// Crear reporte
app.post('/reportes', async (req, res) => {
  try {
    const reporte = await Reporte.create(req.body);
    res.status(201).json(reporte);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los reportes activos
app.get('/reportes', async (req, res) => {
  try {
    const reportes = await Reporte.find({ estado: "activo" }).sort({ creadoEn: -1 });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener reporte por ID
app.get('/reportes/:id', async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: "Reporte no encontrado" });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Marcar mascota como encontrada
app.patch('/reportes/:id/encontrado', async (req, res) => {
  try {
    const reporte = await Reporte.findByIdAndUpdate(
      req.params.id,
      { estado: "encontrado" },
      { new: true }
    );
    if (!reporte) return res.status(404).json({ error: "Reporte no encontrado" });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ms-gestion-mascotas corriendo en puerto ${PORT}`));
