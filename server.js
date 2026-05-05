require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//  middleware
app.use(cors({
  origin: "https://your-frontend-url.onrender.com"
}));
app.use(express.json());

//  routes
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

// health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => {
    console.log("DB Error:", err.message);
    process.exit(1);
  });

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});