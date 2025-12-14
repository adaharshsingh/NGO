const express = require("express");
const multer = require("multer");
const path = require("path");
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
    status: "pending"
  });

  await csvQueue.add("process-csv", {
    jobId: job._id.toString(),
    filePath: req.file.path
  });

  res.json({
    jobId: job._id,
    message: "CSV upload started"
  });
});

module.exports = router;
