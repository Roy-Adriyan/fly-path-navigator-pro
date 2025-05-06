
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlayIcon, PauseIcon, HomeIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface MissionControlsProps {
  waypoints: any[];
  onOptimizePath: () => void;
}

const MissionControls: React.FC<MissionControlsProps> = ({ waypoints, onOptimizePath }) => {
  const { toast } = useToast();
  const [missionParameters, setMissionParameters] = React.useState({
    speed: 5,
    maxAltitude: 120,
    returnToHome: true,
    avoidObstacles: true
  });
  
  const handleParameterChange = (param: string, value: number | boolean) => {
    setMissionParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleMissionStart = () => {
    if (waypoints.length < 2) {
      toast({
        title: "Cannot start mission",
        description: "You need at least 2 waypoints to start a mission",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Mission started",
      description: "Drone is executing the flight plan",
    });
  };

  const handleExportMission = () => {
    const missionData = {
      waypoints,
      parameters: missionParameters,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(missionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flight-plan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Mission exported",
      description: "Flight plan has been saved to your downloads"
    });
  };

  const handleOptimizePath = () => {
    if (waypoints.length < 3) {
      toast({
        title: "Cannot optimize path",
        description: "You need at least 3 waypoints to optimize a path",
        variant: "destructive"
      });
      return;
    }
    
    onOptimizePath();
    toast({
      title: "Path optimized",
      description: "Flight path has been optimized for efficiency"
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Mission Control</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-65px)]">
        <Tabs defaultValue="controls" className="flex-grow">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="controls" className="flex flex-col space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-success hover:bg-success/90">
                    <PlayIcon size={16} className="mr-1" /> 
                    Start Mission
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start mission?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will upload the flight plan to the drone and begin execution.
                      Make sure the area is clear and safe for flight operations.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMissionStart}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline">
                <PauseIcon size={16} className="mr-1" /> 
                Pause
              </Button>
            </div>
            
            <Button variant="outline" className="w-full">
              <HomeIcon size={16} className="mr-1" /> 
              Return to Home
            </Button>
            
            <Separator />
            
            <Button variant="secondary" onClick={handleOptimizePath} className="w-full">
              Optimize Path
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleExportMission}>
                <DownloadIcon size={16} className="mr-1" />
                Export
              </Button>
              
              <Button variant="outline">
                <UploadIcon size={16} className="mr-1" />
                Import
              </Button>
            </div>
            
            <div className="flex-grow" />
            
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm font-medium mb-1">Flight Statistics</div>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <div className="text-muted-foreground">Estimated Time:</div>
                <div>{waypoints.length ? `${(waypoints.length * 2)} min` : "N/A"}</div>
                <div className="text-muted-foreground">Total Distance:</div>
                <div>{waypoints.length ? `${(waypoints.length * 0.5).toFixed(1)} km` : "N/A"}</div>
                <div className="text-muted-foreground">Waypoints:</div>
                <div>{waypoints.length || "None"}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="parameters" className="pt-4 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm">Flight Speed</label>
                <span className="text-sm font-medium">{missionParameters.speed} m/s</span>
              </div>
              <Slider
                value={[missionParameters.speed]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleParameterChange('speed', value[0])}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm">Maximum Altitude</label>
                <span className="text-sm font-medium">{missionParameters.maxAltitude} m</span>
              </div>
              <Slider
                value={[missionParameters.maxAltitude]}
                min={10}
                max={400}
                step={10}
                onValueChange={(value) => handleParameterChange('maxAltitude', value[0])}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">Return to Home after mission</label>
                <Switch
                  checked={missionParameters.returnToHome}
                  onCheckedChange={(value) => handleParameterChange('returnToHome', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm">Avoid obstacles (if supported)</label>
                <Switch
                  checked={missionParameters.avoidObstacles}
                  onCheckedChange={(value) => handleParameterChange('avoidObstacles', value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MissionControls;
