
import React, { useRef, useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

type Waypoint = {
  id: string;
  lat: number;
  lng: number;
  alt: number;
};

interface MapComponentProps {
  waypoints: Waypoint[];
  onWaypointAdded: (waypoint: Waypoint) => void;
  currentPosition?: { lat: number; lng: number };
}

const MapComponent: React.FC<MapComponentProps> = ({ waypoints, onWaypointAdded, currentPosition }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapMessage, setMapMessage] = useState<string>("Map loading...");

  useEffect(() => {
    setMapMessage("Map visualization will be displayed here.");
    
    // In a real implementation, this would initialize a map library like Mapbox, Leaflet, or Google Maps
    const handleMapClick = (e: MouseEvent) => {
      if (!mapRef.current) return;

      const rect = mapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert x,y coordinates to simulated lat/lng
      // This is just for demo purposes - in a real app these would be actual coordinates
      const simulatedLat = 40.7128 + ((y - rect.height / 2) / rect.height) * 0.1;
      const simulatedLng = -74.0060 + ((x - rect.width / 2) / rect.width) * 0.1;

      onWaypointAdded({
        id: `wp-${Date.now()}`,
        lat: parseFloat(simulatedLat.toFixed(6)),
        lng: parseFloat(simulatedLng.toFixed(6)),
        alt: 50 // Default altitude in meters
      });
    };

    const mapContainer = mapRef.current;
    if (mapContainer) {
      mapContainer.addEventListener('click', handleMapClick);
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener('click', handleMapClick);
      }
    };
  }, [onWaypointAdded]);

  const renderWaypoints = () => {
    return waypoints.map((wp, index) => (
      <div 
        key={wp.id}
        className="absolute w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${50 + (wp.lng + 74.0060) * 500}%`,
          top: `${50 + (wp.lat - 40.7128) * 500}%`,
          zIndex: index + 10
        }}
      >
        {index + 1}
      </div>
    ));
  };

  const renderPath = () => {
    if (waypoints.length < 2) return null;
    
    return waypoints.map((wp, index) => {
      if (index === waypoints.length - 1) return null;
      const nextWp = waypoints[index + 1];
      
      return (
        <div 
          key={`path-${wp.id}-${nextWp.id}`}
          className="absolute h-0.5 bg-primary transform origin-left"
          style={{
            left: `${50 + (wp.lng + 74.0060) * 500}%`,
            top: `${50 + (wp.lat - 40.7128) * 500}%`,
            width: `${Math.sqrt(
              Math.pow((nextWp.lng - wp.lng) * 500 * window.innerWidth / 100, 2) +
              Math.pow((nextWp.lat - wp.lat) * 500 * window.innerHeight / 100, 2)
            )}px`,
            transform: `rotate(${Math.atan2(
              (nextWp.lat - wp.lat) * window.innerHeight,
              (nextWp.lng - wp.lng) * window.innerWidth
            )}rad)`,
            zIndex: 5
          }}
        />
      );
    });
  };

  const renderCurrentPosition = () => {
    if (!currentPosition) return null;
    
    return (
      <div 
        className="absolute w-6 h-6 bg-accent rounded-full animate-pulse-subtle flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${50 + (currentPosition.lng + 74.0060) * 500}%`,
          top: `${50 + (currentPosition.lat - 40.7128) * 500}%`,
          zIndex: 100
        }}
      >
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>
    );
  };

  return (
    <Card className="w-full h-full overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full bg-gray-100 relative">
        {/* This would be replaced by actual map implementation */}
        <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-gray-200" />
          ))}
        </div>
        {waypoints.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {mapMessage}
            <div className="mt-6 text-sm">Click anywhere to add waypoints</div>
          </div>
        )}
        {renderPath()}
        {renderWaypoints()}
        {renderCurrentPosition()}
      </div>
    </Card>
  );
};

export default MapComponent;
