#!/usr/bin/env python3
import tkinter as tk
from tkinter import ttk
import threading
import time
from performance_monitor import PerformanceMonitor

class FPSBoosterApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Luna FPS — FPS Booster & 0 Delay Optimizer")
        self.root.geometry("1200x800")
        self.root.configure(bg='#0a0a0a')
        self.monitor = PerformanceMonitor()
        self.setup_styles()
        self.setup_ui()
        self.start_monitoring()

    def setup_styles(self):
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Dark theme colors
        self.colors = {
            'bg': '#0a0a0a',
            'card_bg': '#1a1a1a',
            'border': '#333333',
            'text': '#ffffff',
            'accent': '#00ff00',
            'muted': '#888888',
            'hero': '#ff6b35'
        }

    def setup_ui(self):
        # Main container
        main_frame = tk.Frame(self.root, bg=self.colors['bg'])
        main_frame.pack(fill='both', expand=True, padx=20, pady=20)

        # Header
        header_frame = tk.Frame(main_frame, bg=self.colors['bg'])
        header_frame.pack(fill='x', pady=(0, 20))
        
        # Hero section
        hero_frame = tk.Frame(header_frame, bg=self.colors['card_bg'], relief='raised', bd=2)
        hero_frame.pack(fill='x', pady=(0, 20))
        
        hero_title = tk.Label(hero_frame, text="Luna FPS", font=("Arial", 32, "bold"), 
                             fg=self.colors['accent'], bg=self.colors['card_bg'])
        hero_title.pack(pady=20)
        
        hero_subtitle = tk.Label(hero_frame, text="FPS Booster & 0 Delay Optimizer", 
                                font=("Arial", 16), fg=self.colors['text'], bg=self.colors['card_bg'])
        hero_subtitle.pack(pady=(0, 20))

        # Performance Monitor Section
        perf_frame = tk.LabelFrame(main_frame, text="Monitor wydajności", 
                                  font=("Arial", 14, "bold"), fg=self.colors['accent'], 
                                  bg=self.colors['card_bg'], relief='raised', bd=2)
        perf_frame.pack(fill='x', pady=(0, 20))

        # Metrics grid
        metrics_grid = tk.Frame(perf_frame, bg=self.colors['card_bg'])
        metrics_grid.pack(fill='x', padx=20, pady=20)

        # Left column - Game info
        left_col = tk.Frame(metrics_grid, bg=self.colors['card_bg'])
        left_col.pack(side='left', fill='both', expand=True)

        self.game_label = tk.Label(left_col, text="🎮 Gra: -", font=("Arial", 14, "bold"), 
                                  fg=self.colors['text'], bg=self.colors['card_bg'])
        self.game_label.pack(pady=5, anchor='w')

        self.fps_label = tk.Label(left_col, text="📊 FPS: 60", font=("Arial", 14, "bold"), 
                                 fg=self.colors['accent'], bg=self.colors['card_bg'])
        self.fps_label.pack(pady=5, anchor='w')

        self.ping_label = tk.Label(left_col, text="📡 Ping: -", font=("Arial", 14), 
                                  fg=self.colors['text'], bg=self.colors['card_bg'])
        self.ping_label.pack(pady=5, anchor='w')

        # Right column - System metrics
        right_col = tk.Frame(metrics_grid, bg=self.colors['card_bg'])
        right_col.pack(side='right', fill='both', expand=True)

        self.cpu_label = tk.Label(right_col, text="🖥️ CPU: 0%", font=("Arial", 12), 
                                 fg=self.colors['text'], bg=self.colors['card_bg'])
        self.cpu_label.pack(pady=5, anchor='w')

        self.memory_label = tk.Label(right_col, text="💾 RAM: 0%", font=("Arial", 12), 
                                    fg=self.colors['text'], bg=self.colors['card_bg'])
        self.memory_label.pack(pady=5, anchor='w')

        self.network_label = tk.Label(right_col, text="🌐 Network: 0ms", font=("Arial", 12), 
                                     fg=self.colors['text'], bg=self.colors['card_bg'])
        self.network_label.pack(pady=5, anchor='w')

        # Game Boosts Section
        boosts_frame = tk.LabelFrame(main_frame, text="Tryb zaawansowany - Game Boosts", 
                                    font=("Arial", 14, "bold"), fg=self.colors['accent'], 
                                    bg=self.colors['card_bg'], relief='raised', bd=2)
        boosts_frame.pack(fill='x', pady=(0, 20))

        boosts_grid = tk.Frame(boosts_frame, bg=self.colors['card_bg'])
        boosts_grid.pack(fill='x', padx=20, pady=20)

        # Boost variables
        self.turbo_var = tk.BooleanVar()
        self.clean_var = tk.BooleanVar()
        self.silent_var = tk.BooleanVar()
        self.reflex_var = tk.BooleanVar()
        self.upscaler_var = tk.BooleanVar()
        self.stabilizer_var = tk.BooleanVar()

        boosts = [
            ("🏎️ Turbo Boost", self.turbo_var),
            ("🧹 Deep Clean", self.clean_var),
            ("💤 Silent Mode", self.silent_var),
            ("⚡ Ultra Reflex", self.reflex_var),
            ("🖼️ Auto DLSS/FSR", self.upscaler_var),
            ("🏎️ FPS Stabilizer", self.stabilizer_var)
        ]

        for i, (text, var) in enumerate(boosts):
            row = i // 2
            col = i % 2
            
            boost_frame = tk.Frame(boosts_grid, bg=self.colors['card_bg'])
            boost_frame.grid(row=row, column=col, padx=10, pady=10, sticky='w')
            
            cb = tk.Checkbutton(boost_frame, text=text, variable=var,
                               font=("Arial", 12), fg=self.colors['text'], 
                               bg=self.colors['card_bg'], selectcolor=self.colors['border'],
                               activebackground=self.colors['card_bg'])
            cb.pack(anchor='w')

        # Auto Boost Section
        auto_frame = tk.LabelFrame(main_frame, text="Auto Boost", 
                                  font=("Arial", 14, "bold"), fg=self.colors['hero'], 
                                  bg=self.colors['card_bg'], relief='raised', bd=2)
        auto_frame.pack(fill='x', pady=(0, 20))

        auto_content = tk.Frame(auto_frame, bg=self.colors['card_bg'])
        auto_content.pack(fill='x', padx=20, pady=20)

        self.auto_boost_var = tk.BooleanVar()
        auto_cb = tk.Checkbutton(auto_content, text="🚀 Auto Boost (automatyczna optymalizacja)", 
                                variable=self.auto_boost_var, font=("Arial", 14, "bold"),
                                fg=self.colors['hero'], bg=self.colors['card_bg'], 
                                selectcolor=self.colors['border'],
                                activebackground=self.colors['card_bg'])
        auto_cb.pack(anchor='w')

        # Quick Actions
        actions_frame = tk.Frame(main_frame, bg=self.colors['bg'])
        actions_frame.pack(fill='x')

        run_btn = tk.Button(actions_frame, text="🚀 Uruchom wszystko", font=("Arial", 14, "bold"),
                           bg=self.colors['hero'], fg='white', relief='raised', bd=3,
                           command=self.run_all_optimizations)
        run_btn.pack(side='left', padx=(0, 10))

        monitor_btn = tk.Button(actions_frame, text="📊 Toggle Monitor", font=("Arial", 12),
                               bg=self.colors['accent'], fg='black', relief='raised', bd=2,
                               command=self.toggle_monitoring)
        monitor_btn.pack(side='left')

    def run_all_optimizations(self):
        """Simulate running all FPS optimizations"""
        import tkinter.messagebox as msgbox
        msgbox.showinfo("Luna FPS", "🚀 Uruchamianie wszystkich optymalizacji...\n" +
                       "✅ Optymalizacja CPU\n✅ Optymalizacja GPU\n✅ Czyszczenie RAM\n" +
                       "✅ Redukcja Input Lag\n✅ GPU Low Latency\n✅ Game Mode")
    
    def toggle_monitoring(self):
        """Toggle performance monitoring"""
        self.monitor.toggle_monitoring()
    
    def start_monitoring(self):
        def update_loop():
            while True:
                boosts = {
                    'turbo': self.turbo_var.get(),
                    'clean': self.clean_var.get(),
                    'silent': self.silent_var.get(),
                    'reflex': self.reflex_var.get(),
                    'upscaler': self.upscaler_var.get(),
                    'stabilizer': self.stabilizer_var.get()
                }
                metrics = self.monitor.get_metrics(boosts)
                
                # Update UI with colors
                fps_color = '#00ff00' if metrics['fps'] >= 120 else '#ffff00' if metrics['fps'] >= 60 else '#ff0000'
                self.fps_label.config(text=f"📊 FPS: {metrics['fps']}", fg=fps_color)
                
                game_color = '#ffff00' if metrics['game'] != '-' else self.colors['muted']
                self.game_label.config(text=f"🎮 Gra: {metrics['game']}", fg=game_color)
                
                ping_text = f"📡 Ping: {metrics['ping']}ms" if metrics['ping'] > 0 else "📡 Ping: -"
                self.ping_label.config(text=ping_text)
                
                # System metrics
                cpu_color = '#ff0000' if metrics['cpu'] >= 80 else '#ffff00' if metrics['cpu'] >= 60 else self.colors['text']
                self.cpu_label.config(text=f"🖥️ CPU: {int(metrics['cpu'])}%", fg=cpu_color)
                
                mem_color = '#ff0000' if metrics['memory'] >= 80 else '#ffff00' if metrics['memory'] >= 60 else self.colors['text']
                self.memory_label.config(text=f"💾 RAM: {int(metrics['memory'])}%", fg=mem_color)
                
                self.network_label.config(text=f"🌐 Network: {int(metrics['network'])}ms")
                
                time.sleep(2)

        thread = threading.Thread(target=update_loop, daemon=True)
        thread.start()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = FPSBoosterApp()
    app.run()