'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import type { ProcessedConcert } from '@/types/setlistfm';

// Fix for default marker icons in Next.js
// See: https://github.com/Leaflet/Leaflet/issues/4968
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ConcertMapProps {
  concerts: ProcessedConcert[];
}

// Component to fit map bounds to all markers
function FitBounds({ concerts }: { concerts: ProcessedConcert[] }) {
  const map = useMap();

  useEffect(() => {
    if (concerts.length === 0) return;

    const bounds = L.latLngBounds(
      concerts.map((concert) => [
        concert.venue.coords.lat,
        concert.venue.coords.long,
      ])
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [concerts, map]);

  return null;
}

export default function ConcertMap({ concerts }: ConcertMapProps) {
  // Default center (will be overridden by FitBounds)
  const center: [number, number] = useMemo(() => {
    if (concerts.length === 0) return [0, 0];

    // Center on first concert
    return [concerts[0].venue.coords.lat, concerts[0].venue.coords.long];
  }, [concerts]);

  if (concerts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 rounded-lg">
        No concerts to display on map
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={4}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds concerts={concerts} />

      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        maxClusterRadius={50}
      >
        {concerts.map((concert) => (
          <Marker
            key={concert.id}
            position={[concert.venue.coords.lat, concert.venue.coords.long]}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg mb-1">{concert.artist.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{concert.displayDate}</p>
                <p className="text-sm font-medium">{concert.venue.name}</p>
                <p className="text-sm text-gray-500">{concert.venue.location}</p>
                {concert.tour && (
                  <p className="text-xs text-gray-400 mt-2 italic">{concert.tour}</p>
                )}
                <a
                  href={`/setlist/${concert.id}`}
                  className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block"
                >
                  View setlist →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
