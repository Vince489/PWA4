const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const routes = require("./routes");
const viewRoutes = require("./routes/viewsRoutes");
const connectToDB = require("./config/db");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use express layouts
app.use(expressLayouts);
app.set("layout", "layouts/default");
app.set("users", "views/users");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/v1", routes);

// Views routes
app.use("/", viewRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).render("404", { message: "Page Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Connect to the database
connectToDB();

// Export the app instance
module.exports = app;
