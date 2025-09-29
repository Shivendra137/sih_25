const Mission = require('../models/Mission');
const MRVResult = require('../models/MRVResult');
const User = require('../models/User');
const Issuance = require('../models/Issuance');
const { anchorReport } = require('../services/anchorService');
const { issueCredits } = require('../services/tokenService');

async function runMRV(req, res) {
    try {
        const missionId = req.params.id;
        const mission = await Mission.findById(missionId); // Populate project details

        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        if (mission.status !== "verified") {
            return res.status(400).json({ error: 'Mission not verified' });
        }
        // if (!mission.project || !mission.project.ownerWallet) {
        //      return res.status(400).json({ error: 'Project data or owner wallet is missing for this mission.' });
        // }

        // --- MRV Calculation ---
        const areaHa = 1; // Assuming 1 ha for now
        const numberOfSeedlings = mission.numberOfSeedlings;
        const seedling_density_per_ha = numberOfSeedlings / areaHa;
        const avgCanopyFraction = mission.avgCanopyFraction;
        const survivalRate = 0.9; // Example value
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

        // --- Step 1: Anchor the report on the blockchain ---
        const anchorResult = await anchorReport(payload, missionId);
        console.log('Anchor result:', anchorResult);

        const mrv = new MRVResult({
            mission: missionId,
            agbKg: total_agb * 1000,
            carbonKg: total_carbon * 1000,
            co2eKg: total_co2e * 1000,
            finalTokenAmount: Math.round(total_co2e),
            survivalRate,
            payload,
            payloadSha256: anchorResult.reportHash,
            ipfsCid: anchorResult.ipfsCid,
            txHash: anchorResult.txHash,
            blockNumber: anchorResult.blockNumber,
        });
        await mrv.save();

        mission.mrv = mrv._id; // Link the MRV result back to the mission
        await mission.save();

        // --- Step 2: Issue the carbon credit tokens ---
        // FIX: Pass the correct arguments in the correct order
        // 1. The report hash (string) from the anchor result.
        // 2. The amount of tokens (number) to mint.
        const amountToMint = Math.round(total_co2e);
        const issueResult = await issueCredits(anchorResult.reportHash, amountToMint);
        console.log('Issue result:', issueResult);

        const issuance = new Issuance({
            mrv: mrv._id,
            tokenAmount: amountToMint,
            txHash: issueResult.txHash,
            // The project owner's wallet address from the populated mission data
            // toWallet: mission.project.ownerWallet 
        });
        await issuance.save();

        res.json({
            message: 'MRV completed, anchored, and credits issued successfully',
            mrv,
            issuance
        });

    } catch (error) {
        console.error('Error in MRV workflow:', error);
        res.status(500).json({
            error: 'An error occurred during the MRV process.',
            details: error.message
        });
    }
}

module.exports = {
    runMRV
};
