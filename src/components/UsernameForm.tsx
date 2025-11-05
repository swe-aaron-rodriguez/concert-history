"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function UsernameForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate username
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a username");
      return;
    }

    if (trimmedUsername.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    // Basic sanitization - only allow alphanumeric, underscore, hyphen
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens");
      return;
    }

    setIsLoading(true);

    // Navigate to timeline page
    router.push(`/user/${encodeURIComponent(trimmedUsername)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Setlist.fm Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(""); // Clear error on input
          }}
          placeholder="Enter your username"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500 dark:border-gray-600"
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          disabled={isLoading}
          autoFocus
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          "View My Concert History"
        )}
      </button>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Don&apos;t have a Setlist.fm account?{" "}
        <a
          href="https://www.setlist.fm/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          Sign up here
        </a>
      </p>
    </form>
  );
}
