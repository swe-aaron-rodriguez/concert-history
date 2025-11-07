"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ProcessedSetlist } from "@/types/setlistfm";

export default function SetlistPage() {
  const params = useParams();
  const router = useRouter();
  const setlistId = params.id as string;

  const [setlist, setSetlist] = useState<ProcessedSetlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Check if we can use browser back
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  useEffect(() => {
    async function fetchSetlist() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/setlist/${encodeURIComponent(setlistId)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch setlist");
        }

        const data = await response.json();
        setSetlist(data.data as ProcessedSetlist);
      } catch (err) {
        console.error("Error fetching setlist:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load setlist"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSetlist();
  }, [setlistId]);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !setlist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Setlist Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "This setlist could not be found."}
          </p>
          <button
            onClick={handleBack}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {canGoBack ? 'Go Back' : 'Go to Home'}
          </button>
        </div>
      </div>
    );
  }

  const totalSongs = setlist.sets.reduce((acc, set) => acc + set.songs.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 focus:outline-none focus:underline"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {canGoBack ? 'Go Back' : 'Back to Home'}
        </button>

        {/* Main Setlist Card - "Printed Setlist" Aesthetic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-gray-200 dark:border-gray-700">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 md:p-12 border-b-4 border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                {setlist.artist.name}
              </h1>
              <div className="space-y-2 text-lg md:text-xl text-gray-700 dark:text-gray-300">
                <p className="font-semibold">{setlist.displayDate}</p>
                <p className="font-medium">{setlist.venue.name}</p>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  {setlist.venue.location}
                </p>
                {setlist.tour && (
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      <svg
                        className="w-3.5 h-3.5 mr-1.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {setlist.tour}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Setlist Body */}
          <div className="p-8 md:p-12">
            {setlist.info && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {setlist.info}
                </p>
              </div>
            )}

            {setlist.sets.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No setlist information available for this show.
              </p>
            ) : (
              <div className="space-y-8">
                {setlist.sets.map((set, setIndex) => (
                  <div key={setIndex}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                      {set.name}
                    </h2>
                    <ol className="space-y-3">
                      {set.songs.map((song, songIndex) => (
                        <li
                          key={songIndex}
                          className="flex items-start text-gray-800 dark:text-gray-200"
                        >
                          <span className="inline-block w-8 text-right mr-4 text-gray-500 dark:text-gray-400 font-mono text-sm flex-shrink-0">
                            {songIndex + 1}.
                          </span>
                          <div className="flex-1">
                            <span className="text-lg font-medium">
                              {song.name}
                            </span>
                            {song.isCover && song.coverArtist && (
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 italic">
                                ({song.coverArtist} cover)
                              </span>
                            )}
                            {song.isTape && (
                              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                TAPE
                              </span>
                            )}
                            {song.info && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-0">
                                {song.info}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-12 pt-6 border-t-2 border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                {totalSongs} song{totalSongs !== 1 ? "s" : ""} performed
              </p>
              <a
                href={setlist.artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                View on Setlist.fm
              </a>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Share this setlist:
          </p>
          <div className="inline-flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <code className="text-sm text-gray-700 dark:text-gray-300 select-all">
              {typeof window !== "undefined" ? window.location.href : ""}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
