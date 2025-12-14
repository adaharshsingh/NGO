require("dotenv").config();
const connectDB = require("../config/db");
connectDB();

const { Worker } = require("bullmq");
const redis = require("../config/redis");
const Report = require("../models/report");
const Job = require("../models/Job");

new Worker(
  "csv-upload-queue",
  async (job) => {
    const { jobId, rows } = job.data;

    const jobDoc = await Job.findById(jobId);
    if (!jobDoc) return;

    jobDoc.status = "processing";
    await jobDoc.save();

    let processed = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized } = row;

        if (!ngoId || !month) {
          throw new Error("ngoId or month missing");
        }

        await Report.updateOne(
          { ngoId, month },
          {
            $set: {
              peopleHelped: Number(peopleHelped || 0),
              eventsConducted: Number(eventsConducted || 0),
              fundsUtilized: Number(fundsUtilized || 0)
            }
          },
          { upsert: true }
        );

        processed++;
      } catch (err) {
        failed++;
        jobDoc.errors.push({
          rowNumber: i + 1,
          reason: err.message
        });
      }
    }

    jobDoc.processedRows = processed;
    jobDoc.failedRows = failed;
    jobDoc.status = "completed";
    await jobDoc.save();
  },
  { connection: redis }
);

console.log("CSV Worker running");
