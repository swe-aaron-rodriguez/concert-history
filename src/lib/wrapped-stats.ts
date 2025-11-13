import { ProcessedConcert, ProcessedSetlist } from "@/types/setlistfm";

export interface WrappedStats {
  totalConcerts: number;
  uniqueArtists: number;
  totalHours: number;
  uniqueVenues: number;
  uniqueCities: number;
  uniqueCountries: number;
  mostSeenArtist: {
    name: string;
    count: number;
  } | null;
  favoriteVenue: {
    name: string;
    location: string;
    count: number;
  } | null;
  // Stats requiring full setlist data
  totalSongs?: number;
  totalEncores?: number;
  totalCovers?: number;
  longestSetlist?: {
    artist: string;
    venue: string;
    date: string;
    songCount: number;
  };
  mostHeardSong?: {
    name: string;
    count: number;
  };
}

/**
 * Calculate comprehensive wrapped statistics from concerts
 */
export function calculateWrappedStats(
  concerts: ProcessedConcert[]
): WrappedStats {
  if (concerts.length === 0) {
    return {
      totalConcerts: 0,
      uniqueArtists: 0,
      totalHours: 0,
      uniqueVenues: 0,
      uniqueCities: 0,
      uniqueCountries: 0,
      mostSeenArtist: null,
      favoriteVenue: null,
    };
  }

  // Calculate basic stats
  const totalConcerts = concerts.length;
  const totalHours = Math.round(totalConcerts * 2.5); // Estimate 2.5 hours per concert

  // Unique artists
  const artistSet = new Set(concerts.map((c) => c.artist.name));
  const uniqueArtists = artistSet.size;

  // Unique venues
  const venueSet = new Set(
    concerts.map((c) => `${c.venue.name}|${c.venue.location}`)
  );
  const uniqueVenues = venueSet.size;

  // Unique cities
  const citySet = new Set(
    concerts.map((c) => {
      const locationParts = c.venue.location.split(", ");
      return locationParts[0]; // City is always first
    })
  );
  const uniqueCities = citySet.size;

  // Unique countries
  const countrySet = new Set(
    concerts.map((c) => {
      const locationParts = c.venue.location.split(", ");
      return locationParts[locationParts.length - 1]; // Country is always last
    })
  );
  const uniqueCountries = countrySet.size;

  // Most seen artist (Biggest Fan Award)
  const artistCounts = new Map<string, number>();
  concerts.forEach((concert) => {
    const count = artistCounts.get(concert.artist.name) || 0;
    artistCounts.set(concert.artist.name, count + 1);
  });

  let mostSeenArtist: { name: string; count: number } | null = null;
  artistCounts.forEach((count, artistName) => {
    if (!mostSeenArtist || count > mostSeenArtist.count) {
      mostSeenArtist = { name: artistName, count };
    }
  });

  // Favorite venue (Explorer Badge)
  const venueCounts = new Map<
    string,
    { name: string; location: string; count: number }
  >();
  concerts.forEach((concert) => {
    const key = `${concert.venue.name}|${concert.venue.location}`;
    const existing = venueCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      venueCounts.set(key, {
        name: concert.venue.name,
        location: concert.venue.location,
        count: 1,
      });
    }
  });

  let favoriteVenue: { name: string; location: string; count: number } | null =
    null;
  venueCounts.forEach((venue) => {
    if (!favoriteVenue || venue.count > favoriteVenue.count) {
      favoriteVenue = venue;
    }
  });

  return {
    totalConcerts,
    uniqueArtists,
    totalHours,
    uniqueVenues,
    uniqueCities,
    uniqueCountries,
    mostSeenArtist,
    favoriteVenue,
  };
}

/**
 * Calculate detailed stats from full setlist data
 * This requires fetching individual setlists for each concert
 */
