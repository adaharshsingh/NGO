require("dotenv").config();
const mongoose = require("mongoose");
const Report = require("./src/models/report"); // adjust if path differs

const MONGO_URI = process.env.MONGO_URI;

const months = ["2025-01", "2025-02", "2025-03"];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  const reports = [];

  for (const month of months) {
    for (let i = 1; i <= 18; i++) {
      reports.push({
        ngoId: `NGO-${String(i).padStart(3, "0")}`,
        month,
        peopleHelped: random(50, 500),
        eventsConducted: random(1, 20),
        fundsUtilized: random(10000, 500000)
      });
    }
  }

  await Report.insertMany(reports);
  console.log(`Inserted ${reports.length} reports`);

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});