const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    ngoId: { type: String, required: true },
    month: { type: String, required: true }, // YYYY-MM
    peopleHelped: { type: Number, required: true },
    eventsConducted: { type: Number, required: true },
    fundsUtilized: { type: Number, required: true }
  },
  { timestamps: true }
);

// Idempotency guarantee
reportSchema.index({ ngoId: 1, month: 1 }, { unique: true });
reportSchema.index({ month: 1 });

module.exports = mongoose.model("Report", reportSchema);
