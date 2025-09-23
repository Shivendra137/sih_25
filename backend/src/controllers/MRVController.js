const Mission = require('../models/Mission');
const MRVResult = require('../models/MRVResult');

async function runMRV(req, res) {

  try {
    const missionId = req.params.id;

    const mission = await Mission.findById(missionId);


    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    if(mission.MRVsubmitted){
        return res.status(400).json({
            message: "MRV of this mission already added for verification"
        })
    }
    
    // if (mission.status !== 'pending ') {
    //   return res.status(400).json({ error: 'Mission not verified' });
    // }

    // --- MRV Calculation ---
    const areaHa = mission.areaHa || 1; // default 1 ha
    const numberOfSeedlings = mission.numberOfSeedlings || 0;
    const seedling_density_per_ha = numberOfSeedlings / areaHa;

    const avgCanopyFraction = mission.avgCanopyFraction || 0.5;
    const survivalRate = 0.9; // 90% survival

    const agb_per_ha = 10 * avgCanopyFraction; // tons per ha
    const carbon_per_ha = agb_per_ha * 0.5;    // 50% carbon
    const co2e_per_ha = carbon_per_ha * 3.67;  // CO2e conversion

    const total_agb = agb_per_ha * areaHa * survivalRate;
    const total_carbon = carbon_per_ha * areaHa * survivalRate;
    const total_co2e = co2e_per_ha * areaHa * survivalRate;

    // Save MRVResult to DB
    const mrvResult = await MRVResult.create({
      mission: mission._id,
      agbKg: total_agb * 1000,       // convert to kg
      carbonKg: total_carbon * 1000,
      co2eKg: total_co2e * 1000,
      finalTokenAmount: total_co2e * 1000, // kg CO2e
      survivalRate,
      payload: {
        areaHa,
        seedling_density_per_ha,
        avgCanopyFraction,
        agb_per_ha,
        carbon_per_ha,
        co2e_per_ha,
        total_agb,
        total_carbon,
        total_co2e
      },
      status: 'pending'
    });

    // Update mission with MRV results (optional)
    mission.MRVsubmitted= true;
    await mission.save();

    console.log(mrvResult)
    res.status(200).json({
      message: 'MRV calculation complete',
      mrvResult
    });

  } catch (error) {
    console.error('Error running MRV:', error);
    res.status(500).json({ error: 'Server error while running MRV' });
  }
}

module.exports = runMRV;
