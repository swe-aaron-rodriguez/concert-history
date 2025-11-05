"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ProcessedConcert } from "@/types/setlistfm";
import ConcertCard from "@/components/ConcertCard";
import YearFilter from "@/components/YearFilter";
import { TimelineLoadingSkeleton } from "@/components/ConcertSkeleton";

export default function UserTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [concerts, setConcerts] = useState<ProcessedConcert[]>([]);
  const [filteredConcerts, setFilteredConcerts] = useState<ProcessedConcert[]>(
    []
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Check if we can use browser back
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  useEffect(() => {
    async function fetchConcerts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/user/${encodeURIComponent(username)}/concerts`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch concerts");
        }

        const data = await response.json();
        const concertData = data.data as ProcessedConcert[];

        setConcerts(concertData);
        setFilteredConcerts(concertData);

        // Extract unique years
        const years = Array.from(
          new Set(concertData.map((c) => c.year))
        ).sort((a, b) => b - a);
        setAvailableYears(years);
      } catch (err) {
        console.error("Error fetching concerts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load concerts"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchConcerts();
  }, [username]);

  useEffect(() => {
    if (selectedYear === null) {
      setFilteredConcerts(concerts);
    } else {
      setFilteredConcerts(concerts.filter((c) => c.year === selectedYear));
    }
  }, [selectedYear, concerts]);

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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
          <TimelineLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
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
            Oops!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
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

  if (concerts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Concerts Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            User <span className="font-semibold">{username}</span> hasn&apos;t
            marked any concerts as attended on Setlist.fm yet.
          </p>
          <button
            onClick={handleBack}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {canGoBack ? 'Go Back' : 'Try Another User'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 focus:outline-none focus:underline"
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {username}&apos;s Concert History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {concerts.length} concert{concerts.length !== 1 ? "s" : ""} attended
          </p>
        </div>

        <YearFilter
          years={availableYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />

        {filteredConcerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No concerts found for {selectedYear}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredConcerts.length} concert
              {filteredConcerts.length !== 1 ? "s" : ""}
              {selectedYear && ` from ${selectedYear}`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredConcerts.map((concert) => (
                <ConcertCard key={concert.id} concert={concert} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
