const express = require("express");
const bodyParser = require("body-parser");
const taskRoutes = require("./routes/todoRoute");
const app = express();
const cors = require('cors');
const mysql = require("mysql2");

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_db'
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