'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FestivalLineup } from '@/lib/wrapped-stats';

interface FestivalPosterSlideProps {
  lineup: FestivalLineup;
  username: string;
}

type PosterStyle = 'modern' | 'vintage' | 'minimalist';

interface Template {
  style: PosterStyle;
  label: string;
  description: string;
  gradient: string;
}

const TEMPLATES: Template[] = [
  {
    style: 'modern',
    label: 'Modern',
    description: 'Bold gradient festival style',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    style: 'vintage',
    label: 'Vintage',
    description: 'Classic 70s poster aesthetic',
    gradient: 'linear-gradient(180deg, #f4e4c1 0%, #e8d4a8 100%)',
  },
  {
    style: 'minimalist',
    label: 'Minimalist',
    description: 'Clean, modern typography',
    gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
  },
];

export default function FestivalPosterSlide({ lineup, username }: FestivalPosterSlideProps) {
  const [selectedStyle, setSelectedStyle] = useState<PosterStyle>('modern');
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper to build API URL with lineup data
  const buildPosterUrl = (size: 'full' | 'preview' | 'thumbnail') => {
    // Get all artist names in order (headliners, sub-headliners, lineup)
    const allArtists = [
      ...lineup.headliners,
      ...lineup.subHeadliners,
      ...lineup.lineup,
    ].map(artist => artist.name);

    // URL encode artist names as comma-separated list
    const artistsParam = encodeURIComponent(allArtists.join(','));

    return `/api/wrapped/${username}/poster?style=${selectedStyle}&size=${size}&artists=${artistsParam}&total=${lineup.totalArtists}`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const filename = `${username}-festival-2025-${selectedStyle}`
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase();

      const response = await fetch(buildPosterUrl('full'));

      if (!response.ok) {
        throw new Error('Failed to generate poster');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading poster:', error);
      alert('Failed to download poster. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedTemplate = TEMPLATES.find((t) => t.style === selectedStyle)!;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          Your Personal Festival
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-lg opacity-80 mb-12"
        >
          All the artists you saw in 2025, as a festival lineup
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Style selection */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-semibold mb-4"
            >
              Choose Your Style
            </motion.h3>

            <div className="space-y-3">
              {TEMPLATES.map((template, index) => (
                <motion.button
                  key={template.style}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStyle(template.style);
                  }}
                  className={`w-full p-4 rounded-lg transition-all text-left ${
                    selectedStyle === template.style
                      ? 'bg-white/20 ring-2 ring-white scale-105'
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-20 rounded"
                      style={{ background: template.gradient }}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{template.label}</div>
                      <div className="text-sm opacity-80">{template.description}</div>
                    </div>
                    {selectedStyle === template.style && (
                      <div className="text-2xl">✓</div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 bg-white/10 rounded-lg"
            >
              <div className="text-sm opacity-80 mb-2">Your Festival Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-2xl font-bold">{lineup.headliners.length}</div>
                  <div className="text-xs opacity-70">Headliners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{lineup.totalArtists}</div>
                  <div className="text-xs opacity-70">Total Artists</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Preview and download */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-semibold mb-4"
            >
              Preview
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="relative bg-white/5 rounded-lg overflow-hidden aspect-[10/14] mb-4"
            >
              <img
                key={selectedStyle}
                src={buildPosterUrl('preview')}
                alt="Festival poster preview"
                className="w-full h-full object-contain"
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              disabled={isDownloading}
              className="w-full bg-white text-purple-900 font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download Poster</span>
                </>
              )}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xs text-center mt-3 opacity-60"
            >
              High-quality PNG (1200×1600px)
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-8 text-sm opacity-60"
        >
          <p>Tap or press → to continue</p>
        </motion.div>
      </div>
    </div>
  );
}