export function calculateDetailedStats(
  setlists: ProcessedSetlist[]
): Partial<WrappedStats> {
  if (setlists.length === 0) {
    return {};
  }

  let totalSongs = 0;
  let totalEncores = 0;
  let totalCovers = 0;
  let longestSetlist: WrappedStats["longestSetlist"];

  const songCounts = new Map<string, number>();

  setlists.forEach((setlist) => {
    let setlistSongCount = 0;

    setlist.sets.forEach((set) => {
      set.songs.forEach((song) => {
        totalSongs++;
        setlistSongCount++;

        if (song.isCover) {
          totalCovers++;
        }

        // Count song occurrences
        const count = songCounts.get(song.name) || 0;
        songCounts.set(song.name, count + 1);
      });

      // Count encores (sets with "Encore" in name)
      if (set.name && set.name.toLowerCase().includes("encore")) {
        totalEncores++;
      }
    });

    // Track longest setlist
    if (!longestSetlist || setlistSongCount > longestSetlist.songCount) {
      longestSetlist = {
        artist: setlist.artist.name,
        venue: setlist.venue.name,
        date: setlist.displayDate,
        songCount: setlistSongCount,
      };
    }
  });

  // Find most heard song
  let mostHeardSong: { name: string; count: number } | undefined;
  songCounts.forEach((count, songName) => {
    if (!mostHeardSong || count > mostHeardSong.count) {
      mostHeardSong = { name: songName, count };
    }
  });

  return {
    totalSongs,
    totalEncores,
    totalCovers,
    longestSetlist,
    mostHeardSong,
  };
}

/**
 * Filter concerts to a specific year
 */
export function filterConcertsByYear(
  concerts: ProcessedConcert[],
  year: number
): ProcessedConcert[] {
  return concerts.filter((concert) => concert.year === year);
}

/**
 * Get artist frequency data for constellation visualization
 */
export interface ArtistNode {
  id: string;
  name: string;
  count: number;
  percentage: number;
  hasTour: boolean; // True if any of their concerts had a tour (proxy for main artist)
}

export function getArtistNodes(concerts: ProcessedConcert[]): ArtistNode[] {
  const artistCounts = new Map<string, number>();
  const artistHasTour = new Map<string, boolean>();

  concerts.forEach((concert) => {
    const count = artistCounts.get(concert.artist.name) || 0;
    artistCounts.set(concert.artist.name, count + 1);

    // Mark artist as having a tour if ANY of their concerts had a tour
    if (concert.tour) {
      artistHasTour.set(concert.artist.name, true);
    }
  });

  const totalConcerts = concerts.length;
  const nodes: ArtistNode[] = [];

  artistCounts.forEach((count, artistName) => {
    nodes.push({
      id: artistName,
      name: artistName,
      count,
      percentage: Math.round((count / totalConcerts) * 100),
      hasTour: artistHasTour.get(artistName) || false,
    });
  });

  // Sort by count (descending)
  return nodes.sort((a, b) => b.count - a.count);
}

/**
 * Calculate awards/badges based on stats
 */
export interface Award {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: "🏆" | "🌍" | "🎭" | "⭐" | "🎸";
}

export function calculateAwards(
  concerts: ProcessedConcert[],
  stats: WrappedStats
): Award[] {
  const awards: Award[] = [];

  // Biggest Fan Award
  if (stats.mostSeenArtist && stats.mostSeenArtist.count > 1) {
    awards.push({
      id: "biggest-fan",
      title: "Biggest Fan",
      description: `Saw ${stats.mostSeenArtist.name} ${stats.mostSeenArtist.count} times`,
      value: stats.mostSeenArtist.name,
      icon: "🏆",
    });
  }

  // Explorer Badge
  if (stats.uniqueCities > 1) {
    awards.push({
      id: "explorer",
      title: "Explorer",
      description: `Visited ${stats.uniqueCities} different ${
        stats.uniqueCities === 1 ? "city" : "cities"
      }`,
      value: `${stats.uniqueCities} ${
        stats.uniqueCities === 1 ? "city" : "cities"
      }`,
      icon: "🌍",
    });
  }

  // Venue Regular
  if (stats.favoriteVenue && stats.favoriteVenue.count > 1) {
    awards.push({
      id: "venue-regular",
      title: "Venue Regular",
      description: `Visited ${stats.favoriteVenue.name} ${stats.favoriteVenue.count} times`,
      value: stats.favoriteVenue.name,
      icon: "🎭",
    });
  }

  // Concert Enthusiast (based on total concerts)
  if (stats.totalConcerts >= 10) {
    awards.push({
      id: "enthusiast",
      title: "Concert Enthusiast",
      description: `Attended ${stats.totalConcerts} shows`,
      value: `${stats.totalConcerts} shows`,
      icon: "⭐",
    });
  } else if (stats.totalConcerts >= 5) {
    awards.push({
      id: "regular",
      title: "Concert Regular",
      description: `Attended ${stats.totalConcerts} shows`,
      value: `${stats.totalConcerts} shows`,
      icon: "⭐",
    });
  }

  // Music Diversity (based on unique artists vs total concerts ratio)
  const diversityRatio = stats.uniqueArtists / stats.totalConcerts;
  if (diversityRatio > 0.8 && stats.uniqueArtists > 5) {
    awards.push({
      id: "diverse-taste",
      title: "Diverse Taste",
      description: `Saw ${stats.uniqueArtists} different artists`,
      value: `${stats.uniqueArtists} artists`,
      icon: "🎸",
    });
  }

  return awards;
}

