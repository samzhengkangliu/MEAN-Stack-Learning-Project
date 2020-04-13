const jwt = require("jsonwebtoken");

// For incoming requests and protecting routes
module.exports = (req, res, next) => {
  try {
    // Normally starts with "Bearer" word then space, token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: "You are not authenticated!",
    });
  }
};
