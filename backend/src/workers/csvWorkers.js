require("dotenv").config();
const connectDB = require("../config/db");
connectDB();

const { Worker } = require("bullmq");
const fs = require("fs");
const csv = require("csv-parser");

const redis = require("../config/redis");
const Report = require("../models/report");
const Job = require("../models/Job");




const normalizeRow = (row) => {
  const clean = {};
  for (const key in row) {
    const normalizedKey = key
      .replace(/\uFEFF/g, "")
      .trim()
      .toLowerCase();

    clean[normalizedKey] = row[key];
  }
  return clean;
};

new Worker(
  "csv-upload-queue",
  async (job) => {
    const { jobId, filePath } = job.data;

    const jobDoc = await Job.findById(jobId);
    if (!jobDoc) return;

    // mark job as processing
    jobDoc.status = "processing";
    await jobDoc.save();

    let processed = 0;
    let failed = 0;
    let rowNumber = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          rowNumber++;

          try {
            const cleanRow = normalizeRow(row);

            const ngoId = cleanRow["ngoid"]?.trim();
const month = cleanRow["month"]?.trim();


            if (!ngoId || !month) {
              throw new Error("ngoId or month missing");
            }

            Report.updateOne(
              { ngoId, month },
              {
                $set: {
                  peopleHelped: Number(cleanRow["peoplehelped"] || 0),
eventsConducted: Number(cleanRow["eventsconducted"] || 0),
fundsUtilized: Number(cleanRow["fundsutilized"] || 0)

                }
              },
              { upsert: true }
            ).catch(() => {});

            processed++;
          } catch (err) {
            failed++;
            if (jobDoc.errors.length < 50) {
              jobDoc.errors.push({
                rowNumber,
                reason: err.message
              });
            }
          }
        })
        .on("end", async () => {
          jobDoc.processedRows = processed;
          jobDoc.failedRows = failed;
          jobDoc.status = "completed";
          await jobDoc.save();

          fs.unlinkSync(filePath);
          resolve();
        })
        .on("error", async (err) => {
          jobDoc.status = "failed";
          await jobDoc.save();
          reject(err);
        });
    });
  },
  { connection: redis }
);

console.log("CSV Worker running");
