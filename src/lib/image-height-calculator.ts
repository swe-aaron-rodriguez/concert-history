import { ProcessedSetlist } from "@/types/setlistfm";

/**
 * Minimum and maximum height bounds for generated images
 */
const MIN_HEIGHT = 1000;
const MAX_HEIGHT = 3000;

/**
 * Safety margin multiplier to prevent content overflow (15% buffer)
 */
const SAFETY_MARGIN = 1.15;

/**
 * Round height to nearest multiple for cleaner dimensions
 */
const ROUND_TO = 100;

/**
 * Calculate height for Scrapbook template
 * Layout: Handwritten style on textured paper
 */
export function calculateScrapbookHeight(setlist: ProcessedSetlist): number {
  // Fixed elements
  const PADDING_VERTICAL = 120; // 60px top + 60px bottom
  const HEADER_BASE = 150; // Artist, venue, location, date
  const HEADER_WITH_TOUR = 200; // Includes tour name
  const FOOTER = 40; // Footer with border

  // Variable elements
  const SET_HEADER = 44; // 28px font + 16px margin
  const SET_MARGIN = 30; // Margin between sets
  const SONG_LINE = 32; // 22px font + 10px margin
  const COVER_LINE = 22; // 18px font + 4px margin (extra line for cover artist)
  const INFO_LINE = 22; // 18px font + 4px margin (extra line for song info)

  const headerHeight = setlist.tour ? HEADER_WITH_TOUR : HEADER_BASE;
  const setCount = setlist.sets.length;

  let totalSongLines = 0;
  let coverLines = 0;
  let infoLines = 0;
  let setHeaderCount = 0;

  setlist.sets.forEach((set) => {
    if (set.name) {
      setHeaderCount++;
    }
    totalSongLines += set.songs.length;

    set.songs.forEach((song) => {
      if (song.isCover && song.coverArtist) {
        coverLines++;
      }
      if (song.info) {
        infoLines++;
      }
    });
  });

  const contentHeight =
    PADDING_VERTICAL +
    headerHeight +
    (setHeaderCount * SET_HEADER) +
    (setCount * SET_MARGIN) +
    (totalSongLines * SONG_LINE) +
    (coverLines * COVER_LINE) +
    (infoLines * INFO_LINE) +
    FOOTER;

  return roundHeight(contentHeight * SAFETY_MARGIN);
}

/**
 * Calculate height for Vintage template
 * Layout: 1960s/70s letterpress poster with smart column layout
 */
export function calculateVintageHeight(setlist: ProcessedSetlist): number {
  // Fixed elements
  const PADDING_VERTICAL = 100; // 50px top + 50px bottom
  const HEADER = 250; // Artist, decorators, venue, location, date, tour
  const FOOTER = 70; // Footer with border and spacing

  // Variable elements
  const SET_HEADER = 40; // 26px font + margins
  const SET_MARGIN = 20; // Margin between sets
  const SONG_LINE = 28; // 20px font + 8px margin
  const COVER_LINE = 18; // 16px font + 2px margin (extra line for cover artist)

  // Count total songs to determine if using columns
  const totalSongs = setlist.sets.reduce((acc, set) => acc + set.songs.length, 0);
  const useColumns = totalSongs > 15;

  let totalSongLines = 0;
  let coverLines = 0;
  let setHeaderCount = 0;

  setlist.sets.forEach((set) => {
    if (set.name) {
      setHeaderCount++;
    }
    totalSongLines += set.songs.length;

    set.songs.forEach((song) => {
      if (song.isCover && song.coverArtist) {
        coverLines++;
      }
    });
  });

  // If using columns, height is roughly halved (but account for set headers appearing in both columns)
  const columnDivisor = useColumns ? 2 : 1;

  const contentHeight =
    PADDING_VERTICAL +
    HEADER +
    ((setHeaderCount * SET_HEADER) / columnDivisor) +
    (((setlist.sets.length * SET_MARGIN) + (totalSongLines * SONG_LINE) + (coverLines * COVER_LINE)) / columnDivisor) +
    FOOTER;

  return roundHeight(contentHeight * SAFETY_MARGIN);
}

/**
 * Calculate height for Backstage template
 * Layout: Industrial gaffer tape/roadie aesthetic with card
 */
