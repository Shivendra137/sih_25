const Mission = require("../models/Mission");
const MRVResult = require("../models/MRVResult");
const User = require("../models/User");
const Issuance = require("../models/Issuance");
// const Plot = require('../models/Plot')
const { anchorReport } = require("../services/anchorService");
const { issueCredits } = require("../services/tokenService");
async function runMRV(req, res) {
  try {
    const missionId = req.params.id;

    const mission = await Mission.findById(missionId);

    if (!mission) return res.status(404).json({ error: "Mission not found" });

    // if (mission.MRVsubmitted) {
    //   return res.status(400).json({
    //     message: "MRV of this mission already added for verification",
    //   });
    // }



    const areaHa = mission.areaHa || 1; // default to 1 ha if not specified
    const numberOfSeedlings = 200;
    const seedling_density_per_ha = numberOfSeedlings / areaHa;
    const avgCanopyFraction = mission.avgCanopyFraction || 0.5;
    const survivalRate = 0.9;
    const agb_per_ha = 10 * avgCanopyFraction;
    const carbon_per_ha = agb_per_ha * 0.5;
    const co2e_per_ha = carbon_per_ha * 3.67;
    const total_agb = agb_per_ha * areaHa * survivalRate;
    const total_carbon = carbon_per_ha * areaHa * survivalRate;
    const total_co2e = co2e_per_ha * areaHa * survivalRate;
    const payload = {
      areaHa,
      seedling_density_per_ha,
      avgCanopyFraction,
      agb_per_ha,
      carbon_per_ha,
      co2e_per_ha,
      total_agb,
      total_carbon,
      total_co2e,
    };
    const anchorResult = await anchorReport(payload, missionId);
    console.log("Anchor result:", anchorResult);
    const mrv = new MRVResult({
      mission: missionId,
      agbKg: total_agb,
      carbonKg: total_carbon,
      co2eKg: total_co2e,
      finalTokenAmount: total_co2e,
      survivalRate,
      payload,
      payloadSha256: anchorResult.reportHash,
      ipfsCid: anchorResult.ipfsCid,
      txHash: anchorResult.txHash,
      blockNumber: anchorResult.blockNumber,
      
    });
    await mrv.save();
    mission.MRVsubmitted= true;
    await mission.save();


    
    res.status(200).json({
      message: "MRV completed",
      mrv
     
    });
  } catch (error) {
    console.error("Error running MRV:", error);

    res.status(500).json({ error: "Server error while running MRV" });
  }
}

module.exports = {
  runMRV,
};
