const jwt = require("jsonwebtoken");
const db = require("../database/database");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.get(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
      }
    );
  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};

module.exports = protect;