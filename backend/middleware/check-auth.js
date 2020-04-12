const jwt = require("jsonwebtoken");

// For incoming requests and protecting routes
module.exports = (req, res, next) => {
  try {
    // Normally starts with "Bearer" word then space, token
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_this_should_be_longer");
    next();
  } catch (error) {
      res.status(401).json({
        message: "Auth failed!"
      });
  }
};
