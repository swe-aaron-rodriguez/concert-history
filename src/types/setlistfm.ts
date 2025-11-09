// Setlist.fm API Type Definitions

export interface Artist {
  mbid: string;
  name: string;
  sortName: string;
  disambiguation?: string;
  url: string;
}

export interface Venue {
  id: string;
  name: string;
  city: City;
  url: string;
}

export interface City {
  id: string;
  name: string;
  state?: string;
  stateCode?: string;
  coords: Coords;
  country: Country;
}

export interface Country {
  code: string;
  name: string;
}

export interface Coords {
  lat: number;
  long: number;
}

export interface Tour {
  name: string;
}

export interface Song {
  name: string;
  with?: Artist;
  cover?: Artist;
  info?: string;
  tape?: boolean;
}

export interface Set {
  name?: string;
  encore?: number;
  song: Song[];
}

export interface Sets {
  set: Set[];
}

export interface Setlist {
  id: string;
  versionId: string;
  eventDate: string; // Format: "dd-MM-yyyy"
  lastUpdated: string; // ISO 8601
  artist: Artist;
  venue: Venue;
  tour?: Tour;
  sets: Sets;
  info?: string;
  url: string;
}

export interface SetlistResponse {
  type: string;
  itemsPerPage: number;
  page: number;
  total: number;
  setlist: Setlist[];
}

export interface SetlistByIdResponse {
  type: string;
  setlist: Setlist;
}

// Client-facing processed types
export interface ProcessedConcert {
  id: string;
  date: string; // ISO format for sorting
  displayDate: string; // Formatted for display
  artist: {
    name: string;
    mbid: string;
  };
  venue: {
    name: string;
    location: string; // "City, State, Country" or "City, Country"
    coords: {
      lat: number;
      long: number;
    };
  };
  tour?: string;
  year: number;
}

export interface ProcessedSetlist {
  id: string;
  date: string;
  displayDate: string;
  artist: {
    name: string;
    url: string;
  };
  venue: {
    name: string;
    location: string;
  };
  tour?: string;
  sets: ProcessedSet[];
  info?: string;
}

export interface ProcessedSet {
  name: string;
  songs: ProcessedSong[];
}

export interface ProcessedSong {
  name: string;
  info?: string;
  isCover: boolean;
  coverArtist?: string;
  isTape: boolean;
}
