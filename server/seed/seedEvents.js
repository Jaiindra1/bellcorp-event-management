const db = require("../database/database");

const events = [
  {
    name: "React Conference 2026",
    organizer: "Bellcorp Tech",
    location: "Hyderabad",
    date: "2026-05-10",
    description: "Full-day React developer conference.",
    capacity: 100,
    category: "Tech",
  },
  {
    name: "Startup Networking Meetup",
    organizer: "Innovators Hub",
    location: "Bangalore",
    date: "2026-04-20",
    description: "Meet founders and investors.",
    capacity: 50,
    category: "Business",
  },
  {
    name: "AI & Machine Learning Summit",
    organizer: "Future Labs",
    location: "Chennai",
    date: "2026-06-15",
    description: "AI trends and research discussion.",
    capacity: 150,
    category: "Tech",
  },
];

db.serialize(() => {
  events.forEach((event) => {
    db.run(
      `INSERT INTO events 
      (name, organizer, location, date, description, capacity, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.name,
        event.organizer,
        event.location,
        event.date,
        event.description,
        event.capacity,
        event.category,
      ]
    );
  });

  console.log("Events seeded successfully.");
});