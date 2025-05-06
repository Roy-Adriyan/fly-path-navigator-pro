
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
  optimizationInProgress?: boolean;
  optimizationComplete?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  waypoints, 
  onWaypointAdded, 
  currentPosition,
  optimizationInProgress,
  optimizationComplete
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapMessage, setMapMessage] = useState<string>("Map loading...");
  const [simulatedPosition, setSimulatedPosition] = useState<number>(0);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);

  // Reset animation when optimization starts or stops
  useEffect(() => {
    if (optimizationInProgress) {
      setSimulatedPosition(0);
      startAnimation();
    } else if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
      setSimulatedPosition(0);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [optimizationInProgress]);

  // Animation function for path optimization visualization
  const startAnimation = () => {
    const animate = () => {
      setSimulatedPosition(prevPosition => {
        // Complete a full circuit in about 3 seconds (60 frames at 60fps = ~3s for 1.0)
        const newPosition = prevPosition + 0.016;
        return newPosition >= 1 ? 1 : newPosition;
      });
      
      const id = requestAnimationFrame(animate);
      setAnimationFrameId(id);
    };
    
    const id = requestAnimationFrame(animate);
    setAnimationFrameId(id);
  };

  // Map click handler setup
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

  const renderAnimatedDrone = () => {
    if (!optimizationInProgress || waypoints.length < 2) return null;
    
    // Calculate position along the path based on simulation progress
    const totalWaypoints = waypoints.length;
    const completedSegments = Math.min(Math.floor(simulatedPosition * (totalWaypoints - 1)), totalWaypoints - 1);
    const segmentProgress = (simulatedPosition * (totalWaypoints - 1)) % 1;
    
    const currentWp = waypoints[completedSegments];
    const nextWp = waypoints[Math.min(completedSegments + 1, totalWaypoints - 1)];
    
    // Interpolate between the current and next waypoint
    const lat = currentWp.lat + (nextWp.lat - currentWp.lat) * segmentProgress;
    const lng = currentWp.lng + (nextWp.lng - currentWp.lng) * segmentProgress;
    
    return (
      <div 
        className="absolute w-6 h-6 bg-accent rounded-full animate-pulse-subtle flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${50 + (lng + 74.0060) * 500}%`,
          top: `${50 + (lat - 40.7128) * 500}%`,
          zIndex: 100,
          transition: 'left 0.1s ease-out, top 0.1s ease-out'
        }}
      >
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>
    );
  };

  const renderCurrentPosition = () => {
    if (!currentPosition || optimizationInProgress) return null;
    
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
        {renderAnimatedDrone()}
        
        {/* Optimization completion message */}
        {optimizationComplete && waypoints.length >= 2 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground px-4 py-2 rounded-md shadow-md animate-fade-in">
            <p className="font-medium">Path optimization complete!</p>
            <p className="text-sm">All waypoints covered in optimal order.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapComponent;
