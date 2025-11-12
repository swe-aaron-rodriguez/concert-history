'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ProcessedConcert } from '@/types/setlistfm';
import {
  calculateWrappedStats,
  filterConcertsByYear,
  getArtistNodes,
  calculateAwards,
  generateFestivalLineup,
  type WrappedStats,
  type ArtistNode,
  type Award,
  type FestivalLineup,
} from '@/lib/wrapped-stats';
import WrappedSlideContainer from '@/components/wrapped/WrappedSlideContainer';
import OpeningSlide from '@/components/wrapped/OpeningSlide';
import StatsOverviewSlide from '@/components/wrapped/StatsOverviewSlide';
import ArtistConstellationSlide from '@/components/wrapped/ArtistConstellationSlide';
import FestivalPosterSlide from '@/components/wrapped/FestivalPosterSlide';
import AwardsSlide from '@/components/wrapped/AwardsSlide';
import ClosingSlide from '@/components/wrapped/ClosingSlide';

const WRAPPED_YEAR = 2025;

export default function WrappedPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [concerts, setConcerts] = useState<ProcessedConcert[]>([]);
  const [stats, setStats] = useState<WrappedStats | null>(null);
  const [artistNodes, setArtistNodes] = useState<ArtistNode[]>([]);
  const [festivalLineup, setFestivalLineup] = useState<FestivalLineup | null>(null);
  const [awards, setAwards] = useState<Award[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Slide navigation
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalSlides = 6; // Opening, Stats, Constellation, Festival Poster, Awards, Closing

  // Fetch all concerts and calculate stats
  const fetchAndCalculateStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all concerts (paginated)
      const allConcerts: ProcessedConcert[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`/api/user/${username}/concerts?page=${page}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          } else if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else {
            throw new Error('Failed to fetch concerts');
          }
        }

        const data = await response.json();
        allConcerts.push(...data.data);

        hasMore = data.pagination.hasMore;
        page++;
      }

      // Filter to 2025 concerts only
      const concerts2025 = filterConcertsByYear(allConcerts, WRAPPED_YEAR);

      if (concerts2025.length === 0) {
        throw new Error(`No concerts found for ${WRAPPED_YEAR}`);
      }

      // Calculate stats
      const calculatedStats = calculateWrappedStats(concerts2025);
      const nodes = getArtistNodes(concerts2025);
      const lineup = generateFestivalLineup(nodes, username);
      const calculatedAwards = calculateAwards(concerts2025, calculatedStats);

      setConcerts(concerts2025);
      setStats(calculatedStats);
      setArtistNodes(nodes);
      setFestivalLineup(lineup);
      setAwards(calculatedAwards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchAndCalculateStats();
  }, [fetchAndCalculateStats]);

  // Navigation handlers
  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Click/tap to advance (except on interactive elements)
  const handleClick = (e: React.MouseEvent) => {
    // Don't advance if clicking on buttons or links
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button, a')) {
      return;
    }
    nextSlide();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎵</div>
          <div className="text-2xl font-bold">Loading Your Wrapped...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-pink-900 text-white p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold mb-4">Oops!</h1>
          <p className="text-xl mb-8">{error}</p>
          <button
            onClick={() => router.push(`/user/${username}`)}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors"
          >
            View Concert History
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden cursor-pointer" onClick={handleClick}>
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
        <div className="flex h-1">
          {[...Array(totalSlides)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-300 ${
                i <= currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between items-center px-4 py-2 text-white text-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/user/${username}`);
            }}
            className="hover:underline opacity-70 hover:opacity-100 transition-opacity"
          >
            ← Back to Timeline
          </button>
          <span className="opacity-70">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Slides */}
      <div className="relative w-full h-screen">
        <WrappedSlideContainer currentSlide={currentSlide} direction={direction}>
          {currentSlide === 0 && (
            <OpeningSlide username={username} totalConcerts={stats.totalConcerts} />
          )}
          {currentSlide === 1 && <StatsOverviewSlide stats={stats} />}
          {currentSlide === 2 && <ArtistConstellationSlide artistNodes={artistNodes} />}
          {currentSlide === 3 && festivalLineup && (
            <FestivalPosterSlide lineup={festivalLineup} username={username} />
          )}
          {currentSlide === 4 && <AwardsSlide awards={awards} />}
          {currentSlide === 5 && (
            <ClosingSlide username={username} totalConcerts={stats.totalConcerts} />
          )}
        </WrappedSlideContainer>
      </div>

      {/* Navigation arrows (visible on hover) */}
      <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-between px-8 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        {currentSlide > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="pointer-events-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center transition-all"
          >
            ←
          </button>
        )}
        <div className="flex-1" />
        {currentSlide < totalSlides - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="pointer-events-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center transition-all"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}
