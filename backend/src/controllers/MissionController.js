const Mission = require('../models/Mission');
async function verify(req,res){
    const verifier = req.user;
    const missionId = req.params.id;
    const {action,notes} = req.body;
    const mission = await Mission.findById(missionId);
    if(!mission) return res.status(404).json({
        error : 'Mission not found'
    });
    if(mission.status !== "pending_verification"){
        return res.status(400).json({
            error : 'Mission not in pending_verification'
        });
    }
    if(action == 'approve'){
        mission.status = 'verified';
        mission.verified_by = verifier._id;
        mission.verified_at = new Date();
        mission.verification_notes = notes || null;
        await mission.save();
        return res.status(200).json({
            message : "mission verified",
        })
    }
    else if(action == 'rejected'){
        mission.status = 'rejected';
        mission.verified_by = verifier._id;
        mission.verified_at = new Date();
        mission.verification_notes = notes || 'Rejected without note';
        await mission.save();
        return res.status(200).json({
            message : "mission rejected",
        })
    }
}

async function missionRegister(req, res) {
    try {
        const owner = req.user;
        const { project, plot, missionId, numImages, avgCanopyFraction, notes } = req.body;
        if (!project || !missionId) {
            return res.status(400).json({
                error: "Project ID and Mission ID are required"
            });
        }
        const newMission = new Mission({
            project,                // must be a valid ObjectId
            plot: plot || null,     // optional
            missionId,              // unique mission identifier
            numImages: numImages || 0,
            avgCanopyFraction: avgCanopyFraction || 0.0,
            notes: notes || '',
            verification_status: 'pending', // default verification status
            owner: owner._id || 12321     // if you want to track owner, you may need to add it to schema
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




module.exports = {verify, missionRegister}