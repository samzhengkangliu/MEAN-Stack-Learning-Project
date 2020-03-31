const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// import postModel schema
const Post = require("./models/post");

const app = express();

// Connect to MangoDB
mongoose
  .connect(
    "mongodb+srv://sam:ei2ymdqnJjzsPfVp@cluster0-gmhhm.mongodb.net/node-angular?retryWrites=true&w=majority",
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
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added sucessfully.",
      postId: createdPost._id
    });
  });
  
});

// GET
app.get("/api/posts", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

// DELETE
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;
