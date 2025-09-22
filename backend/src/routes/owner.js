const Mission = require('../models/Mission');
async function verify(req,res){
    const verifier = req.user;
    const missionId = req.params.id;
    const {action,notes} = req.body;
    const mission = await Mission.findBy(missionId);
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
        const owner = req.user; // Assuming you have auth middleware setting req.user
        const { title, description, deadline } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                error: "Title and description are required"
            });
        }

        const newMission = new Mission({
            title,
            description,
            deadline: deadline || null,
            owner: owner._id,
            status: 'pending_verification', // default initial status
            created_at: new Date()
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