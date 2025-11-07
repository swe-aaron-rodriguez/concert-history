"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const [viewMode, setViewMode] = useState<'grouped' | 'compact'>(() => {
    // Lazy initializer to read from sessionStorage on client
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('viewMode');
      if (saved === 'grouped' || saved === 'compact') {
        return saved;
      }
    }
    return 'grouped';
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  // Check if we can use browser back
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  // Persist view mode selection to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Restore scroll position when returning to this page
  useEffect(() => {
    const savedScrollKey = `scroll-${username}`;
    const savedScroll = sessionStorage.getItem(savedScrollKey);

    if (savedScroll) {
      const scrollPosition = parseInt(savedScroll, 10);
      // Wait for content to render before scrolling
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        // Clear the saved position after restoring
        sessionStorage.removeItem(savedScrollKey);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [username, concerts]);

  // Save scroll position before navigating away
  const handleConcertClick = (concertId: string) => {
    const savedScrollKey = `scroll-${username}`;
    sessionStorage.setItem(savedScrollKey, window.scrollY.toString());
    router.push(`/setlist/${concertId}`);
  };

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

  // Group concerts by date
  const groupConcertsByDate = (concerts: ProcessedConcert[]) => {
    const grouped: Record<string, ProcessedConcert[]> = {};
    concerts.forEach((concert) => {
      const dateKey = concert.displayDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(concert);
    });
    return grouped;
  };

  const groupedFilteredConcerts = groupConcertsByDate(filteredConcerts);

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

        {/* View Mode Selector */}
        <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            View Mode:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Grouped Cards
              </div>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'compact'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Compact List
              </div>
            </button>
          </div>
        </div>

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

            {/* Grouped Cards View (Pattern 5) */}
            {viewMode === 'grouped' && (
              <div className="space-y-8">
                {Object.entries(groupedFilteredConcerts).map(([date, concerts]) => (
                  <div key={date}>
                    <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-t-lg inline-flex items-center gap-2 text-sm font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {date} ({concerts.length} show{concerts.length > 1 ? "s" : ""})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-blue-600 dark:border-blue-700 border-t-0 rounded-b-lg p-4 bg-blue-50 dark:bg-gray-800">
                      {concerts.map((concert) => (
                        <ConcertCard key={concert.id} concert={concert} onClick={handleConcertClick} hideDate={true} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Compact List View (Pattern 3) */}
            {viewMode === 'compact' && (
              <div className="space-y-6">
                {Object.entries(groupedFilteredConcerts).map(([date, concerts]) => (
                  <div key={date}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                          {date}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-300 dark:from-gray-600 dark:via-gray-600 to-transparent"></div>
                    </div>
                    <div className="space-y-2 pl-4">
                      {concerts.map((concert) => (
                        <Link
                          key={concert.id}
                          href={`/setlist/${concert.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleConcertClick(concert.id);
                          }}
                          className="flex items-start gap-3 py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors group"
                        >
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <div className="flex-1">
                            <div className="flex items-baseline flex-wrap gap-2">
                              <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {concert.artist.name}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">@</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {concert.venue.name}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {concert.venue.location}
                            </div>
                            {concert.tour && (
                              <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                {concert.tour}
                              </div>
                            )}
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

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
