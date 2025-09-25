const Mission = require('../models/Mission')
const MRVResult = require('../models/MRVResult')
const User = require('../models/User')
const Issuance = require('../models/Issuance')
// const Plot = require('../models/Plot')
const {anchorReport} = require('../services/anchorService')
const {issueCredits} = require('../services/tokenService')
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
    const avgCanopyFraction = mission.avgCanopyFraction;
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
        survivalRate,
        total_agb,
        total_carbon,
        total_co2e
    };
    
    // anchorReport(payload, missionId).then(async (anchorResult)=>{
    //     console.log('Anchor result:', anchorResult);
    //     const mrv = new MRVResult({
    //         mission : missionId,
    //         agbKg : total_agb * 1000,
    //         carbonKg : total_carbon * 1000,
    //         co2eKg : total_co2e * 1000,
    //         finalTokenAmount : total_co2e * 1000, 
    //         survivalRate,
    //         payload,
    //         payloadSha256 : anchorResult.reportHash,
    //         ipfsCid : anchorResult.ipfsCid,
    //         txHash : anchorResult.txHash,
    //         blockNumber : anchorResult.blockNumber,
    //         // status : 'verified'
    //     });
    //     await mrv.save();
    //     // mission.status = 'mrv_completed';
    //     await mission.save();
    //     res.json({
    //         message : 'MRV completed and anchored',
    //         mrv
    //     })
    // }).catch(err=>{
    //     console.error('Error anchoring report:', err);
    //     res.status(500).json({
    //         error: 'Failed to anchor MRV report'
    //     });
    // });
    const anchorResult = await anchorReport(payload, missionId);
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
    const issueResult = await issueCredits(anchorResult, missionId, Math.round(total_co2e));
    console.log('Issue result:', issueResult);
    const issuance = new Issuance({
        mrv : mrv._id,
        tokenAmount : Math.round(total_co2e),
        txHash : issueResult.txHash,
        toWallet : mission.project.ownerWallet
    });
    await issuance.save();
    const projectOwner = await User.findById(mission.project.owner);
    res.json({
        message : 'MRV completed, anchored, and credits issued',
        mrv,
        issuance
    })
}
module.exports = {
    runMRV
}