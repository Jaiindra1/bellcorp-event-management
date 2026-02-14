const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./database/database");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const eventRoutes = require("./routes/eventRoutes");


dotenv.config();

const app = express();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: ["https://bellcorp-event-management-kappa.vercel.app"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// --------------------
// Database Initialization
// --------------------
db.serialize(() => {
  console.log("Initializing database...");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      organizer TEXT,
      location TEXT,
      date TEXT,
      description TEXT,
      capacity INTEGER,
      category TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      event_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(event_id) REFERENCES events(id),
      UNIQUE(user_id, event_id)
    )
  `);

  console.log("Database tables ready.");
});

// --------------------
// Basic Test Route
// --------------------
app.get("/", (req, res) => {
  res.json({ message: "Bellcorp Event Management API Running" });
});

// --------------------
// Sample Events Route (Temporary)
// --------------------
app.get("/api/events", (req, res) => {
  const { search, category, location } = req.query;

  let query = "SELECT * FROM events WHERE 1=1";
  let params = [];

  if (search) {
    query += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (location) {
    query += " AND location = ?";
    params.push(location);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(rows);
  });
});

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/events", eventRoutes);


