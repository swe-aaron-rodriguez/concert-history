"use client";

import { useState } from "react";
import Link from "next/link";

// Mock concert data - multiple concerts on the same date
const mockConcerts = [
  {
    id: "1",
    displayDate: "November 4, 2024",
    date: "2024-11-04",
    artist: { name: "The Midnight" },
    venue: { name: "The Fillmore", location: "San Francisco, CA" },
    tour: "Heroes Tour 2024",
  },
  {
    id: "2",
    displayDate: "November 4, 2024",
    date: "2024-11-04",
    artist: { name: "CHVRCHES" },
    venue: { name: "Bill Graham Civic", location: "San Francisco, CA" },
    tour: "Screen Violence Tour",
  },
  {
    id: "3",
    displayDate: "November 4, 2024",
    date: "2024-11-04",
    artist: { name: "M83" },
    venue: { name: "The Warfield", location: "San Francisco, CA" },
    tour: "Fantasy Tour",
  },
  {
    id: "4",
    displayDate: "November 3, 2024",
    date: "2024-11-03",
    artist: { name: "Porter Robinson" },
    venue: { name: "Oracle Park", location: "San Francisco, CA" },
    tour: "Nurture Tour",
  },
  {
    id: "5",
    displayDate: "November 2, 2024",
    date: "2024-11-02",
    artist: { name: "Daft Punk" },
    venue: { name: "Chase Center", location: "San Francisco, CA" },
    tour: null,
  },
  {
    id: "6",
    displayDate: "November 2, 2024",
    date: "2024-11-02",
    artist: { name: "Justice" },
    venue: { name: "Fox Theater", location: "Oakland, CA" },
    tour: "Hyperdrama World Tour",
  },
];

// Group concerts by date
const groupByDate = (concerts: typeof mockConcerts) => {
  const grouped: Record<string, typeof mockConcerts> = {};
  concerts.forEach((concert) => {
    if (!grouped[concert.date]) {
      grouped[concert.date] = [];
    }
    grouped[concert.date].push(concert);
  });
  return grouped;
};

const groupedConcerts = groupByDate(mockConcerts);

