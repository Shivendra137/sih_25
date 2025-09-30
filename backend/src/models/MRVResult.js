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
  finalTokenAmount: { type: Number, default: 0.0 },
  survivalRate: { type: Number, default: 0.9 },
  bufferPct: { type: Number, default: 0.1 },
  leakagePct: { type: Number, default: 0.02 },
  payload: { type: Schema.Types.Mixed }, 
  payloadSha256: { type: String },       
  ipfsCid: { type: String },             
  txHash: { type: String },               // on-chain tx hash of anchor
  blockNumber: { type: Number },        // block number of anchor tx
  status: { type: String,  default: "pending", index: true },
  credits: {type : Number, default: 0.0},
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
MRVSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('MRVResult', MRVSchema);
