import Link from "next/link";
import type { ProcessedConcert } from "@/types/setlistfm";

interface ConcertCardProps {
  concert: ProcessedConcert;
  onClick?: (concertId: string) => void;
  hideDate?: boolean;
}

export default function ConcertCard({ concert, onClick, hideDate = false }: ConcertCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(concert.id);
    }
  };

  return (
    <Link
      href={`/setlist/${concert.id}`}
      onClick={handleClick}
      className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {!hideDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {concert.displayDate}
            </p>
          )}
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {concert.artist.name}
          </h3>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2 mt-1"
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
      </div>

      <div className="space-y-1 text-sm">
        <p className="text-gray-700 dark:text-gray-300 flex items-start">
          <svg
            className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            <span className="font-medium">{concert.venue.name}</span>
            <br />
            <span className="text-gray-600 dark:text-gray-400">
              {concert.venue.location}
            </span>
          </span>
        </p>

        {concert.tour && (
          <div className="flex items-center mt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <svg
                className="w-3.5 h-3.5 mr-1.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {concert.tour}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
