
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Waypoint = {
  id: string;
  lat: number;
  lng: number;
  alt: number;
};

interface WaypointListProps {
  waypoints: Waypoint[];
  onWaypointChange: (id: string, field: keyof Waypoint, value: number) => void;
  onWaypointDelete: (id: string) => void;
  onClearWaypoints: () => void;
}

const WaypointList: React.FC<WaypointListProps> = ({ 
  waypoints, 
  onWaypointChange, 
  onWaypointDelete,
  onClearWaypoints
}) => {
  if (waypoints.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Waypoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <p>No waypoints added yet</p>
            <p className="text-sm mt-2">Click on the map to add waypoints</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Waypoints ({waypoints.length})</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearWaypoints}
            className="text-xs h-8"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-80px)]">
        <CardContent className="pt-0">
          {waypoints.map((waypoint, index) => (
            <React.Fragment key={waypoint.id}>
              {index > 0 && <Separator className="my-3" />}
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">
                  {index + 1}
                </div>
                <div className="font-medium flex-grow">Waypoint {index + 1}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onWaypointDelete(waypoint.id)}
                  className="h-7 w-7 p-0"
                >
                  <TrashIcon size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 my-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Latitude</label>
                  <Input 
                    size={1} 
                    value={waypoint.lat}
                    onChange={(e) => onWaypointChange(
                      waypoint.id, 
                      'lat', 
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Longitude</label>
                  <Input 
                    size={1} 
                    value={waypoint.lng}
                    onChange={(e) => onWaypointChange(
                      waypoint.id, 
                      'lng', 
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Altitude (m)</label>
                  <Input 
                    size={1} 
                    value={waypoint.alt}
                    onChange={(e) => onWaypointChange(
                      waypoint.id, 
                      'alt', 
                      parseFloat(e.target.value) || 0
                    )}
                    className="h-8"
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default WaypointList;
