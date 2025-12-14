const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

const Job = require("../models/Job");
const csvQueue = require("../queues/csvQueue");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".csv") {
      return cb(new Error("Only CSV files allowed"));
    }
    cb(null, true);
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file required" });
  }

  const job = await Job.create({
    status: "pending",
    processedRows: 0,
    failedRows: 0,
    errors: []
  });

  const rows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      rows.push({
        ngoId: row.ngoId || row.ngoid,
        month: row.month,
        peopleHelped: row.peopleHelped,
        eventsConducted: row.eventsConducted,
        fundsUtilized: row.fundsUtilized
      });
    })
    .on("end", async () => {
      await csvQueue.add("process-csv", {
        jobId: job._id.toString(),
        rows        // ✅ SEND DATA, NOT FILE PATH
      });

      fs.unlinkSync(req.file.path); // cleanup
    });

  res.json({
    jobId: job._id,
    message: "CSV upload started"
  });
});

module.exports = router;
