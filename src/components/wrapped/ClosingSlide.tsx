'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ClosingSlideProps {
  username: string;
  totalConcerts: number;
}

export default function ClosingSlide({ username, totalConcerts }: ClosingSlideProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-900 via-fuchsia-900 to-pink-900 text-white p-8">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🎊
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
            What a Year!
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {username}, you experienced {totalConcerts} incredible {totalConcerts === 1 ? 'show' : 'shows'} in 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <p className="text-lg mb-4">Share your 2025 Wrapped with friends!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex-1 bg-black/30 rounded-lg px-4 py-3 text-sm font-mono truncate max-w-md">
                {shareUrl}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </motion.button>
            </div>
          </div>

          <motion.a
            href={`/user/${username}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-xl border border-white/30 transition-all"
          >
            View Full Concert History →
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-sm opacity-60"
        >
          <p>Here&apos;s to another great year of live music in 2026! 🎸</p>
        </motion.div>
      </div>
    </div>
  );
}
