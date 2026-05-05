const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =======================
// SIGNUP
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ check empty fields
    if (!name || !email || !password) {
      return res.status(400).json("All fields are required");
    }

    // ✅ check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Email already exists");
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "member"
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful ✅",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (err) {
    console.log("Signup Error:", err.message);
    res.status(500).json("Signup failed ❌");
  }
});


// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    // ✅ check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    // ✅ create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.log("Login Error:", err.message);
    res.status(500).json("Login failed ❌");
  }
});

module.exports = router;