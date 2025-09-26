const mongoose = require("mongoose");
const MissionSchema = require("../models/Mission");
const MRVResult = require("../models/MRVResult");
const User = require("../models/User");
const Issuance = require("../models/Issuance");
const { anchorReport } = require("../services/anchorService");
const { issueCredits } = require("../services/tokenService");

async function approveMRV(req, res) {
  try {
    const MRVid = req.params.id;

    const MRV = await MRVResult.findById(MRVid);

    const missionId = MRV.mission;
    console.log("hello")
    const anchorResult = await anchorReport(MRV.payload, missionId);
    console.log("Anchor result:", anchorResult);
    const issueResult = await issueCredits(
      anchorResult,
      missionId,
      Math.round(MRV.co2eKg)
    );
    console.log("Issue result:", issueResult);
    const issuance = new Issuance({
      mrv: MRVid,
      tokenAmount: Math.round(MRV.co2eKg),
      txHash: issueResult.txHash,
    });
    await issuance.save();

    MRV.status = "approved";

    await MRV.save();
    const mission = await MissionSchema.findById(missionId)
    mission.status = "approved";
    await mission.save();

    res.status(200).json({

        message: "MRV approved Successfully",
        issuance
    })
  } catch (error) {

    res.status(500).json({
        message : "some error occured",
        error
    })
  }
}

module.exports = approveMRV;
