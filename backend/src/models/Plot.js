const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlotSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  name: { type: String, required: true, trim: true },
  species: { type: String },                 // e.g., Rhizophora, Avicennia, Seagrass
  areaHa: { type: Number, required: true },  // area in hectares
  geometry: { type: Schema.Types.Mixed },    // GeoJSON polygon (optional)
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// useful composite index to query plots by project quickly
PlotSchema.index({ project: 1, name: 1 });

module.exports = mongoose.model('Plot', PlotSchema);