export default function GroupingDemoPage() {
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    "2024-11-04": true,
    "2024-11-03": true,
    "2024-11-02": true,
  });
  const [activeTab, setActiveTab] = useState<Record<string, number>>({
    "2024-11-04": 0,
    "2024-11-03": 0,
    "2024-11-02": 0,
  });

  const toggleAccordion = (date: string) => {
    setAccordionOpen((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
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
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Concert Grouping Patterns Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Exploring different UX approaches for grouping concerts on the same date
          </p>
        </div>

        {/* Pattern 1: Accordion/Collapsible Date Groups */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            1. Accordion/Collapsible Date Groups
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Click date headers to expand/collapse. Clean, scannable timeline view.
          </p>
          <div className="space-y-3">
            {Object.entries(groupedConcerts).map(([date, concerts]) => (
              <div
                key={date}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(date)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {concerts[0].displayDate}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({concerts.length} show{concerts.length > 1 ? "s" : ""})
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      accordionOpen[date] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {accordionOpen[date] && (
                  <div className="px-6 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                    {concerts.map((concert) => (
                      <div
                        key={concert.id}
                        className="pl-8 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {concert.artist.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {concert.venue.name} • {concert.venue.location}
                        </p>
                        {concert.tour && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {concert.tour}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pattern 2: Nested Cards with Date Header */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            2. Nested Cards with Date Header
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            All information visible at once with clear visual grouping.
          </p>
          <div className="space-y-6">
            {Object.entries(groupedConcerts).map(([date, concerts]) => (
              <div
                key={date}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-850 p-6 rounded-lg shadow-md border-2 border-blue-200 dark:border-blue-900"
              >
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {concerts[0].displayDate}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    • {concerts.length} show{concerts.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {concerts.map((concert) => (
                    <div
                      key={concert.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {concert.artist.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {concert.venue.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {concert.venue.location}
                      </p>
                      {concert.tour && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                          {concert.tour}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pattern 3: Compact List with Date Dividers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            3. Compact List with Date Dividers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Minimal space usage with clean separation between dates.
          </p>
          <div className="space-y-6">
            {Object.entries(groupedConcerts).map(([date, concerts]) => (
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
                      {concerts[0].displayDate}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-300 dark:from-gray-600 dark:via-gray-600 to-transparent"></div>
                </div>
                <div className="space-y-2 pl-4">
                  {concerts.map((concert) => (
                    <div
                      key={concert.id}
                      className="flex items-start gap-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-3 transition-colors"
                    >
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {concert.artist.name}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400"> @ </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {concert.venue.name}
                        </span>
                        {concert.tour && (
                          <span className="text-sm text-gray-500 dark:text-gray-500 ml-2">
                            ({concert.tour})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pattern 4: Tabbed Container */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            4. Tabbed Container
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Interactive tabs for multi-show dates. Good for festivals.
          </p>
          <div className="space-y-6">
            {Object.entries(groupedConcerts).map(([date, concerts]) => (
              <div
                key={date}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {concerts[0].displayDate}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({concerts.length} shows)
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setActiveTab((prev) => ({
                            ...prev,
                            [date]: Math.max(0, (prev[date] || 0) - 1),
                          }))
                        }
                        disabled={(activeTab[date] || 0) === 0}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setActiveTab((prev) => ({
                            ...prev,
                            [date]: Math.min(concerts.length - 1, (prev[date] || 0) + 1),
                          }))
                        }
                        disabled={(activeTab[date] || 0) === concerts.length - 1}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {concerts.map((concert, idx) => (
                      <button
                        key={concert.id}
                        onClick={() =>
                          setActiveTab((prev) => ({ ...prev, [date]: idx }))
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          (activeTab[date] || 0) === idx
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        Show {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  {concerts.map((concert, idx) => (
                    <div
                      key={concert.id}
                      className={idx === (activeTab[date] || 0) ? "block" : "hidden"}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {concert.artist.name}
                      </h3>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-700 dark:text-gray-300">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {concert.venue.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 pl-7">
                          {concert.venue.location}
                        </p>
                        {concert.tour && (
                          <p className="flex items-center text-blue-600 dark:text-blue-400 mt-3">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            {concert.tour}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pattern 5: Side-by-Side Grouped Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            5. Side-by-Side Grouped Cards
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Maintains grid layout with visual connection between same-day concerts.
          </p>
          <div className="space-y-8">
            {Object.entries(groupedConcerts).map(([date, concerts]) => (
              <div key={date}>
                <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-t-lg inline-flex items-center gap-2 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {concerts[0].displayDate} ({concerts.length} shows)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-blue-600 dark:border-blue-700 border-t-0 rounded-b-lg p-4 bg-blue-50 dark:bg-gray-800">
                  {concerts.map((concert) => (
                    <div
                      key={concert.id}
                      className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {concert.artist.name}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        {concert.venue.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {concert.venue.location}
                      </p>
                      {concert.tour && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                          {concert.tour}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pattern 6: Timeline with Visual Connectors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            6. Timeline with Visual Connectors
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Vertical timeline with connecting lines. Elegant for chronological storytelling.
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600"></div>

            <div className="space-y-8">
              {Object.entries(groupedConcerts).map(([date, concerts]) => (
                <div key={date} className="relative pl-12">
                  {/* Date node */}
                  <div className="absolute left-0 top-0">
                    <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Date header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {concerts[0].displayDate}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {concerts.length} show{concerts.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Concerts */}
                  <div className="space-y-3">
                    {concerts.map((concert, idx) => (
                      <div
                        key={concert.id}
                        className="relative bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-blue-600 dark:border-blue-400 hover:shadow-lg transition-shadow"
                      >
                        {/* Connector line to timeline */}
                        <div className="absolute -left-12 top-1/2 w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>

                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {concert.artist.name}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                          {concert.venue.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {concert.venue.location}
                        </p>
                        {concert.tour && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            {concert.tour}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-lg border border-purple-200 dark:border-purple-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Summary & Recommendations
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong className="text-blue-600 dark:text-blue-400">Best for many concerts:</strong>{" "}
              Pattern 1 (Accordion) - Keeps UI clean and scannable
            </p>
            <p>
              <strong className="text-blue-600 dark:text-blue-400">Best for visibility:</strong>{" "}
              Pattern 2 (Nested Cards) - All info visible without clicking
            </p>
            <p>
              <strong className="text-blue-600 dark:text-blue-400">Best for festivals:</strong>{" "}
              Pattern 4 (Tabs) - Great for multi-stage/venue events
            </p>
            <p>
              <strong className="text-blue-600 dark:text-blue-400">Best for storytelling:</strong>{" "}
              Pattern 6 (Timeline) - Beautiful chronological narrative
            </p>
            <p>
              <strong className="text-blue-600 dark:text-blue-400">Most flexible:</strong>{" "}
              Pattern 5 (Side-by-Side) - Works with existing grid, minimal changes
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
