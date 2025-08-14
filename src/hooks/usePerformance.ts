import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    cpuUsage: 45,
    memoryUsage: 65,
    networkLatency: 28
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const simulateMetrics = useCallback(() => {
    setMetrics(prev => ({
      fps: Math.max(30, Math.min(144, prev.fps + (Math.random() - 0.5) * 8)),
      cpuUsage: Math.max(15, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
      memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
      networkLatency: Math.max(8, Math.min(150, prev.networkLatency + (Math.random() - 0.5) * 12))
    }));
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(simulateMetrics, 2000);
    return () => clearInterval(interval);
  }, [isMonitoring, simulateMetrics]);

  const toggleMonitoring = () => setIsMonitoring(prev => !prev);

  return {
    metrics,
    isMonitoring,
    toggleMonitoring
  };
};