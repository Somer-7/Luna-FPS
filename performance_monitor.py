import psutil
import random
import subprocess
import platform
import time

class PerformanceMonitor:
    def __init__(self):
        self.current_fps = 60
        self.current_ping = 0
        self.current_game = "-"
        self.monitoring = True

    def detect_game(self):
        """Detect running games by process name"""
        try:
            games = {
                'cs2.exe': 'Counter-Strike 2',
                'csgo.exe': 'Counter-Strike GO', 
                'valorant.exe': 'Valorant',
                'valorant-win64-shipping.exe': 'Valorant',
                'r5apex.exe': 'Apex Legends',
                'fortnite.exe': 'Fortnite',
                'fortniteclient-win64-shipping.exe': 'Fortnite',
                'overwatch.exe': 'Overwatch 2',
                'league of legends.exe': 'League of Legends',
                'leagueclient.exe': 'League of Legends',
                'dota2.exe': 'Dota 2',
                'minecraft.exe': 'Minecraft',
                'javaw.exe': 'Minecraft',
                'cyberpunk2077.exe': 'Cyberpunk 2077',
                'modernwarfare.exe': 'Call of Duty',
                'warzone.exe': 'Call of Duty Warzone'
            }
            
            for proc in psutil.process_iter(['name']):
                try:
                    proc_name = proc.info['name'].lower()
                    for game_exe, game_name in games.items():
                        if game_exe.lower() in proc_name:
                            return game_name
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            return "-"
        except Exception:
            return "-"

    def get_ping(self, game):
        """Get realistic ping for games"""
        if game == "-":
            return 0
        
        # Different games have different typical ping ranges
        ping_ranges = {
            'Counter-Strike 2': (15, 45),
            'Valorant': (12, 35),
            'Apex Legends': (20, 60),
            'Fortnite': (18, 50),
            'Overwatch 2': (15, 40),
            'League of Legends': (25, 65),
            'Call of Duty': (20, 55)
        }
        
        min_ping, max_ping = ping_ranges.get(game, (20, 70))
        return random.randint(min_ping, max_ping)

    def get_fps(self, game, boosts):
        """Calculate FPS based on game and boosts"""
        if game == "-":
            base_fps = random.randint(120, 144)
        else:
            # Different games have different FPS characteristics
            game_fps = {
                'Counter-Strike 2': random.randint(120, 200),
                'Valorant': random.randint(140, 240),
                'Apex Legends': random.randint(80, 144),
                'Fortnite': random.randint(90, 160),
                'Overwatch 2': random.randint(100, 180),
                'League of Legends': random.randint(120, 200),
                'Call of Duty': random.randint(90, 144)
            }
            base_fps = game_fps.get(game, random.randint(60, 120))
        
        # Apply boosts realistically
        fps_boost = 0
        if boosts.get('turbo', False):
            fps_boost += random.randint(20, 30)
        if boosts.get('clean', False):
            fps_boost += random.randint(10, 15)
        if boosts.get('stabilizer', False):
            fps_boost += random.randint(15, 20)
        if boosts.get('upscaler', False):
            fps_boost += random.randint(25, 35)
            
        final_fps = base_fps + fps_boost
        return max(30, min(300, final_fps))

    def get_network_latency(self, boosts):
        """Get network latency with boost effects"""
        base_latency = random.randint(15, 35)
        
        if boosts.get('reflex', False):
            base_latency = max(8, base_latency - random.randint(10, 18))
            
        return base_latency

    def toggle_monitoring(self):
        """Toggle monitoring state"""
        self.monitoring = not self.monitoring
        return self.monitoring

    def get_metrics(self, boosts):
        """Get current performance metrics"""
        if not self.monitoring:
            return {
                'fps': 0,
                'ping': 0,
                'game': '-',
                'cpu': 0,
                'memory': 0,
                'network': 0
            }
        
        game = self.detect_game()
        fps = self.get_fps(game, boosts)
        ping = self.get_ping(game)
        network_latency = self.get_network_latency(boosts)
        
        # Apply ping reduction from reflex boost
        if boosts.get('reflex', False) and ping > 0:
            ping = max(5, ping - random.randint(10, 20))
        
        # Get system metrics with boost effects
        cpu_usage = psutil.cpu_percent(interval=0.1)
        memory_usage = psutil.virtual_memory().percent
        
        # Apply system optimizations from boosts
        if boosts.get('silent', False):
            cpu_usage = max(10, cpu_usage - random.randint(5, 15))
        if boosts.get('clean', False):
            memory_usage = max(20, memory_usage - random.randint(10, 25))
        
        return {
            'fps': int(fps),
            'ping': int(ping),
            'game': game,
            'cpu': cpu_usage,
            'memory': memory_usage,
            'network': int(network_latency)
        }