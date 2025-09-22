// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const UserSchema = new Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   passwordHash: { type: String, required: true }, // store bcrypt hash
//   role: { type: String, enum: ['owner', 'verifier', 'admin'], default: 'owner' },
//   walletAddress: { type: String, trim: true }, // optional: blockchain wallet
//   createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);

//==========================
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// Define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Name is required"],
  },
  email: {
    type: String,
    // required: [true, "Email is required"],
    // unique: true,
    // lowercase: true,
  },
  password: {
    type: String,
    // required: [true, "Password is required"],
    // minlength: 6,
  },
});

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Compare password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("User", userSchema);
