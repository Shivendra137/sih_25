const Mission = require('../models/Mission');


async function missionRegister(req, res) {
    try {
        // const owner = req.user; // assuming auth middleware sets req.user
        const { project, plot, missionId, numImages, avgCanopyFraction, notes } = req.body;
        if (!project || !missionId) {
            return res.status(400).json({
                error: "Project ID and Mission ID are required"
            });
        }

        // Create new Mission document
        const newMission = new Mission({
            project: project || null,                  // required
            plot: plot || null,          // optional
            missionId,                   // required
            numImages: numImages || 0,
            avgCanopyFraction: avgCanopyFraction || 0.0,
            notes: notes || '',
            status: 'pending',           // default status
            created_at: new Date()
            // verified_by, verified_at, verification_notes remain null initially
        });

        await newMission.save();

        return res.status(201).json({
            message: "Mission registered successfully",
            mission: newMission
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Server error"
        });
    }
}




module.exports = { missionRegister}