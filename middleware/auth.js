// middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Always guarantee id exists for controllers
    req.user = {
      id: decoded.id || decoded._id,
      phone: decoded.phone,
    };

    if (!req.user.id)
      return res.status(403).json({ message: "Invalid token payload" });

    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
