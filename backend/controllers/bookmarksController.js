const { validationResult } = require("express-validator");
const Bookmark = require("../models/Bookmark");
const { fetchUrlMetadata } = require("../utils/urlMetadata");

// Get all bookmarks for user
const getBookmarks = async (req, res) => {
  try {
    const { q, tags, favorites } = req.query;
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: req.user._id };

    // Search functionality
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { url: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Filter by favorites
    if (favorites === "true") {
      query.isFavorite = true;
    }

    const bookmarks = await Bookmark.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bookmark.countDocuments(query);

    res.json({
      bookmarks,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ message: "Server error while fetching bookmarks" });
  }
};

// Get single bookmark
const getBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json(bookmark);
  } catch (error) {
    console.error("Get bookmark error:", error);
    res.status(500).json({ message: "Server error while fetching bookmark" });
  }
};

// Create bookmark
const createBookmark = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    let { title, url, description, tags, isFavorite } = req.body;

    // Auto-fetch metadata if title is empty
    if (!title || title.trim() === "") {
      try {
        const metadata = await fetchUrlMetadata(url);
        title = metadata.title;
        if (!description) description = metadata.description;
      } catch (error) {
        console.error("Error fetching metadata:", error);
        title = new URL(url).hostname;
      }
    }

    const bookmark = new Bookmark({
      title,
      url,
      description: description || "",
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user._id,
    });

    await bookmark.save();

    res.status(201).json({
      message: "Bookmark created successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Create bookmark error:", error);
    res.status(500).json({ message: "Server error while creating bookmark" });
  }
};

// Update bookmark
const updateBookmark = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, url, description, tags, isFavorite } = req.body;

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, url, description, tags, isFavorite },
      { new: true, runValidators: true }
    );

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({
      message: "Bookmark updated successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Update bookmark error:", error);
    res.status(500).json({ message: "Server error while updating bookmark" });
  }
};

// Delete bookmark
const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    res.status(500).json({ message: "Server error while deleting bookmark" });
  }
};

module.exports = {
  getBookmarks,
  getBookmark,
  createBookmark,
  updateBookmark,
  deleteBookmark,
};
