import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  ping: number;
  currentGame: string;
}

interface GameBoosts {
  turboBoost: boolean;
  deepClean: boolean;
  silentMode: boolean;
  ultraReflex: boolean;
  autoUpscaler: boolean;
  fpsStabilizer: boolean;
}

// Simulated game detection based on window title/URL patterns
const detectCurrentGame = (): string => {
  const gamePatterns = [
    { pattern: /counter.*strike|cs2|csgo/i, name: 'Counter-Strike 2' },
    { pattern: /valorant/i, name: 'Valorant' },
    { pattern: /apex.*legends/i, name: 'Apex Legends' },
    { pattern: /fortnite/i, name: 'Fortnite' },
    { pattern: /overwatch/i, name: 'Overwatch 2' },
    { pattern: /league.*legends|lol/i, name: 'League of Legends' },
    { pattern: /dota.*2/i, name: 'Dota 2' },
    { pattern: /minecraft/i, name: 'Minecraft' },
    { pattern: /cyberpunk/i, name: 'Cyberpunk 2077' },
    { pattern: /call.*duty|cod|warzone/i, name: 'Call of Duty' }
  ];

  const title = document.title.toLowerCase();
  const url = window.location.href.toLowerCase();
  const combined = `${title} ${url}`;

  for (const game of gamePatterns) {
    if (game.pattern.test(combined)) {
      return game.name;
    }
  }

  // Simulate random game detection for demo
  const randomGames = ['Counter-Strike 2', 'Valorant', 'Apex Legends', '-'];
  const randomIndex = Math.floor(Math.random() * randomGames.length);
  return randomGames[randomIndex];
};

export const usePerformance = (gameBoosts: GameBoosts) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    cpuUsage: 45,
    memoryUsage: 65,
    networkLatency: 28,
    ping: 45,
    currentGame: '-'
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const simulateMetrics = useCallback(() => {
    const currentGame = detectCurrentGame();
    const isGameRunning = currentGame !== '-';
    
    // Calculate boost effects
    const fpsBoost = gameBoosts.turboBoost ? 25 : 0;
    const fpsStabilization = gameBoosts.fpsStabilizer ? 15 : 0;
    const memoryBoost = gameBoosts.deepClean ? -20 : 0;
    const latencyBoost = gameBoosts.ultraReflex ? -15 : 0;
    const pingBoost = gameBoosts.ultraReflex ? -10 : 0;
    
    setMetrics(prev => {
      let baseFps = isGameRunning ? 
        Math.max(45, Math.min(165, prev.fps + (Math.random() - 0.5) * 8)) :
        Math.max(120, Math.min(144, prev.fps + (Math.random() - 0.5) * 3));
      
      let gamePing = isGameRunning ? 
        Math.max(5, Math.min(120, prev.ping + (Math.random() - 0.5) * 8)) :
        0;
      
      return {
        fps: Math.round(baseFps + fpsBoost + fpsStabilization),
        cpuUsage: Math.max(15, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10 + (gameBoosts.silentMode ? -10 : 0))),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5 + memoryBoost)),
        networkLatency: Math.max(8, Math.min(150, prev.networkLatency + (Math.random() - 0.5) * 12 + latencyBoost)),
        ping: isGameRunning ? Math.max(5, Math.min(120, gamePing + pingBoost)) : 0,
        currentGame
      };
    });
  }, [gameBoosts]);

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