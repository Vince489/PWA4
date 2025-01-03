const express = require("express");
const router = express.Router();

// Middleware to set default variables
router.use((req, res, next) => {
  res.locals.title = "My App";
  res.locals.message = "";
  next();
});

// Home page
router.get("/", (req, res) => {
  res.locals.title = "Home";
  res.locals.message = "Welcome to the App!";
  res.render("index");
});

// Profile page
router.get("/profile", (req, res) => {
  const userName = req.query.userName || "Guest";
  res.render("profile", { title: "Profile", userName });
});

// Swiped page
router.get("/swipe", (req, res) => {
  res.render("swipe", { title: "Swipe" });
});

// Privacy Policy page
router.get("/privacy-policy", (req, res) => {
  res.render("privacy-policy", { title: "Privacy Policy" });
});


module.exports = router;
