import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{
      background: "#111827",
      padding: "15px 0",
      color: "white"
    }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
            Bellcorp Events
          </Link>
        </div>

        <div>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: "white", marginRight: "15px" }}>
                Dashboard
              </Link>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "white", marginRight: "15px" }}>
                Login
              </Link>
              <Link to="/register" style={{ color: "white" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;