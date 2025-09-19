const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * MRVResult holds the calculation and payload for a mission or event.
 * - payload: full audit JSON (inputs, step-by-step calculations, image references)
 * - status: pending | issued | rejected
 */
const MRVSchema = new Schema({
  mission: { type: Schema.Types.ObjectId, ref: 'Mission', required: true, index: true },
  // Calculated numbers (kg)
  agbKg: { type: Number, default: 0.0 },
  carbonKg: { type: Number, default: 0.0 },
  co2eKg: { type: Number, default: 0.0 },
  // Final tokenizable amount (kg CO2e)
  finalTokenAmount: { type: Number, default: 0.0 },
  // Parameters applied during calculation (for auditability)
  survivalRate: { type: Number, default: 0.9 },
  bufferPct: { type: Number, default: 0.1 },
  leakagePct: { type: Number, default: 0.02 },
  payload: { type: Schema.Types.Mixed }, // store full MRV input + step-by-step details
  payloadSha256: { type: String },       // optional immutability check
  ipfsCid: { type: String },             // optional pinned payload CID
  status: { type: String, enum: ['pending','issued','rejected'], default: 'pending', index: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// quick lookup for pending results per project (via mission populate)
MRVSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('MRVResult', MRVSchema);
