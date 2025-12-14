const router = require("express").Router();
const Report = require("../models/report");

router.post("/", async (req, res) => {
  const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized } = req.body;

  if (!ngoId || !month) {
    return res.status(400).json({ error: "ngoId and month required" });
  }

  await Report.updateOne(
    { ngoId, month },
    {
      $set: {
        peopleHelped,
        eventsConducted,
        fundsUtilized
      }
    },
    { upsert: true }
  );

  res.json({ message: "Report submitted successfully" });
});

module.exports = router;
