"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { bookmarksAPI } from "../../lib/api";
import SearchBar from "../components/SearchBar";
import TagInput from "../components/TagInput";
import LoadingSpinner from "../components/LoadingSpinner";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTags, setFilterTags] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: [],
    isFavorite: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user, searchQuery, filterTags, showFavorites]);

  useEffect(() => {
    // Check if we should show create form
    if (searchParams.get("action") === "create") {
      setShowCreateForm(true);
    }
  }, [searchParams]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (filterTags.length > 0) params.tags = filterTags.join(",");
      if (showFavorites) params.favorites = "true";

      const response = await bookmarksAPI.getAll(params);
      setBookmarks(response.data.bookmarks);
    } catch (error) {
      setError("Failed to fetch bookmarks");
      console.error("Fetch bookmarks error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBookmark) {
        await bookmarksAPI.update(editingBookmark._id, formData);
      } else {
        await bookmarksAPI.create(formData);
      }

      resetForm();
      fetchBookmarks();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save bookmark");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      try {
        await bookmarksAPI.delete(id);
        fetchBookmarks();
      } catch (error) {
        setError("Failed to delete bookmark");
      }
    }
  };

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      tags: bookmark.tags,
      isFavorite: bookmark.isFavorite,
    });
    setShowCreateForm(true);
  };

  const toggleFavorite = async (bookmark) => {
    try {
      await bookmarksAPI.update(bookmark._id, {
        ...bookmark,
        isFavorite: !bookmark.isFavorite,
      });
      fetchBookmarks();
    } catch (error) {
      setError("Failed to update favorite status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      description: "",
      tags: [],
      isFavorite: false,
    });
    setEditingBookmark(null);
    setShowCreateForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          Add New Bookmark
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search bookmarks..."
          className="w-full"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by tags:
            </label>
            <TagInput
              tags={filterTags}
              onChange={setFilterTags}
              placeholder="Add tags to filter..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFavorites}
                onChange={(e) => setShowFavorites(e.target.checked)}
                className="mr-2"
              />
              Show favorites only
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {editingBookmark ? "Edit Bookmark" : "Add New Bookmark"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                value={formData.url}
                onChange={handleChange}
                className="input mt-1"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Leave empty to auto-fetch from URL"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="textarea mt-1"
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <TagInput
                tags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tags..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFavorite"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
                className="mr-2"
              />
              <label
                htmlFor="isFavorite"
                className="text-sm font-medium text-gray-700"
              >
                Mark as favorite
              </label>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn btn-primary">
                {editingBookmark ? "Update Bookmark" : "Add Bookmark"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookmarks List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No bookmarks found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterTags.length > 0 || showFavorites
              ? "Try adjusting your search or filters"
              : "Add your first bookmark to get started"}
          </p>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              Add Your First Bookmark
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark._id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                    {bookmark.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getDomainFromUrl(bookmark.url)}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(bookmark)}
                  className={`text-xl ml-2 ${
                    bookmark.isFavorite ? "text-yellow-500" : "text-gray-300"
                  } hover:text-yellow-500`}
                >
                  ⭐
                </button>
              </div>

              {bookmark.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {bookmark.description}
                </p>
              )}

              {bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {bookmark.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                {bookmark.updatedAt !== bookmark.createdAt && (
                  <span>
                    Updated {new Date(bookmark.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-sm flex-1 text-center"
                >
                  Visit
                </a>
                <button
                  onClick={() => handleEdit(bookmark)}
                  className="btn btn-outline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bookmark._id)}
                  className="btn btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
