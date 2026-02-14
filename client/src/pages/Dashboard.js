import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = async () => {
    try {
      const { data } = await API.get("/registrations/my-events", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user events");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  if (loading) return <Loader />;

  const today = new Date();

  const upcoming = events
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const past = events
    .filter((event) => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>My Dashboard</h2>

      {/* Upcoming Events */}
      <h3 className="section-title">Upcoming Events</h3>
      {upcoming.length === 0 ? (
        <div className="empty-state">
          <p>You have no upcoming events.</p>
        </div>
      ) : (
        upcoming.map((event) => (
          <div key={event.id} className="card" style={{ marginBottom: "15px" }}>
            <h4>{event.name}</h4>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>
        ))
      )}

      {/* Past Events */}
      <h3 className="section-title">Past Events</h3>

      {past.length === 0 ? (
        <div className="empty-state">
          <p>You have no past events yet.</p>
        </div>
      ) : (
        past.map((event) => (
          <div key={event.id} className="card" style={{ marginBottom: "15px" }}>
            <h4>{event.name}</h4>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;