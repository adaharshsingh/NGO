const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

router.get("/:jobId", async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json({
    status: job.status,
    processedRows: job.processedRows,
    failedRows: job.failedRows,
    totalRows: job.totalRows
  });
});

module.exports = router;
