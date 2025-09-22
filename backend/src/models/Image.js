// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// /**
//  * Stores metadata for each uploaded image.
//  * url: path to file (e.g. '/uploads/12345.jpg' or S3 URL)
//  * sha256: evidence hash for tamper detection
//  * exif: optional EXIF metadata (gps, timestamp)
//  */
// const ImageSchema = new Schema({
//   mission: { type: Schema.Types.ObjectId, ref: 'Mission', required: true, index: true },
//   url: { type: String, required: true },
//   sha256: { type: String, length: 64, index: true },
//   exif: { type: Schema.Types.Mixed },
//   createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// ImageSchema.index({ mission: 1, createdAt: -1 });

// module.exports = mongoose.model('Image', ImageSchema);
