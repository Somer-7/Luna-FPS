import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePerformance } from "@/hooks/usePerformance";
import { Activity, Cpu, MemoryStick, Wifi } from "lucide-react";

export const PerformanceMonitor = () => {
  const { metrics, isMonitoring, toggleMonitoring } = usePerformance();

  const getFPSColor = (fps: number) => {
    if (fps >= 120) return "text-green-500";
    if (fps >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getUsageVariant = (usage: number) => {
    if (usage >= 80) return "danger";
    if (usage >= 60) return "default";
    return "default";
  };

  return (
    <Card className="card-elevated glass animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">Monitor wydajności</CardTitle>
          <CardDescription>Metryki w czasie rzeczywistym</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleMonitoring}
          className="ml-auto"
        >
          <Activity className="h-4 w-4 mr-2" />
          {isMonitoring ? "Stop" : "Start"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                FPS
              </span>
              <Badge variant="outline" className={getFPSColor(metrics.fps)}>
                {Math.round(metrics.fps)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Ping
              </span>
              <Badge variant="outline">
                {Math.round(metrics.networkLatency)}ms
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                CPU
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(metrics.cpuUsage)}%
              </span>
            </div>
            <Progress 
              value={metrics.cpuUsage} 
              variant={getUsageVariant(metrics.cpuUsage)}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <MemoryStick className="h-4 w-4" />
                RAM
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(metrics.memoryUsage)}%
              </span>
            </div>
            <Progress 
              value={metrics.memoryUsage} 
              variant={getUsageVariant(metrics.memoryUsage)}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};