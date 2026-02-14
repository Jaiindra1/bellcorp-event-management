const express = require("express");
const db = require("../database/database");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* --------------------------------------------------
   GET ALL EVENTS (Search + Filter + Pagination)
--------------------------------------------------- */
router.get("/", (req, res) => {
  const { search, category, location, date, page = 1, limit = 6 } = req.query;

  let query = `
    SELECT events.*,
      (events.capacity - COUNT(registrations.id)) AS availableSeats
    FROM events
    LEFT JOIN registrations 
      ON events.id = registrations.event_id
    WHERE 1=1
  `;

  let params = [];

  if (search) {
    query += " AND (events.name LIKE ? OR events.organizer LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += " AND events.category = ?";
    params.push(category);
  }

  if (location) {
    query += " AND events.location = ?";
    params.push(location);
  }

  if (date) {
    query += " AND DATE(events.date) = DATE(?)";
    params.push(date);
  }

  query += `
    GROUP BY events.id
    ORDER BY events.date ASC
    LIMIT ? OFFSET ?
  `;

  const offset = (page - 1) * limit;
  params.push(Number(limit), Number(offset));

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

/* --------------------------------------------------
   GET SINGLE EVENT DETAILS
--------------------------------------------------- */
router.get("/:id", (req, res) => {
  const eventId = req.params.id;

  const query = `
    SELECT events.*,
      (events.capacity - COUNT(registrations.id)) AS availableSeats
    FROM events
    LEFT JOIN registrations 
      ON events.id = registrations.event_id
    WHERE events.id = ?
    GROUP BY events.id
  `;

  db.get(query, [eventId], (err, event) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  });
});

/* --------------------------------------------------
   CREATE EVENT (Protected - optional admin)
--------------------------------------------------- */
router.post("/", protect, (req, res) => {
  const {
    name,
    organizer,
    location,
    date,
    description,
    capacity,
    category,
  } = req.body;

  if (!name || !date || !capacity) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  db.run(
    `INSERT INTO events 
    (name, organizer, location, date, description, capacity, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, organizer, location, date, description, capacity, category],
    function (err) {
      if (err)
        return res.status(500).json({ message: "Event creation failed" });

      res.status(201).json({
        message: "Event created successfully",
        eventId: this.lastID,
      });
    }
  );
});

module.exports = router;