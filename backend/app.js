const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

// Connect to MangoDB
mongoose
  .connect(
    "mongodb+srv://sam:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-gmhhm.mongodb.net/node-angular?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/", express.static(path.join(__dirname, "angular")));

// Allow CORS(Cross-origin resource sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// filter for requests going to api/posts
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "angular", "index.html"));
// });

module.exports = app;
