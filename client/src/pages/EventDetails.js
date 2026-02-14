import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchEvent = useCallback(async () => {
  try {
    const { data } = await API.get(`/events/${id}`);
    setEvent(data);
    setLoading(false);
  } catch (error) {
    console.log("Error fetching event");
    setLoading(false);
  }
}, [id]);

  const checkRegistration = useCallback(async () => {
  if (!user) return;

  try {
    const { data } = await API.get("/registrations/my-events", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const registered = data.some((e) => e.id === Number(id));
    setIsRegistered(registered);
  } catch (error) {
    console.log("Error checking registration");
  }
}, [user, id]);

  useEffect(() => {
  fetchEvent();
  checkRegistration();
}, [fetchEvent, checkRegistration]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await API.post(
        `/registrations/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Registered successfully");
      fetchEvent();
      setIsRegistered(true);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleCancel = async () => {
    try {
      await API.delete(`/registrations/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Registration cancelled");
      fetchEvent();
      setIsRegistered(false);
    } catch (error) {
      alert("Cancellation failed");
    }
  };

  if (loading) return <Loader />;
  if (!event)
  return (
    <div className="empty-state">
      <h3>Event not found</h3>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>{event.name}</h2>
      <p><strong>Organizer:</strong> {event.organizer}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Available Seats:</strong> {event.availableSeats}</p>

      {user ? (
        isRegistered ? (
          <button onClick={handleCancel} style={{ background: "red", color: "white" }}>
            Cancel Registration
          </button>
        ) : event.availableSeats > 0 ? (
          <button onClick={handleRegister} style={{ background: "blue", color: "white" }}>
            Register Now
          </button>
        ) : (
          <p style={{ color: "red" }}>Event is Sold Out</p>
        )
      ) : (
        <button onClick={() => navigate("/login")}>
          Login to Register
        </button>
      )}
    </div>
  );
};

export default EventDetails;
