require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ middleware FIRST
app.use(cors());
app.use(express.json());

// ✅ routes AFTER middleware
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// protected route
const verifyToken = require("./middleware/auth");

app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "Protected route working 🔐",
    userId: req.user.id
  });
});

// root route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => {
    console.log("DB Error:", err.message);
    process.exit(1);
  });

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});