const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt
const router = express.Router();
const User = require('./model'); // Import your User model
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // Replace with a strong secret key


// Fetch all residents
router.get("/residents", async (req, res) => {
  const { userName } = req.query; // Pass the logged-in user's name as a query parameter
  try {
    const otherResidents = await User.find({ userName: { $ne: userName } }, { password: 0, __v: 0 }); // Exclude logged-in user
    res.status(200).json(otherResidents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching residents", error: err.message });
  }
});

// Getting one user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  const { userName, password } = req.body;

  // Validate input
  if (!userName || !password) {
    return res.status(400).json({ message: 'userName and password are required' });
  }

  // Check if userName already exists
  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return res.status(400).json({ message: 'userName is already taken' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ userName, password: hashedPassword });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Login
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1d" });

    // Send the token in an HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: "Login successful", userName: user.userName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user profile data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers following');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userName: user.userName, 
      likes: user.likes,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data', error: err.message });
  }
});

// Deleting one user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout (Placeholder for destroying a session or token)
router.post('/logout', (req, res) => {
  // Add logic to clear session or token
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
