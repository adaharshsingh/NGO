const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/report", require("./routes/report.routes"));
app.use("/reports", require("./routes/upload.routes"));
app.use("/dashboard", require("./routes/dashboard.routes"));
app.use("/job-status", require("./routes/job.routes"));

if (process.env.RUN_WORKER === "true") {
  require("./workers/csvWorker");
}


module.exports = app;
