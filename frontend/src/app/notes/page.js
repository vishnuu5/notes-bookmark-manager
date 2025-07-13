"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { notesAPI } from "../../lib/api";
import SearchBar from "../components/SearchBar";
import TagInput from "../components/TagInput";
import LoadingSpinner from "../components/LoadingSpinner";

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTags, setFilterTags] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
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
      fetchNotes();
    }
  }, [user, searchQuery, filterTags, showFavorites]);

  useEffect(() => {
    // Check if we should show create form
    if (searchParams.get("action") === "create") {
      setShowCreateForm(true);
    }
  }, [searchParams]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (filterTags.length > 0) params.tags = filterTags.join(",");
      if (showFavorites) params.favorites = "true";

      const response = await notesAPI.getAll(params);
      setNotes(response.data.notes);
    } catch (error) {
      setError("Failed to fetch notes");
      console.error("Fetch notes error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await notesAPI.update(editingNote._id, formData);
      } else {
        await notesAPI.create(formData);
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save note");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await notesAPI.delete(id);
        fetchNotes();
      } catch (error) {
        setError("Failed to delete note");
      }
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags,
      isFavorite: note.isFavorite,
    });
    setShowCreateForm(true);
  };

  const toggleFavorite = async (note) => {
    try {
      await notesAPI.update(note._id, {
        ...note,
        isFavorite: !note.isFavorite,
      });
      fetchNotes();
    } catch (error) {
      setError("Failed to update favorite status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: [],
      isFavorite: false,
    });
    setEditingNote(null);
    setShowCreateForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          Create New Note
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search notes..."
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
            {editingNote ? "Edit Note" : "Create New Note"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                required
                value={formData.title}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={6}
                value={formData.content}
                onChange={handleChange}
                className="textarea mt-1"
                placeholder="Write your note content here..."
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
                {editingNote ? "Update Note" : "Create Note"}
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

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No notes found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterTags.length > 0 || showFavorites
              ? "Try adjusting your search or filters"
              : "Create your first note to get started"}
          </p>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              Create Your First Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {note.title}
                </h3>
                <button
                  onClick={() => toggleFavorite(note)}
                  className={`text-xl ${
                    note.isFavorite ? "text-yellow-500" : "text-gray-300"
                  } hover:text-yellow-500`}
                >
                  ⭐
                </button>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                {note.updatedAt !== note.createdAt && (
                  <span>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="btn btn-outline text-sm flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="btn btn-danger text-sm flex-1"
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