export function calculateBackstageHeight(setlist: ProcessedSetlist): number {
  // Fixed elements
  const PADDING_VERTICAL = 200; // 50px outer margin × 2 + 50px card padding × 2
  const HEADER_BASE = 156; // Artist + 3 info lines (venue, location, date)
  const HEADER_WITH_TOUR = 180; // Includes tour line
  const FOOTER = 76; // Footer with ALL ACCESS badge

  // Variable elements
  const SET_HEADER = 66; // 34px font + 16px margin + padding
  const SET_MARGIN = 30; // Margin between sets
  const SONG_LINE = 34; // 22px font + 12px margin
  const COVER_LINE = 22; // 18px font + 4px margin (extra line for cover artist)
  const INFO_LINE = 22; // 18px font + 4px margin (extra line for note)

  const headerHeight = setlist.tour ? HEADER_WITH_TOUR : HEADER_BASE;
  const setCount = setlist.sets.length;

  let totalSongLines = 0;
  let coverLines = 0;
  let infoLines = 0;
  let setHeaderCount = 0;

  setlist.sets.forEach((set) => {
    if (set.name) {
      setHeaderCount++;
    }
    totalSongLines += set.songs.length;

    set.songs.forEach((song) => {
      if (song.isCover && song.coverArtist) {
        coverLines++;
      }
      if (song.info) {
        infoLines++;
      }
    });
  });

  const contentHeight =
    PADDING_VERTICAL +
    headerHeight +
    (setHeaderCount * SET_HEADER) +
    (setCount * SET_MARGIN) +
    (totalSongLines * SONG_LINE) +
    (coverLines * COVER_LINE) +
    (infoLines * INFO_LINE) +
    FOOTER;

  return roundHeight(contentHeight * SAFETY_MARGIN);
}

/**
 * Calculate height for Minimalist template
 * Layout: Clean, Spotify-chic typography
 */
export function calculateMinimalistHeight(setlist: ProcessedSetlist): number {
  // Fixed elements
  const PADDING_VERTICAL = 160; // 80px top + 80px bottom
  const HEADER = 150; // Artist, venue, location, date, tour
  const FOOTER = 80; // Footer with border and spacing

  // Variable elements
  const SET_HEADER = 48; // 28px font + 20px margin
  const SET_MARGIN = 40; // Margin between sets
  const SONG_LINE = 36; // 22px font + 14px margin
  const COVER_LINE = 24; // 18px font + 6px margin (extra line for cover artist)
  const INFO_LINE = 24; // 18px font + 6px margin (extra line for info)

  const setCount = setlist.sets.length;

  let totalSongLines = 0;
  let coverLines = 0;
  let infoLines = 0;
  let setHeaderCount = 0;

  setlist.sets.forEach((set) => {
    if (set.name) {
      setHeaderCount++;
    }
    totalSongLines += set.songs.length;

    set.songs.forEach((song) => {
      if (song.isCover && song.coverArtist) {
        coverLines++;
      }
      if (song.info) {
        infoLines++;
      }
    });
  });

  const contentHeight =
    PADDING_VERTICAL +
    HEADER +
    (setHeaderCount * SET_HEADER) +
    (setCount * SET_MARGIN) +
    (totalSongLines * SONG_LINE) +
    (coverLines * COVER_LINE) +
    (infoLines * INFO_LINE) +
    FOOTER;

  return roundHeight(contentHeight * SAFETY_MARGIN);
}

/**
 * Calculate height for a given style
 */
export function calculateImageHeight(
  style: "scrapbook" | "vintage" | "backstage" | "minimalist",
  setlist: ProcessedSetlist
): number {
  switch (style) {
    case "scrapbook":
      return calculateScrapbookHeight(setlist);
    case "vintage":
      return calculateVintageHeight(setlist);
    case "backstage":
      return calculateBackstageHeight(setlist);
    case "minimalist":
      return calculateMinimalistHeight(setlist);
    default:
      return MIN_HEIGHT; // Fallback
  }
}

/**
 * Round height to nearest multiple and clamp to min/max bounds
 */
function roundHeight(height: number): number {
  const rounded = Math.round(height / ROUND_TO) * ROUND_TO;
  return Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, rounded));
}
