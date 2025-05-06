
import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import MapComponent from "./MapComponent";
import WaypointList from "./WaypointList";
import MissionControls from "./MissionControls";
import TelemetryPanel from "./TelemetryPanel";

type Waypoint = {
  id: string;
  lat: number;
  lng: number;
  alt: number;
};

const FlightPathOptimizerLayout: React.FC = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [missionActive, setMissionActive] = useState(false);
  const { toast } = useToast();

  const handleWaypointAdded = (waypoint: Waypoint) => {
    setWaypoints([...waypoints, waypoint]);
    toast({
      title: "Waypoint Added",
      description: `Waypoint ${waypoints.length + 1} added at ${waypoint.lat.toFixed(6)}, ${waypoint.lng.toFixed(6)}`,
    });
  };

  const handleWaypointChange = (id: string, field: keyof Waypoint, value: number) => {
    setWaypoints(waypoints.map(wp => 
      wp.id === id ? { ...wp, [field]: value } : wp
    ));
  };

  const handleWaypointDelete = (id: string) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const handleClearWaypoints = () => {
    setWaypoints([]);
  };

  const handleOptimizePath = () => {
    // This would implement an actual path optimization algorithm
    // For demo purposes, we'll just reorder the waypoints
    const optimizedWaypoints = [...waypoints];
    for (let i = optimizedWaypoints.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optimizedWaypoints[i], optimizedWaypoints[j]] = [optimizedWaypoints[j], optimizedWaypoints[i]];
    }
    setWaypoints(optimizedWaypoints);
  };

  const simulatedCurrentPosition = waypoints.length > 0 
    ? { lat: waypoints[0].lat, lng: waypoints[0].lng }
    : undefined;

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden bg-muted/20">
        <Sidebar>
          <div className="flex flex-col h-full p-4 space-y-4">
            <div className="text-lg font-bold">Flight Path Optimizer</div>
            <Separator />
            <div className="flex-grow">
              <WaypointList 
                waypoints={waypoints}
                onWaypointChange={handleWaypointChange}
                onWaypointDelete={handleWaypointDelete}
                onClearWaypoints={handleClearWaypoints}
              />
            </div>
          </div>
        </Sidebar>
        
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          <div className="flex items-center p-4 bg-background">
            <SidebarTrigger />
            <div className="flex-grow flex items-center justify-center">
              <h1 className="text-xl font-bold">Flight Path Navigator Pro</h1>
            </div>
            <div className="w-10"></div> {/* Placeholder for balance */}
          </div>
          
          <div className="flex-grow flex lg:flex-row flex-col p-4 space-x-0 space-y-4 lg:space-y-0 lg:space-x-4 overflow-auto">
            <div className="w-full lg:w-2/3 h-[400px] lg:h-full">
              <MapComponent 
                waypoints={waypoints}
                onWaypointAdded={handleWaypointAdded}
                currentPosition={simulatedCurrentPosition}
              />
            </div>
            
            <div className="w-full lg:w-1/3 flex flex-col space-y-4 h-full">
              <div className="h-1/2">
                <MissionControls 
                  waypoints={waypoints}
                  onOptimizePath={handleOptimizePath}
                />
              </div>
              <div className="h-1/2">
                <TelemetryPanel missionActive={missionActive} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FlightPathOptimizerLayout;
