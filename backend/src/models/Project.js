const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
  // geometry: optional GeoJSON object; store as Mixed for prototype
  geometry: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['draft','active','archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

ProjectSchema.index({ owner: 1, name: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
