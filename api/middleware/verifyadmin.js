import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    if (!payload.isAdmin) {
      return res.status(403).json({ message: "You are not an admin" });
    }

    req.userId = payload.id;
    req.isAdmin = true;
    next();
  });
};