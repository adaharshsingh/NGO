const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

router.get("/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      status: job.status || "pending",
      processedRows: job.processedRows || 0,
      failedRows: job.failedRows || 0,
      totalRows: job.totalRows || 0,
      errors: job.errors || []
    });
  } catch (err) {
    console.error("Job status error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;