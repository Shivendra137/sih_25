// // src/services/mrvService.js
// const Decimal = require('decimal.js');

// /**
//  * AGB prototype formula:
//  *   AGB_kg = areaHa * canopyFraction * biomassFactor
//  *
//  * biomassFactor: kg AGB per hectare of full canopy (configurable)
//  */

// function estimateAGB_from_canopy(areaHa, canopyFraction, biomassFactor) {
//   const agb = new Decimal(areaHa).times(canopyFraction).times(biomassFactor);
//   return parseFloat(agb.toFixed(6));
// }

// function agb_to_carbon_and_co2e(agbKg) {
//   const a = new Decimal(agbKg);
//   const carbon = a.times(0.47);
//   const co2e = carbon.times(new Decimal(44).dividedBy(12));
//   return { carbonKg: parseFloat(carbon.toFixed(6)), co2eKg: parseFloat(co2e.toFixed(6)) };
// }

// function apply_adjustments(co2eKg, survivalRate = 0.9, leakagePct = 0.02, bufferPct = 0.1) {
//   const afterSurvival = new Decimal(co2eKg).times(survivalRate);
//   const afterLeakage = afterSurvival.times(new Decimal(1).minus(leakagePct));
//   const finalIssuable = afterLeakage.times(new Decimal(1).minus(bufferPct));
//   return parseFloat(finalIssuable.toFixed(6));
// }

// module.exports = { estimateAGB_from_canopy, agb_to_carbon_and_co2e, apply_adjustments };
