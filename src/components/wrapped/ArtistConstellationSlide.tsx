'use client';

import { motion } from 'framer-motion';
import { ArtistNode } from '@/lib/wrapped-stats';
import { useState, useEffect } from 'react';

interface ArtistConstellationSlideProps {
  artistNodes: ArtistNode[];
}

export default function ArtistConstellationSlide({ artistNodes }: ArtistConstellationSlideProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Take top 10 artists on mobile, 12 on desktop
  const maxArtists = isMobile ? 10 : 12;
  const topArtists = artistNodes.slice(0, maxArtists);

  // Calculate bubble size based on count and screen size
  const getSizeForCount = (count: number, maxCount: number) => {
    const minSize = isMobile ? 50 : 60;
    const maxSize = isMobile ? 120 : 160;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const maxCount = Math.max(...topArtists.map(a => a.count));

  // Generate positions in a circular constellation pattern
  const getPosition = (index: number, total: number) => {
    const radius = 35; // Percentage from center
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-8 overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8"
        >
          Your Artist Constellation
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-lg opacity-80 mb-12"
        >
          The artists that defined your 2025
        </motion.p>

        {/* Constellation */}
        <div className="relative w-full aspect-square max-w-2xl md:max-w-3xl mx-auto flex items-center justify-center">
          <div className="absolute inset-0">
            {topArtists.map((artist, index) => {
              const position = getPosition(index, topArtists.length);
              const size = getSizeForCount(artist.count, maxCount);

              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.6,
                    type: 'spring',
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                >
                {/* Connecting line to center */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="absolute top-1/2 right-1/2 h-px bg-gradient-to-r from-purple-400/50 to-transparent origin-right"
                  style={{
                    width: `${Math.sqrt(
                      Math.pow(50 - position.x, 2) + Math.pow(50 - position.y, 2)
                    )}%`,
                    transform: `rotate(${
                      Math.atan2(50 - position.y, 50 - position.x) * (180 / Math.PI)
                    }deg)`,
                  }}
                />

                {/* Artist bubble */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/70 transition-all">
                  <div className="text-center p-2">
                    <div className="font-bold text-sm md:text-base mb-1 line-clamp-2">
                      {artist.name}
                    </div>
                    <div className="text-xs opacity-90">
                      {artist.count} {artist.count === 1 ? 'show' : 'shows'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

            {/* Center glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-radial from-purple-400 to-transparent blur-3xl"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-center mt-12 text-sm opacity-60"
        >
          <p>Tap or press → to continue</p>
        </motion.div>
      </div>
    </div>
  );
}
