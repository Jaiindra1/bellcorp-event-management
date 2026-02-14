import { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";


const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
       const { data } = await API.get("/events", {
        params: { search, category, location, page },
      });
      setEvents(data);
    } catch (error) {
      console.log("Error fetching events");
    }
    setLoading(false);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, location]);

  useEffect(() => {
    fetchEvents();
  }, [search, category, location, page]);

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Explore Events</h2>

      {/* Filters */}
      <div style={{ marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Business">Business</option>
        </select>

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
  <Loader />
        ) : events.length === 0 ? (
          <div className="empty-state">
            <h3>No events found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

      {/* Pagination */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          className="btn-secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 15px" }}>Page {page}</span>

        <button
          className="btn-secondary"
          disabled={events.length === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Events;