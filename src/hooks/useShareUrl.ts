import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for sharing URLs via clipboard with visual feedback
 * @returns Object with copied state and handleShare function
 */
export function useShareUrl() {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      // Clear any existing timeout before creating a new one
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      // Store timeout ID in ref for cleanup
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for browsers without clipboard API support
    }
  };

  return { copied, handleShare };
}
