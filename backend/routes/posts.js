const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const PostController = require("../controllers/posts");

// POST
router.post("", checkAuth, extractFile, PostController.createPost);

// PUT
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

// GET
// Query parameters
router.get("", PostController.getPosts);

router.get("/:id", PostController.getPostById);

// DELETE
router.delete("/:id", checkAuth, PostController.deletePostById);

module.exports = router;
