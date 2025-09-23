const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Drone mission or field mission record.
 * missionId: external id (drone controller) or generated id
 * avgCanopyFraction: aggregated canopy fraction across images (0..1)
 */

/*
-verification_status
- 'pending' | 'verified' | 'rejected'
- verified_by: { type: Schema.Types.ObjectId, ref: 'User' },
- verified_at: { type: Date },
- verification_notes: { type: String },
*/
const MissionSchema = new Schema({
  project: { type: String, ref: 'Project', required: true, index: true },
  plot: { type: Schema.Types.ObjectId, ref: 'Plot' },      // optional: mission may cover multiple plots later
  missionId: { type: String, required: true, index: true },
  numImages: { type: Number, default: 0 },
  files: [{ type: String }],               // store uploaded file names/paths
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  verified_by: { type: Schema.Types.ObjectId, ref: 'User' },
  verified_at: { type: Date },
  verification_notes: { type: String },
  created_at: { type: Date, default: Date.now },
  avgCanopyFraction: { type: Number, default: 0.0 }, // 0..1
  numberOfSeedlings : {type : Number, default: 0},
  notes: { type: String },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

MissionSchema.index({ project: 1, missionId: 1 });

module.exports = mongoose.model('Mission', MissionSchema);
