require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/user"); // adjust path if needed

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash("123456", 10);
  await User.create({
    email: "test@example.com",
    password: passwordHash,
    role: "admin"
  });
  console.log("Admin user created");
  process.exit(0);
})();