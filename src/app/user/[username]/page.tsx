"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ProcessedConcert } from "@/types/setlistfm";
import ConcertCard from "@/components/ConcertCard";
import YearFilter from "@/components/YearFilter";
import { TimelineLoadingSkeleton } from "@/components/ConcertSkeleton";

export default function UserTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [concerts, setConcerts] = useState<ProcessedConcert[]>([]);
  const [filteredConcerts, setFilteredConcerts] = useState<ProcessedConcert[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Check if we can use browser back
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  // Fetch concerts for a specific page
  const fetchConcertsPage = useCallback(async (page: number) => {
    const isFirstPage = page === 1;

    if (isFirstPage) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setError(null);

    try {
      const response = await fetch(
        `/api/user/${encodeURIComponent(username)}/concerts?page=${page}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch concerts");
      }

      const data = await response.json();
      const newConcerts = data.data as ProcessedConcert[];
      const pagination = data.pagination;

      // Update concerts list
      setConcerts((prev) => {
        const combined = page === 1 ? newConcerts : [...prev, ...newConcerts];

        // Extract unique years
        const years = Array.from(
          new Set(combined.map((c) => c.year))
        ).sort((a, b) => b - a);
        setAvailableYears(years);

        return combined;
      });

      // Update pagination state
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
      setTotal(pagination.total);
      setHasMore(pagination.hasMore);

      console.log('[Fetch] Page loaded:', {
        page: pagination.currentPage,
        total: pagination.total,
        totalPages: pagination.totalPages,
        hasMore: pagination.hasMore,
        concertsLoaded: newConcerts.length,
      });

    } catch (err) {
      console.error("Error fetching concerts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load concerts"
      );
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [username]);

  // Initial load
  useEffect(() => {
    fetchConcertsPage(1);
  }, [fetchConcertsPage]);

  // Filter concerts by year
  useEffect(() => {
    if (selectedYear === null) {
      setFilteredConcerts(concerts);
    } else {
      setFilteredConcerts(concerts.filter((c) => c.year === selectedYear));
    }
  }, [selectedYear, concerts]);

  // Infinite scroll observer
  useEffect(() => {
    // Only set up observer when we're not filtering by year and there are more pages
    if (selectedYear !== null || !hasMore) {
      console.log('[Infinite Scroll] Skipping observer setup:', { selectedYear, hasMore });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        console.log('[Infinite Scroll] Observer triggered:', {
          isIntersecting: first.isIntersecting,
          hasMore,
          isLoadingMore,
          isLoading,
          currentPage,
          totalPages,
        });

        if (first.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          console.log('[Infinite Scroll] Loading next page:', currentPage + 1);
          fetchConcertsPage(currentPage + 1);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    // Wait a bit for the DOM to render
    const timeoutId = setTimeout(() => {
      const currentTarget = observerTarget.current;
      if (currentTarget) {
        console.log('[Infinite Scroll] Observing target');
        observer.observe(currentTarget);
      } else {
        console.log('[Infinite Scroll] No target to observe after timeout');
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, currentPage, totalPages, selectedYear, fetchConcertsPage]);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (isLoading && currentPage === 1) {
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

  if (concerts.length === 0 && !isLoading) {
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
            {total} concert{total !== 1 ? "s" : ""} attended
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
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

            {/* Infinite scroll trigger - only shown when not filtering by year */}
            {!selectedYear && hasMore && (
              <div
                ref={observerTarget}
                className="flex justify-center py-8 min-h-[60px]"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Loading more concerts...
                  </div>
                ) : (
                  <div className="h-1 w-1 opacity-0">
                    {/* Invisible element to trigger observer */}
                  </div>
                )}
              </div>
            )}

            {/* End of results message */}
            {!selectedYear && !hasMore && concerts.length > 0 && (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <p className="text-sm">
                  🎵 You&apos;ve reached the end! All {total} concerts loaded.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
