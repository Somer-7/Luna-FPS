import psutil
import random
import subprocess
import platform

class PerformanceMonitor:
    def __init__(self):
        self.current_fps = 60
        self.current_ping = 0
        self.current_game = "-"

    def detect_game(self):
        """Detect running games by process name"""
        try:
            games = {
                'cs2.exe': 'Counter-Strike 2',
                'csgo.exe': 'Counter-Strike GO',
                'valorant.exe': 'Valorant',
                'r5apex.exe': 'Apex Legends',
                'fortnite.exe': 'Fortnite',
                'overwatch.exe': 'Overwatch 2',
                'league of legends.exe': 'League of Legends',
                'dota2.exe': 'Dota 2',
                'minecraft.exe': 'Minecraft',
                'cyberpunk2077.exe': 'Cyberpunk 2077'
            }
            
            for proc in psutil.process_iter(['name']):
                proc_name = proc.info['name'].lower()
                for game_exe, game_name in games.items():
                    if game_exe.lower() in proc_name:
                        return game_name
            
            return "-"
        except:
            return "-"

    def get_ping(self, game):
        """Simulate getting ping for games"""
        if game == "-":
            return 0
        return random.randint(15, 80)

    def get_fps(self, game, boosts):
        """Calculate FPS based on game and boosts"""
        base_fps = 60 if game != "-" else 120
        
        # Apply boosts
        if boosts.get('turbo', False):
            base_fps += 25
        if boosts.get('clean', False):
            base_fps += 10
        if boosts.get('reflex', False):
            base_fps += 15
            
        # Add some randomness
        variation = random.randint(-5, 5)
        return max(30, min(240, base_fps + variation))

    def get_metrics(self, boosts):
        """Get current performance metrics"""
        game = self.detect_game()
        fps = self.get_fps(game, boosts)
        ping = self.get_ping(game)
        
        # Apply ping reduction from reflex boost
        if boosts.get('reflex', False) and ping > 0:
            ping = max(5, ping - 15)
        
        return {
            'fps': fps,
            'ping': ping,
            'game': game,
            'cpu': psutil.cpu_percent(),
            'memory': psutil.virtual_memory().percent
        }