import mongoose from 'mongoose';

const historialSchema = new mongoose.Schema({
  city: { type: String, required: true },
  // Añade otros campos si es necesario
});

export const Historial = mongoose.model('Historial', historialSchema);
