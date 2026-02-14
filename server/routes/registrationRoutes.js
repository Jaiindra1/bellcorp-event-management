const express = require("express");
const db = require("../database/database");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ----------------------------
// Register for Event
// ----------------------------
router.post("/:eventId", protect, (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  // 1️⃣ Check if event exists
  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, event) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2️⃣ Check if already registered
    db.get(
      "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?",
      [userId, eventId],
      (err, existingRegistration) => {
        if (existingRegistration) {
          return res
            .status(400)
            .json({ message: "Already registered for this event" });
        }

        // 3️⃣ Check capacity
        db.get(
          "SELECT COUNT(*) as count FROM registrations WHERE event_id = ?",
          [eventId],
          (err, result) => {
            if (result.count >= event.capacity) {
              return res.status(400).json({ message: "Event is full" });
            }

            // 4️⃣ Register user
            db.run(
              "INSERT INTO registrations (user_id, event_id) VALUES (?, ?)",
              [userId, eventId],
              function (err) {
                if (err)
                  return res
                    .status(500)
                    .json({ message: "Registration failed" });

                res.status(201).json({
                  message: "Successfully registered for event",
                });
              }
            );
          }
        );
      }
    );
  });
});

// ----------------------------
// Cancel Registration
// ----------------------------
router.delete("/:eventId", protect, (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  db.run(
    "DELETE FROM registrations WHERE user_id = ? AND event_id = ?",
    [userId, eventId],
    function (err) {
      if (err)
        return res.status(500).json({ message: "Cancellation failed" });

      if (this.changes === 0) {
        return res
          .status(400)
          .json({ message: "You are not registered for this event" });
      }

      res.json({ message: "Registration cancelled successfully" });
    }
  );
});

// ----------------------------
// Get Logged-in User Registrations
// ----------------------------
router.get("/my-events", protect, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT events.*
    FROM registrations
    JOIN events ON registrations.event_id = events.id
    WHERE registrations.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });

    res.json(rows);
  });
});

module.exports = router;