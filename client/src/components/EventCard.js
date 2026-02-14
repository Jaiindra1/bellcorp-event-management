import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="card">
      <h3>{event.name}</h3>
      <p><strong>Organizer:</strong> {event.organizer}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Available Seats:</strong> {event.availableSeats}</p>

      <Link to={`/event/${event.id}`}>
        <button className="btn-primary">View Details</button>
      </Link>
    </div>
  );
};

export default EventCard;