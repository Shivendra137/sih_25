const Mission = require('../models/Mission')
const MRVResult = require('../models/MRVResult')
const User = require('../models/User')
// const Plot = require('../models/Plot')
const {anchorReport} = require('../services/anchorService')
async function runMRV(req,res){
    const missionId = req.params.id;
    const mission = await Mission.findById(missionId);
    console.log(mission.project);
    if(!mission) return res.status(404).json({
        error : 'Mission not found'
    });
    if(mission.status !== "verified"){
        return res.status(400).json({
            error : 'Mission not verified'
        });
    }
    // const plot = await Plot.findById(mission.plot);
    const areaHa = 1; // default to 1 ha if not specified
    const numberOfSeedlings = mission.numberOfSeedlings;
    const seedling_density_per_ha = numberOfSeedlings/areaHa;
    //assuming avgCanopyFraction is between 0 and 1
    const avgCanopyFraction = mission.avgCanopyFraction;
    const survivalRate = 0.9; // 90% survival rate
    const agb_per_ha = 10 * avgCanopyFraction; // simplistic model: 10 tons per ha at full canopy
    const carbon_per_ha = agb_per_ha * 0.5; // 50% of AGB is carbon
    const co2e_per_ha = carbon_per_ha * 3.67; // convert C to CO2e
    const total_agb = agb_per_ha * areaHa * survivalRate; // adjusted for survival
    const total_carbon = carbon_per_ha * areaHa * survivalRate;
    const total_co2e = co2e_per_ha * areaHa * survivalRate;
    const payload = {
        areaHa,
        seedling_density_per_ha,
        avgCanopyFraction,
        survivalRate,
        total_agb,
        total_carbon,
        total_co2e
    };
    anchorReport(payload, missionId).then(async (anchorResult)=>{
        console.log('Anchor result:', anchorResult);
        const mrv = new MRVResult({
            mission : missionId,
            agbKg : total_agb * 1000,
            carbonKg : total_carbon * 1000,
            co2eKg : total_co2e * 1000,
            finalTokenAmount : total_co2e * 1000, 
            survivalRate,
            payload,
            payloadSha256 : anchorResult.reportHash,
            ipfsCid : anchorResult.ipfsCid,
            txHash : anchorResult.txHash,
            blockNumber : anchorResult.blockNumber,
            // status : 'verified'
        });
        await mrv.save();
        // mission.status = 'mrv_completed';
        await mission.save();
        res.json({
            message : 'MRV completed and anchored',
            mrv
        })
    }).catch(err=>{
        console.error('Error anchoring report:', err);
        res.status(500).json({
            error: 'Failed to anchor MRV report'
        });
    });
}
module.exports = {
    runMRV
}