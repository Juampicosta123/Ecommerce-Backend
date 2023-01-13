const express = require("express");
const { createBlog, getAllBlogs, updateBlog, deleteBlog, getBlog } = require("../controller/blogCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);

router.put("/:id", authMiddleware, isAdmin, updateBlog);

router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

router.get("/:id", authMiddleware, isAdmin, getBlog);

router.get("/", authMiddleware, isAdmin, getAllBlogs);

module.exports = router;