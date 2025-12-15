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
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
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
      const clean = {};
      for (const key in row) {
        clean[key.trim().toLowerCase()] = row[key];
      }

      rows.push({
        ngoId: clean.ngoid,
        month: clean.month,
        peopleHelped: Number(clean.peoplehelped || 0),
        eventsConducted: Number(clean.eventsconducted || 0),
        fundsUtilized: Number(clean.fundsutilized || 0)
      });
    })
    .on("end", async () => {
      await csvQueue.add("process-csv", {
        jobId: job._id.toString(),
        rows
      });

      fs.unlinkSync(req.file.path);

      res.json({
        jobId: job._id,
        message: "CSV upload started"
      });
    })
    .on("error", (err) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: "CSV processing failed" });
    });
});

module.exports = router;