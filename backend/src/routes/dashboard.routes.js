const express = require("express");
const Report = require("../models/report");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", adminAuth, async (req, res) => {
  let { month, page = 1, limit = 10, search = "", sortBy, order } = req.query;

  if (!month) {
    return res.status(400).json({ error: "month is required" });
  }

  page = Number(page);
  limit = Number(limit);

  const filter = {
    month,
    ...(search && {
      ngoId: { $regex: search, $options: "i" }
    })
  };

  const sort = {};
  if (sortBy) {
    sort[sortBy] = order === "asc" ? 1 : -1;
  }

  const rows = await Report.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const totalCount = await Report.countDocuments(filter);

  const allRows = await Report.find({ month }).lean();

  let totalPeopleHelped = 0;
  let totalEvents = 0;
  let totalFunds = 0;

  allRows.forEach(r => {
    totalPeopleHelped += r.peopleHelped;
    totalEvents += r.eventsConducted;
    totalFunds += r.fundsUtilized;
  });

  res.json({
    totals: {
      totalNGOs: allRows.length,
      totalPeopleHelped,
      totalEvents,
      totalFunds
    },
    rows,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  });
});

module.exports = router;