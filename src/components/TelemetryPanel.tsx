
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TelemetryPanelProps {
  missionActive?: boolean;
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ missionActive = false }) => {
  const [telemetry, setTelemetry] = useState({
    altitude: 0,
    speed: 0,
    battery: 85,
    signalStrength: 92,
    gpsSignal: 'Good',
    heading: 0,
    distanceToHome: 0,
    flightTime: 0,
    flightMode: 'Position Hold'
  });
  
  const [logs, setLogs] = useState<string[]>([
    'System initialized',
    'Waiting for GPS lock...',
    'GPS lock acquired',
    'Ready for flight operations'
  ]);
  
  // Simulated telemetry updates
  useEffect(() => {
    if (!missionActive) return;
    
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newValues = {
          ...prev,
          altitude: Math.min(120, prev.altitude + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5),
          speed: Math.max(0, Math.min(10, prev.speed + (Math.random() > 0.5 ? 1 : -1) * Math.random())),
          battery: Math.max(0, prev.battery - 0.1),
          heading: (prev.heading + Math.random() * 10) % 360,
          distanceToHome: Math.max(0, prev.distanceToHome + (Math.random() > 0.7 ? 1 : -1) * Math.random() * 10),
          flightTime: prev.flightTime + 1
        };
        
        return newValues;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [missionActive]);
  
  const formatFlightTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getBatteryColor = (level: number): string => {
    if (level > 50) return 'bg-success';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-destructive';
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Telemetry</CardTitle>
          <Badge variant={missionActive ? 'default' : 'outline'}>
            {missionActive ? 'Live' : 'Standby'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Altitude</div>
            <div className="font-medium">{telemetry.altitude.toFixed(1)} m</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Speed</div>
            <div className="font-medium">{telemetry.speed.toFixed(1)} m/s</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Heading</div>
            <div className="font-medium">{telemetry.heading.toFixed(0)}°</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Distance to Home</div>
            <div className="font-medium">{telemetry.distanceToHome.toFixed(1)} m</div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Battery</span>
              <span className="text-xs font-medium">{telemetry.battery.toFixed(0)}%</span>
            </div>
            <Progress value={telemetry.battery} className={cn("h-2", getBatteryColor(telemetry.battery))} />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Signal Strength</span>
              <span className="text-xs font-medium">{telemetry.signalStrength}%</span>
            </div>
            <Progress value={telemetry.signalStrength} className="h-2" />
          </div>
          
          <div className="flex justify-between py-1">
            <span className="text-xs text-muted-foreground">Flight Time</span>
            <span className="text-xs font-medium">{formatFlightTime(telemetry.flightTime)}</span>
          </div>
          
          <div className="flex justify-between py-1">
            <span className="text-xs text-muted-foreground">Flight Mode</span>
            <span className="text-xs font-medium">{telemetry.flightMode}</span>
          </div>
          
          <div className="flex justify-between py-1">
            <span className="text-xs text-muted-foreground">GPS Signal</span>
            <span className="text-xs font-medium">{telemetry.gpsSignal}</span>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="text-sm font-medium mb-2">System Logs</h4>
          <ScrollArea className="h-32 rounded-md border p-2">
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-xs">
                  <span className="text-muted-foreground mr-2">{`[${new Date().toLocaleTimeString()}]`}</span>
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryPanel;
