const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: "No token" });
  try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Make sure decoded contains _id
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};