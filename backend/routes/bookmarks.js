const express = require("express");
const { body } = require("express-validator");
const {
  getBookmarks,
  getBookmark,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} = require("../controllers/bookmarksController");
const auth = require("../middleware/auth");

const router = express.Router();

// Validation rules
const bookmarkValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("url")
    .trim()
    .notEmpty()
    .withMessage("URL is required")
    .isURL({ protocols: ["http", "https"] })
    .withMessage("Please enter a valid URL starting with http:// or https://"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each tag cannot exceed 50 characters"),
  body("isFavorite")
    .optional()
    .isBoolean()
    .withMessage("isFavorite must be a boolean"),
];

// Apply auth middleware to all routes
router.use(auth);

// Routes
router.get("/", getBookmarks);
router.get("/:id", getBookmark);
router.post("/", bookmarkValidation, createBookmark);
router.put("/:id", bookmarkValidation, updateBookmark);
router.delete("/:id", deleteBookmark);

module.exports = router;
