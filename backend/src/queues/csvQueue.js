const { Queue } = require("bullmq");
const redis = require("../config/redis");

const csvQueue = new Queue("csv-upload-queue", {
  connection: redis
});

module.exports = csvQueue;