/**
 * Festival lineup hierarchy
 */
export interface FestivalLineup {
  headliners: ArtistNode[];
  subHeadliners: ArtistNode[];
  lineup: ArtistNode[];
  festivalName: string;
  totalArtists: number;
}

/**
 * Monthly concert data for calendar visualization
 */
export interface MonthlyData {
  month: number; // 1-12
  monthName: string;
  count: number;
}

/**
 * Calculate concerts per month for a year
 */
export function calculateMonthlyData(
  concerts: ProcessedConcert[]
): MonthlyData[] {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize all months with 0 counts
  const monthlyCounts = new Map<number, number>();
  for (let i = 1; i <= 12; i++) {
    monthlyCounts.set(i, 0);
  }

  // Count concerts per month
  concerts.forEach((concert) => {
    // Extract month from ISO date string (YYYY-MM-DD)
    const date = new Date(concert.date);
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const currentCount = monthlyCounts.get(month) || 0;
    monthlyCounts.set(month, currentCount + 1);
  });

  // Convert to array format
  const monthlyData: MonthlyData[] = [];
  for (let month = 1; month <= 12; month++) {
    monthlyData.push({
      month,
      monthName: monthNames[month - 1],
      count: monthlyCounts.get(month) || 0,
    });
  }

  return monthlyData;
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate festival lineup with hierarchy based on frequency
 * Artists with same frequency prioritize those with tours (proxy for main artist)
 * then randomized for variety
 */
export function generateFestivalLineup(
  artistNodes: ArtistNode[],
  username: string
): FestivalLineup {
  // Group artists by their count
  const countGroups = new Map<number, ArtistNode[]>();
  artistNodes.forEach((artist) => {
    const group = countGroups.get(artist.count) || [];
    group.push(artist);
    countGroups.set(artist.count, group);
  });

  // Process each count group: prioritize artists with tours, then randomize
  const randomizedArtists: ArtistNode[] = [];
  const sortedCounts = Array.from(countGroups.keys()).sort((a, b) => b - a);

  sortedCounts.forEach((count) => {
    const group = countGroups.get(count)!;

    // Separate artists with and without tours
    const withTour = group.filter(artist => artist.hasTour);
    const withoutTour = group.filter(artist => !artist.hasTour);

    // Randomize each sub-group independently
    const shuffledWithTour = shuffleArray(withTour);
    const shuffledWithoutTour = shuffleArray(withoutTour);

    // Add tour artists first, then non-tour artists
    randomizedArtists.push(...shuffledWithTour, ...shuffledWithoutTour);
  });

  // Take top 20 artists for the poster (to avoid overcrowding)
  const topArtists = randomizedArtists.slice(0, 20);

  // Create hierarchy
  const headliners = topArtists.slice(0, 3);
  const subHeadliners = topArtists.slice(3, 8);
  const lineup = topArtists.slice(8);

  return {
    headliners,
    subHeadliners,
    lineup,
    festivalName: `${username.toUpperCase()}'S 2025 FESTIVAL`,
    totalArtists: artistNodes.length,
  };
}
