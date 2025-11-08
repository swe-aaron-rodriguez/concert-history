'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SetlistTemplatePreviewProps {
  setlistId: string;
  style: 'scrapbook' | 'vintage' | 'backstage' | 'minimalist';
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function SetlistTemplatePreview({
  setlistId,
  style,
  label,
  isSelected,
  onClick,
}: SetlistTemplatePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = `/api/setlist/${setlistId}/image?style=${style}&size=thumbnail`;

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [setlistId, style]);

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
      }`}
    >
      {/* Preview image */}
      <div className="relative w-40 h-56 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm text-center p-2">
            Failed to load preview
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${label} template preview`}
            className="w-full h-full object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}
      </div>

      {/* Label */}
      <div
        className={`font-semibold text-sm ${
          isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
