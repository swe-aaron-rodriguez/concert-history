'use client';

import { useState, useEffect } from 'react';
import { ProcessedSetlist } from '@/types/setlistfm';
import SetlistTemplatePreview from './SetlistTemplatePreview';

interface ShareImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  setlist: ProcessedSetlist;
}

type TemplateStyle = 'scrapbook' | 'vintage' | 'backstage' | 'minimalist';

interface Template {
  style: TemplateStyle;
  label: string;
  description: string;
}

const TEMPLATES: Template[] = [
  {
    style: 'scrapbook',
    label: 'Personal Scrapbook',
    description: 'Handwritten style on textured paper',
  },
  {
    style: 'vintage',
    label: 'Vintage Poster',
    description: '1960s/70s letterpress concert poster aesthetic',
  },
  {
    style: 'backstage',
    label: 'Backstage Pass',
    description: 'Industrial gaffer tape/roadie style',
  },
  {
    style: 'minimalist',
    label: 'Modern Minimalist',
    description: 'Clean, Spotify-chic typography',
  },
];

export default function ShareImageModal({ isOpen, onClose, setlist }: ShareImageModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>('scrapbook');
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Update preview when selected style changes
  useEffect(() => {
    if (isOpen && selectedStyle) {
      setPreviewUrl(`/api/setlist/${setlist.id}/image?style=${selectedStyle}&size=preview`);
    }
  }, [isOpen, selectedStyle, setlist.id]);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Generate filename: artist-venue-date.png
      const filename = `${setlist.artist.name}-${setlist.venue.name}-${setlist.displayDate}`
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase();

      // Fetch the full-size image
      const response = await fetch(
        `/api/setlist/${setlist.id}/image?style=${selectedStyle}&size=full`
      );

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Share as Image
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose a template style and download your setlist image
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Template selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose a Template
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {TEMPLATES.map((template) => (
                  <SetlistTemplatePreview
                    key={template.style}
                    setlistId={setlist.id}
                    style={template.style}
                    label={template.label}
                    isSelected={selectedStyle === template.style}
                    onClick={() => setSelectedStyle(template.style)}
                  />
                ))}
              </div>

              {/* Template description */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {TEMPLATES.find((t) => t.style === selectedStyle)?.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {TEMPLATES.find((t) => t.style === selectedStyle)?.description}
                </p>
              </div>
            </div>

            {/* Right: Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preview
              </h3>

              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-[5/7]">
                {isPreviewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Setlist preview"
                    className="w-full h-full object-contain"
                    onLoadStart={() => setIsPreviewLoading(true)}
                    onLoad={() => setIsPreviewLoading(false)}
                    onError={() => setIsPreviewLoading(false)}
                  />
                )}
              </div>

              {/* Download button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    <span>Download Image</span>
                  </>
                )}
              </button>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                High-quality PNG (1000 × 1400px)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
