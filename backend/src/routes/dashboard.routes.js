const express = require("express");
const Report = require("../models/report");

const router = express.Router();


router.get("/", async (req, res) => {
  let { month } = req.query;
  month = month?.trim();

  if (!month) {
    return res.status(400).json({ error: "month is required (YYYY-MM)" });
  }

  const result = await Report.aggregate([
    { $match: { month } },
    {
      $group: {
        _id: null,
        ngos: { $addToSet: "$ngoId" },
        totalPeopleHelped: { $sum: "$peopleHelped" },
        totalEvents: { $sum: "$eventsConducted" },
        totalFunds: { $sum: "$fundsUtilized" }
      }
    },
    {
      $project: {
        _id: 0,
        totalNGOs: { $size: "$ngos" },
        totalPeopleHelped: 1,
        totalEvents: 1,
        totalFunds: 1
      }
    }
  ]);

  res.json(
    result[0] || {
      totalNGOs: 0,
      totalPeopleHelped: 0,
      totalEvents: 0,
      totalFunds: 0
    }
  );
});


module.exports = router;
