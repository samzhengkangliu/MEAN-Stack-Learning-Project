const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow CORS(Cross-origin resource sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// POST
app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post fetched sucessfully."
  });
});

// GET
app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "hadhi124",
      title: "First server post",
      content: "hahaha from the server"
    },
    {
      id: "aofiy385",
      title: "Second server post",
      content: "hehehe from the server"
    }
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts
  });
});

module.exports = app;
