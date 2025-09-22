// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// /**
//  * Issuance records represent credits issued (on-chain or off-chain).
//  * txHash will be filled when minting occurs; for prototype it may be null.
//  */
// const IssuanceSchema = new Schema({
//   mrv: { type: Schema.Types.ObjectId, ref: 'MRVResult', required: true, index: true },
//   tokenAmount: { type: Number, required: true }, // units: kg CO2e (convert to token decimals when minting)
//   txHash: { type: String },                       // optional on-chain tx hash
//   toWallet: { type: String },                     // destination wallet (owner)
//   verifier: { type: Schema.Types.ObjectId, ref: 'User' }, // verifier who approved (nullable for prototype)
//   createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// IssuanceSchema.index({ mrv: 1 });

// module.exports = mongoose.model('Issuance', IssuanceSchema);
