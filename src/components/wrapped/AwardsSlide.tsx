'use client';

import { motion } from 'framer-motion';
import { Award } from '@/lib/wrapped-stats';

interface AwardsSlideProps {
  awards: Award[];
}

interface AwardCardProps {
  award: Award;
  index: number;
}

function AwardCard({ award, index }: AwardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        delay: 0.2 + index * 0.15,
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
      }}
      className="relative group"
    >
      <div className="bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-500/30 hover:border-yellow-400/60 transition-all hover:scale-105 shadow-lg hover:shadow-2xl">
        {/* Award icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + index * 0.15, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4 filter drop-shadow-lg"
        >
          {award.icon}
        </motion.div>

        {/* Award title */}
        <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
          {award.title}
        </h3>

        {/* Award description */}
        <p className="text-sm opacity-90 mb-3">{award.description}</p>

        {/* Award value */}
        <div className="text-lg font-semibold text-yellow-300">{award.value}</div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 -translate-x-full" />
      </div>
    </motion.div>
  );
}

export default function AwardsSlide({ awards }: AwardsSlideProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white p-8">
      {/* Background confetti pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: '100vh', opacity: [0, 1, 0] }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-7xl mb-4"
          >
            🏆
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your 2025 Achievements
          </h2>
          <p className="text-lg opacity-80">
            You've earned {awards.length} special {awards.length === 1 ? 'badge' : 'badges'}!
          </p>
        </motion.div>

        {awards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <AwardCard key={award.id} award={award} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center text-lg opacity-70"
          >
            <p>Keep attending concerts to unlock achievements!</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 + awards.length * 0.15, duration: 0.8 }}
          className="text-center mt-12 text-sm opacity-60"
        >
          <p>Tap or press → to continue</p>
        </motion.div>
      </div>
    </div>
  );
}
