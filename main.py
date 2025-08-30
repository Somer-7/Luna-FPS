#!/usr/bin/env python3
import tkinter as tk
from tkinter import ttk
import threading
import time
from performance_monitor import PerformanceMonitor

class FPSBoosterApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("FPS Booster Pro")
        self.root.geometry("400x500")
        self.root.configure(bg='#1a1a1a')
        self.monitor = PerformanceMonitor()
        self.setup_ui()
        self.start_monitoring()

    def setup_ui(self):
        # Title
        title = tk.Label(self.root, text="FPS BOOSTER PRO", font=("Arial", 20, "bold"), 
                        fg='#00ff00', bg='#1a1a1a')
        title.pack(pady=20)

        # Metrics frame
        metrics_frame = tk.Frame(self.root, bg='#2a2a2a', relief='raised', bd=2)
        metrics_frame.pack(pady=10, padx=20, fill='x')

        self.fps_label = tk.Label(metrics_frame, text="FPS: 60", font=("Arial", 14), 
                                 fg='#ffffff', bg='#2a2a2a')
        self.fps_label.pack(pady=5)

        self.game_label = tk.Label(metrics_frame, text="Game: -", font=("Arial", 12), 
                                  fg='#ffff00', bg='#2a2a2a')
        self.game_label.pack(pady=5)

        self.ping_label = tk.Label(metrics_frame, text="Ping: -", font=("Arial", 12), 
                                  fg='#ff9900', bg='#2a2a2a')
        self.ping_label.pack(pady=5)

        # Boosts frame
        boosts_frame = tk.Frame(self.root, bg='#1a1a1a')
        boosts_frame.pack(pady=20)

        tk.Label(boosts_frame, text="GAME BOOSTS", font=("Arial", 16, "bold"), 
                fg='#00ff00', bg='#1a1a1a').pack(pady=10)

        self.turbo_var = tk.BooleanVar()
        self.clean_var = tk.BooleanVar()
        self.reflex_var = tk.BooleanVar()

        tk.Checkbutton(boosts_frame, text="Turbo Boost", variable=self.turbo_var,
                      font=("Arial", 12), fg='#ffffff', bg='#1a1a1a', 
                      selectcolor='#333333').pack(pady=5)
        
        tk.Checkbutton(boosts_frame, text="Deep Clean", variable=self.clean_var,
                      font=("Arial", 12), fg='#ffffff', bg='#1a1a1a',
                      selectcolor='#333333').pack(pady=5)
        
        tk.Checkbutton(boosts_frame, text="Ultra Reflex", variable=self.reflex_var,
                      font=("Arial", 12), fg='#ffffff', bg='#1a1a1a',
                      selectcolor='#333333').pack(pady=5)

    def start_monitoring(self):
        def update_loop():
            while True:
                boosts = {
                    'turbo': self.turbo_var.get(),
                    'clean': self.clean_var.get(),
                    'reflex': self.reflex_var.get()
                }
                metrics = self.monitor.get_metrics(boosts)
                
                self.fps_label.config(text=f"FPS: {metrics['fps']}")
                self.game_label.config(text=f"Game: {metrics['game']}")
                ping_text = f"Ping: {metrics['ping']}" if metrics['ping'] > 0 else "Ping: -"
                self.ping_label.config(text=ping_text)
                
                time.sleep(2)

        thread = threading.Thread(target=update_loop, daemon=True)
        thread.start()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = FPSBoosterApp()
    app.run()