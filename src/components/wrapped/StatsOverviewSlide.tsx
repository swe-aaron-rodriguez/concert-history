'use client';

import { motion } from 'framer-motion';
import { WrappedStats } from '@/lib/wrapped-stats';

interface StatsOverviewSlideProps {
  stats: WrappedStats;
}

interface StatCardProps {
  value: string | number;
  label: string;
  icon: string;
  delay: number;
}

function StatCard({ value, label, icon, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-4xl md:text-5xl font-bold mb-2">{value}</div>
      <div className="text-sm md:text-base opacity-80">{label}</div>
    </motion.div>
  );
}

export default function StatsOverviewSlide({ stats }: StatsOverviewSlideProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Your Year in Numbers
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            value={stats.totalConcerts}
            label="Concerts Attended"
            icon="🎵"
            delay={0.1}
          />
          <StatCard
            value={stats.uniqueArtists}
            label={stats.uniqueArtists === 1 ? 'Unique Artist' : 'Unique Artists'}
            icon="🎤"
            delay={0.2}
          />
          <StatCard
            value={stats.totalHours}
            label={stats.totalHours === 1 ? 'Hour of Music' : 'Hours of Music'}
            icon="⏰"
            delay={0.3}
          />
          <StatCard
            value={stats.uniqueVenues}
            label={stats.uniqueVenues === 1 ? 'Venue Visited' : 'Venues Visited'}
            icon="🏟️"
            delay={0.4}
          />
          <StatCard
            value={stats.uniqueCities}
            label={stats.uniqueCities === 1 ? 'City Explored' : 'Cities Explored'}
            icon="🌆"
            delay={0.5}
          />
          <StatCard
            value={stats.uniqueCountries}
            label={stats.uniqueCountries === 1 ? 'Country' : 'Countries'}
            icon="🌍"
            delay={0.6}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center mt-12 text-sm opacity-60"
        >
          <p>Tap or press → to continue</p>
        </motion.div>
      </div>
    </div>
  );
}
