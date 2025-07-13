const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Bookmark title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      match: [
        /^https?:\/\/.+/,
        "Please enter a valid URL starting with http:// or https://",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favicon: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
bookmarkSchema.index({ title: "text", description: "text" });
bookmarkSchema.index({ user: 1, createdAt: -1 });
bookmarkSchema.index({ user: 1, tags: 1 });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
