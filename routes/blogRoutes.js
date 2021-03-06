const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { requireAuth } = require("../middleware/middleware.js");

router.get("/create", requireAuth, blogController.blog_create_get); //   localhost:8080//blogs/create

router.get("/", blogController.blog_index); //      localhost:8080//blogs/

router.post("/", requireAuth, blogController.blog_create_post); //      localhost:8080//blogs/

router.get("/:id", blogController.blog_details); //     localhost:8080//blogs/27317176

router.delete("/:id", requireAuth, blogController.blog_delete); //   localhost:8080//blogs/099765

module.exports = router;
