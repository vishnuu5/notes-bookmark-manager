"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./components/AuthProvider";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({ notes: 0, bookmarks: 0 });

  useEffect(() => {
    if (user) {
      // Fetch user stats
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [notesRes, bookmarksRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes?limit=1`, {
          headers,
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks?limit=1`, {
          headers,
        }),
      ]);

      const notesData = await notesRes.json();
      const bookmarksData = await bookmarksRes.json();

      setStats({
        notes: notesData.pagination?.total || 0,
        bookmarks: bookmarksData.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Personal Notes & Bookmark Manager
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize your thoughts and favorite links in one place. Create,
            search, and manage your personal notes and bookmarks with ease.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card text-left">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Smart Notes</h3>
              <p className="text-gray-600">
                Create rich notes with tags, search through content, and mark
                your favorites for quick access.
              </p>
            </div>

            <div className="card text-left">
              <div className="text-3xl mb-4">🔖</div>
              <h3 className="text-xl font-semibold mb-2">Bookmark Manager</h3>
              <p className="text-gray-600">
                Save important links with automatic title fetching, organize
                with tags, and never lose a valuable resource.
              </p>
            </div>
          </div>

          <div className="space-x-4">
            <Link href="/auth/login" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/auth/register" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-600">
          Manage your notes and bookmarks from your dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notes</p>
              <p className="text-3xl font-bold text-primary-600">
                {stats.notes}
              </p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
          <br></br>
          <Link href="/notes" className="btn btn-primary mt-4 w-full">
            Manage Notes
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookmarks
              </p>
              <p className="text-3xl font-bold text-primary-600">
                {stats.bookmarks}
              </p>
            </div>
            <div className="text-4xl">🔖</div>
          </div>
          <br></br>
          <Link href="/bookmarks" className="btn btn-primary mt-4 w-full">
            Manage Bookmarks
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/notes?action=create"
            className="btn btn-outline text-left p-4"
          >
            <div className="text-2xl mb-2">✏️</div>
            <div className="font-medium">Create New Note</div>
            <div className="text-sm text-gray-600">
              Start writing your thoughts
            </div>
          </Link>

          <Link
            href="/bookmarks?action=create"
            className="btn btn-outline text-left p-4"
          >
            <div className="text-2xl mb-2">🔗</div>
            <div className="font-medium">Add Bookmark</div>
            <div className="text-sm text-gray-600">Save an important link</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
