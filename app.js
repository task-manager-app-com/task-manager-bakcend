const express = require("express");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const taskRoutes = require("./routes/todoRoute");
const app = express();
const cors = require('cors');
const mysql = require("mysql2");


// Middleware
app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',        // your MySQL host
  user: 'root',             // your MySQL user
  password: '',// your MySQL password
  database: 'todo_db'  // your database name
});


db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("You successfully connected to MySQL!");
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api", taskRoutes);

module.exports = app;