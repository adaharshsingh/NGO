const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    totalRows: Number,
    processedRows: { type: Number, default: 0 },
    failedRows: { type: Number, default: 0 },
    errors: [
      {
        rowNumber: Number,
        reason: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
