const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }, // store bcrypt hash
  role: { type: String, enum: ['owner', 'verifier', 'admin'], default: 'owner' },
  walletAddress: { type: String, trim: true }, // optional: blockchain wallet
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
