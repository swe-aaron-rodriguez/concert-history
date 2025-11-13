'use client';

import { motion } from 'framer-motion';
import { MonthlyData } from '@/lib/wrapped-stats';

interface CalendarSlideProps {
  monthlyData: MonthlyData[];
}

export default function CalendarSlide({ monthlyData }: CalendarSlideProps) {
  // Find the max count for scaling bars
  const maxCount = Math.max(...monthlyData.map((m) => m.count), 1);

  // Find the most active month(s)
  const mostActiveMonths = monthlyData.filter((m) => m.count === maxCount && m.count > 0);
  const mostActiveMonth = mostActiveMonths.length > 0 ? mostActiveMonths[0] : null;

  // Calculate total concerts
  const totalConcerts = monthlyData.reduce((sum, m) => sum + m.count, 0);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 50px, rgba(255,255,255,0.1) 51px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 50px, rgba(255,255,255,0.1) 51px)
          `,
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          Your Concert Calendar
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-lg md:text-xl mb-12 text-blue-200"
        >
          {mostActiveMonth && mostActiveMonth.count > 0 ? (
            <>
              <span className="font-semibold text-yellow-300">{mostActiveMonth.monthName}</span> was your busiest month
              {mostActiveMonths.length > 1 && ` (tied with ${mostActiveMonths.length - 1} other${mostActiveMonths.length > 2 ? 's' : ''})`}
            </>
          ) : (
            'No concerts this year yet'
          )}
        </motion.p>

        {/* Calendar grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          {monthlyData.map((month, index) => {
            const heightPercentage = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
            const isTopMonth = month.count === maxCount && month.count > 0;

            return (
              <motion.div
                key={month.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Month name */}
                <div className="text-xs md:text-sm font-medium mb-2 h-8 flex items-center justify-center text-center">
                  {month.monthName.slice(0, 3)}
                </div>

                {/* Bar container */}
                <div className="relative w-full h-32 md:h-40 bg-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
                  {/* Animated bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.8, type: 'spring', bounce: 0.4 }}
                    className={`absolute bottom-0 w-full rounded-t-lg ${
                      isTopMonth
                        ? 'bg-gradient-to-t from-yellow-400 via-yellow-300 to-yellow-200'
                        : month.count > 0
                        ? 'bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500'
                        : 'bg-transparent'
                    }`}
                    style={{
                      boxShadow: month.count > 0 ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none',
                    }}
                  />

                  {/* Count label */}
                  {month.count > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.05, duration: 0.4 }}
                      className={`absolute inset-0 flex items-center justify-center font-bold text-lg md:text-xl ${
                        isTopMonth ? 'text-yellow-900' : 'text-white'
                      }`}
                      style={{
                        textShadow: isTopMonth ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {month.count}
                    </motion.div>
                  )}
                </div>

                {/* Top month indicator */}
                {isTopMonth && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.05, duration: 0.4 }}
                    className="mt-2 text-yellow-300 text-xl"
                  >
                    ⭐
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
            <div className="text-sm text-blue-200 mb-1">Total Concerts</div>
            <div className="text-4xl md:text-5xl font-bold text-white">{totalConcerts}</div>
          </div>
        </motion.div>

        {/* Navigation hint */}
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
