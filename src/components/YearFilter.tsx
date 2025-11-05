"use client";

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export default function YearFilter({
  years,
  selectedYear,
  onYearChange,
}: YearFilterProps) {
  if (years.length === 0) {
    return null;
  }

  return (
    <div className="sticky-filter mb-6 md:mb-8">
      <label
        htmlFor="year-filter"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Filter by Year
      </label>
      <select
        id="year-filter"
        value={selectedYear || "all"}
        onChange={(e) => {
          const value = e.target.value;
          onYearChange(value === "all" ? null : parseInt(value));
        }}
        className="block w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      >
        <option value="all">All Years ({years.length} total)</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
