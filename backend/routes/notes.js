const express = require("express");
const { body } = require("express-validator");
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const auth = require("../middleware/auth");

const router = express.Router();

// Validation rules
const noteValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 10000 })
    .withMessage("Content cannot exceed 10000 characters"),
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
router.get("/", getNotes);
router.get("/:id", getNote);
router.post("/", noteValidation, createNote);
router.put("/:id", noteValidation, updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
