const Mission = require('../models/Mission');


async function verify(req,res){
    // const verifier = req.user;
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
        // mission.verified_by = verifier._id;
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




// ✅ Fetch all missions (optionally filtered by status, etc.)
async function fetchMissions(req, res) {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const missions = await Mission.find(filter).sort({ createdAt: -1 });

    // Build stats
    const totalProjects = await Mission.distinct("project").then(p => p.length);
    const totalCredits = missions.reduce((sum, m) => sum + (m.credits || 0), 0);
    const pendingMRVs = await Mission.countDocuments({ status: "pending" });
    const approvedMRVs = await Mission.countDocuments({ status: "verified" });

 
    return res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalCredits,
        pendingMRVs,
        approvedMRVs,
      },
      missions,
    });
  } catch (err) {
    console.error("Error fetching missions:", err.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}

module.exports = {
    verify, fetchMissions
}