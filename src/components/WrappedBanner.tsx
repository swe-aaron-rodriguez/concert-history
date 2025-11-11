'use client';

import Link from 'next/link';

interface WrappedBannerProps {
  username: string;
}

export default function WrappedBanner({ username }: WrappedBannerProps) {
  return (
    <Link href={`/wrapped/${username}`} className="block mb-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

        <div className="relative px-6 py-5 md:px-8 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl animate-pulse">✨</span>
                <span className="text-white font-bold text-lg md:text-xl">
                  NEW: Concert Wrapped 2025
                </span>
              </div>
              <p className="text-white/90 text-sm md:text-base">
                See your year in live music—stats, insights, and personalized awards await!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-lg transition-colors group">
              <span className="text-white font-semibold text-sm md:text-base">
                Unwrap Your Year
              </span>
              <svg
                className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
