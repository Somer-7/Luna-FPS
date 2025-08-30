#!/usr/bin/env python3
import tkinter as tk
from tkinter import ttk, messagebox
import threading
import time
from performance_monitor import PerformanceMonitor

class ModernCard(tk.Frame):
    def __init__(self, parent, title="", description="", **kwargs):
        super().__init__(parent, bg='#1a1a1a', relief='raised', bd=1, **kwargs)
        self.title = title
        self.description = description
        self.setup_card()
    
    def setup_card(self):
        # Card header
        if self.title:
            header = tk.Frame(self, bg='#1a1a1a')
            header.pack(fill='x', padx=15, pady=(15, 5))
            
            title_label = tk.Label(header, text=self.title, font=("Segoe UI", 14, "bold"),
                                 fg='#ffffff', bg='#1a1a1a')
            title_label.pack(anchor='w')
            
            if self.description:
                desc_label = tk.Label(header, text=self.description, font=("Segoe UI", 10),
                                    fg='#888888', bg='#1a1a1a')
                desc_label.pack(anchor='w')

class ProgressBarCustom(tk.Frame):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, bg='#1a1a1a', **kwargs)
        self.value = 0
        self.setup_progress()
    
    def setup_progress(self):
        self.canvas = tk.Canvas(self, height=8, bg='#333333', highlightthickness=0)
        self.canvas.pack(fill='x', padx=2, pady=2)
        
    def set_value(self, value):
        self.value = max(0, min(100, value))
        self.update_progress()
    
    def update_progress(self):
        self.canvas.delete("all")
        width = self.canvas.winfo_width()
        if width > 1:
            fill_width = int(width * self.value / 100)
            color = '#ff6b35' if self.value >= 80 else '#00ff00' if self.value > 0 else '#333333'
            if fill_width > 0:
                self.canvas.create_rectangle(0, 0, fill_width, 8, fill=color, outline="")
        self.after(50, self.update_progress)

class LunaFPSApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Luna FPS — FPS Booster & 0 Delay Optimizer")
        self.root.geometry("1400x900")
        self.root.configure(bg='#0a0a0a')
        self.root.resizable(True, True)
        
        self.monitor = PerformanceMonitor()
        self.setup_variables()
        self.setup_styles()
        self.setup_ui()
        self.start_monitoring()

    def setup_variables(self):
        # Task progress tracking
        self.tasks = {
            'cpu': tk.IntVar(value=0),
            'gpu': tk.IntVar(value=0), 
            'ram': tk.IntVar(value=0),
            'input': tk.IntVar(value=0),
            'lowlatency': tk.IntVar(value=0),
            'vsync': tk.IntVar(value=0),
            'gamemode': tk.IntVar(value=0),
            'cache': tk.IntVar(value=0)
        }
        
        # Game boosts
        self.game_boosts = {
            'turboBoost': tk.BooleanVar(),
            'deepClean': tk.BooleanVar(),
            'silentMode': tk.BooleanVar(),
            'ultraReflex': tk.BooleanVar(),
            'autoUpscaler': tk.BooleanVar(),
            'fpsStabilizer': tk.BooleanVar()
        }
        
        # Auto boost
        self.auto_boost = tk.BooleanVar()
        
        # Running tasks
        self.running_tasks = set()

    def setup_styles(self):
        self.colors = {
            'bg': '#0a0a0a',
            'card_bg': '#1a1a1a', 
            'border': '#333333',
            'text': '#ffffff',
            'muted': '#888888',
            'accent': '#00ff00',
            'hero': '#ff6b35',
            'warning': '#ffff00',
            'danger': '#ff0000'
        }

    def setup_ui(self):
        # Main scrollable container
        main_canvas = tk.Canvas(self.root, bg=self.colors['bg'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.root, orient="vertical", command=main_canvas.yview)
        self.scrollable_frame = tk.Frame(main_canvas, bg=self.colors['bg'])

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: main_canvas.configure(scrollregion=main_canvas.bbox("all"))
        )

        main_canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        main_canvas.configure(yscrollcommand=scrollbar.set)

        main_canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Bind mousewheel
        def _on_mousewheel(event):
            main_canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        main_canvas.bind_all("<MouseWheel>", _on_mousewheel)

        # Hero section
        self.setup_hero()
        
        # Performance Monitor
        self.setup_performance_monitor()
        
        # Main content tabs
        self.setup_tabs()

    def setup_hero(self):
        hero_frame = ModernCard(self.scrollable_frame, bg=self.colors['card_bg'])
        hero_frame.pack(fill='x', padx=20, pady=20)
        
        # Hero content
        hero_content = tk.Frame(hero_frame, bg=self.colors['card_bg'])
        hero_content.pack(fill='x', padx=20, pady=20)
        
        # Title
        title = tk.Label(hero_content, text="Luna FPS", font=("Segoe UI", 36, "bold"),
                        fg=self.colors['accent'], bg=self.colors['card_bg'])
        title.pack(pady=(0, 10))
        
        # Subtitle
        subtitle = tk.Label(hero_content, text="FPS Booster & 0 Delay Optimizer", 
                           font=("Segoe UI", 16), fg=self.colors['text'], bg=self.colors['card_bg'])
        subtitle.pack(pady=(0, 20))
        
        # Auto boost section
        auto_frame = tk.Frame(hero_content, bg=self.colors['card_bg'])
        auto_frame.pack(fill='x', pady=10)
        
        auto_cb = tk.Checkbutton(auto_frame, text="🚀 Auto Boost (automatyczna optymalizacja)",
                                variable=self.auto_boost, font=("Segoe UI", 14, "bold"),
                                fg=self.colors['hero'], bg=self.colors['card_bg'],
                                selectcolor=self.colors['border'], activebackground=self.colors['card_bg'],
                                command=self.toggle_auto_boost)
        auto_cb.pack(anchor='w')
        
        # Quick action buttons
        buttons_frame = tk.Frame(hero_content, bg=self.colors['card_bg'])
        buttons_frame.pack(fill='x', pady=20)
        
        run_all_btn = tk.Button(buttons_frame, text="🚀 Uruchom wszystko", 
                               font=("Segoe UI", 12, "bold"), bg=self.colors['hero'], 
                               fg='white', relief='flat', padx=20, pady=10,
                               command=self.run_all_optimizations)
        run_all_btn.pack(side='left', padx=(0, 10))

    def setup_performance_monitor(self):
        perf_card = ModernCard(self.scrollable_frame, "Monitor wydajności", "Metryki w czasie rzeczywistym")
        perf_card.pack(fill='x', padx=20, pady=(0, 20))
        
        perf_content = tk.Frame(perf_card, bg=self.colors['card_bg'])
        perf_content.pack(fill='x', padx=15, pady=(0, 15))
        
        # Metrics grid
        metrics_grid = tk.Frame(perf_content, bg=self.colors['card_bg'])
        metrics_grid.pack(fill='x', pady=10)
        
        # Left column
        left_col = tk.Frame(metrics_grid, bg=self.colors['card_bg'])
        left_col.pack(side='left', fill='both', expand=True)
        
        self.game_label = tk.Label(left_col, text="🎮 Gra: -", font=("Segoe UI", 12, "bold"),
                                  fg=self.colors['text'], bg=self.colors['card_bg'])
        self.game_label.pack(anchor='w', pady=2)
        
        self.fps_label = tk.Label(left_col, text="📊 FPS: 60", font=("Segoe UI", 12, "bold"),
                                 fg=self.colors['accent'], bg=self.colors['card_bg'])
        self.fps_label.pack(anchor='w', pady=2)
        
        self.ping_label = tk.Label(left_col, text="📡 Ping: -", font=("Segoe UI", 12),
                                  fg=self.colors['text'], bg=self.colors['card_bg'])
        self.ping_label.pack(anchor='w', pady=2)
        
        # Right column  
        right_col = tk.Frame(metrics_grid, bg=self.colors['card_bg'])
        right_col.pack(side='right', fill='both', expand=True)
        
        self.cpu_label = tk.Label(right_col, text="🖥️ CPU: 0%", font=("Segoe UI", 10),
                                 fg=self.colors['text'], bg=self.colors['card_bg'])
        self.cpu_label.pack(anchor='w', pady=2)
        
        self.memory_label = tk.Label(right_col, text="💾 RAM: 0%", font=("Segoe UI", 10),
                                    fg=self.colors['text'], bg=self.colors['card_bg'])
        self.memory_label.pack(anchor='w', pady=2)
        
        self.network_label = tk.Label(right_col, text="🌐 Network: 0ms", font=("Segoe UI", 10),
                                     fg=self.colors['text'], bg=self.colors['card_bg'])
        self.network_label.pack(anchor='w', pady=2)

    def setup_tabs(self):
        # Tab container
        tab_container = tk.Frame(self.scrollable_frame, bg=self.colors['bg'])
        tab_container.pack(fill='both', expand=True, padx=20, pady=(0, 20))
        
        # Tab buttons
        tab_buttons_frame = tk.Frame(tab_container, bg=self.colors['bg'])
        tab_buttons_frame.pack(fill='x', pady=(0, 20))
        
        self.current_tab = tk.StringVar(value="podstawowe")
        
        tabs = [
            ("podstawowe", "Podstawowe"),
            ("gry", "Gry"),
            ("zaawansowane", "Zaawansowane"),
            ("developer", "Developer")
        ]
        
        for tab_id, tab_name in tabs:
            btn = tk.Button(tab_buttons_frame, text=tab_name, font=("Segoe UI", 11, "bold"),
                           bg=self.colors['card_bg'], fg=self.colors['text'], relief='flat',
                           padx=20, pady=8, command=lambda t=tab_id: self.switch_tab(t))
            btn.pack(side='left', padx=(0, 5))
        
        # Tab content area
        self.tab_content = tk.Frame(tab_container, bg=self.colors['bg'])
        self.tab_content.pack(fill='both', expand=True)
        
        # Initialize with basic tab
        self.switch_tab("podstawowe")

    def switch_tab(self, tab_name):
        self.current_tab.set(tab_name)
        
        # Clear current content
        for widget in self.tab_content.winfo_children():
            widget.destroy()
        
        if tab_name == "podstawowe":
            self.setup_basic_tab()
        elif tab_name == "gry":
            self.setup_games_tab()
        elif tab_name == "zaawansowane":
            self.setup_advanced_tab()
        elif tab_name == "developer":
            self.setup_developer_tab()

    def setup_basic_tab(self):
        # Basic optimization tasks
        basic_tasks = [
            ('cpu', '🖥️ Optymalizacja procesora', 'Wyłącz zbędne procesy i podnieś priorytet gier'),
            ('gpu', '🎮 Optymalizacja GPU', 'Reset/ustawienia sterowników, odśmiecenie VRAM'),
            ('ram', '💾 Czyszczenie RAM', 'Zwolnij pamięć dla gier'),
            ('input', '⚡ Input Lag', 'Wyłącz buforowanie wejścia'),
            ('lowlatency', '📊 GPU Low Latency', 'Tryb niskich opóźnień'),
            ('vsync', '🎮 V-Sync', 'Wyłącz synchronizację pionową'),
            ('gamemode', '🚀 Game Mode', 'Automatyczne ustawienia Windows'),
            ('cache', '⚡ Cache DX/Shaders', 'Szybkie czyszczenie cache')
        ]
        
        # Create grid
        grid_frame = tk.Frame(self.tab_content, bg=self.colors['bg'])
        grid_frame.pack(fill='both', expand=True)
        
        for i, (task_id, title, desc) in enumerate(basic_tasks):
            row = i // 2
            col = i % 2
            
            card = self.create_task_card(grid_frame, task_id, title, desc)
            card.grid(row=row, column=col, padx=10, pady=10, sticky='nsew')
            
        # Configure grid weights
        for i in range(2):
            grid_frame.columnconfigure(i, weight=1)

    def setup_games_tab(self):
        game_text = tk.Label(self.tab_content, text="🎮 Profile gier (w rozwoju)", 
                            font=("Segoe UI", 16, "bold"), fg=self.colors['accent'], 
                            bg=self.colors['bg'])
        game_text.pack(pady=50)

    def setup_advanced_tab(self):
        # Game boosts section
        boosts_card = ModernCard(self.tab_content, "Tryb zaawansowany", "Skalowanie, wygładzenie i pro‑funkcje")
        boosts_card.pack(fill='x', pady=(0, 20))
        
        boosts_content = tk.Frame(boosts_card, bg=self.colors['card_bg'])
        boosts_content.pack(fill='x', padx=15, pady=(0, 15))
        
        # Boosts grid
        boosts_grid = tk.Frame(boosts_content, bg=self.colors['card_bg'])
        boosts_grid.pack(fill='x', pady=10)
        
        boosts = [
            ("turboBoost", "🏎️ Turbo Boost"),
            ("deepClean", "🧹 Deep Clean"),
            ("silentMode", "💤 Silent Mode"),
            ("ultraReflex", "⚡ Ultra Reflex"),
            ("autoUpscaler", "🖼️ Auto DLSS/FSR"),
            ("fpsStabilizer", "🏎️ FPS Stabilizer")
        ]
        
        for i, (boost_id, boost_name) in enumerate(boosts):
            row = i // 2
            col = i % 2
            
            boost_frame = tk.Frame(boosts_grid, bg=self.colors['card_bg'])
            boost_frame.grid(row=row, column=col, padx=20, pady=8, sticky='w')
            
            cb = tk.Checkbutton(boost_frame, text=boost_name, variable=self.game_boosts[boost_id],
                               font=("Segoe UI", 12), fg=self.colors['text'],
                               bg=self.colors['card_bg'], selectcolor=self.colors['border'],
                               activebackground=self.colors['card_bg'])
            cb.pack(anchor='w')

    def setup_developer_tab(self):
        dev_text = tk.Label(self.tab_content, text="⚙️ Tryb deweloperski (w rozwoju)", 
                           font=("Segoe UI", 16, "bold"), fg=self.colors['warning'], 
                           bg=self.colors['bg'])
        dev_text.pack(pady=50)

    def create_task_card(self, parent, task_id, title, description):
        card = ModernCard(parent, title, description)
        
        # Progress bar
        progress_frame = tk.Frame(card, bg=self.colors['card_bg'])
        progress_frame.pack(fill='x', padx=15, pady=10)
        
        progress_bar = ProgressBarCustom(progress_frame)
        progress_bar.pack(fill='x')
        
        # Store reference for updates
        setattr(self, f'{task_id}_progress', progress_bar)
        
        # Buttons
        button_frame = tk.Frame(card, bg=self.colors['card_bg'])
        button_frame.pack(fill='x', padx=15, pady=(0, 15))
        
        # Status text
        status_text = tk.Label(button_frame, text="Gotowe do startu", font=("Segoe UI", 9),
                              fg=self.colors['muted'], bg=self.colors['card_bg'])
        status_text.pack(side='left')
        
        # Store status label reference
        setattr(self, f'{task_id}_status', status_text)
        
        # Action buttons
        btn_frame = tk.Frame(button_frame, bg=self.colors['card_bg'])
        btn_frame.pack(side='right')
        
        disable_btn = tk.Button(btn_frame, text="Wyłącz", font=("Segoe UI", 9),
                               bg=self.colors['border'], fg=self.colors['text'], relief='flat',
                               padx=15, pady=5, command=lambda: self.disable_task(task_id))
        disable_btn.pack(side='left', padx=(0, 5))
        
        run_btn = tk.Button(btn_frame, text="Uruchom", font=("Segoe UI", 9, "bold"),
                           bg=self.colors['hero'], fg='white', relief='flat',
                           padx=15, pady=5, command=lambda: self.run_task(task_id))
        run_btn.pack(side='left')
        
        # Store button reference
        setattr(self, f'{task_id}_run_btn', run_btn)
        
        return card

    def run_task(self, task_id):
        if task_id in self.running_tasks:
            return
            
        self.running_tasks.add(task_id)
        progress_bar = getattr(self, f'{task_id}_progress')
        status_label = getattr(self, f'{task_id}_status')
        run_btn = getattr(self, f'{task_id}_run_btn')
        
        status_label.config(text="W trakcie...")
        run_btn.config(text="Pracuję", state='disabled')
        
        def animate_progress():
            for i in range(101):
                progress_bar.set_value(i)
                time.sleep(0.02)
            
            status_label.config(text="Zakończono pomyślnie")
            run_btn.config(text="Uruchom ponownie", state='normal')
            self.running_tasks.discard(task_id)
            
        threading.Thread(target=animate_progress, daemon=True).start()

    def disable_task(self, task_id):
        if task_id in self.running_tasks:
            self.running_tasks.discard(task_id)
        
        progress_bar = getattr(self, f'{task_id}_progress')
        status_label = getattr(self, f'{task_id}_status')
        run_btn = getattr(self, f'{task_id}_run_btn')
        
        progress_bar.set_value(0)
        status_label.config(text="Wyłączono")
        run_btn.config(text="Uruchom", state='normal')

    def run_all_optimizations(self):
        """Run all basic optimizations"""
        if self.auto_boost.get():
            tasks = ['cpu', 'gpu', 'ram', 'input', 'lowlatency', 'vsync', 'gamemode', 'cache']
            for task in tasks:
                if hasattr(self, f'{task}_progress'):
                    self.run_task(task)

    def toggle_auto_boost(self):
        if self.auto_boost.get():
            messagebox.showinfo("Auto Boost", "🚀 Auto Boost aktywowany!\nAutomatyczna optymalizacja uruchomiona.")
            self.run_all_optimizations()
        else:
            messagebox.showinfo("Auto Boost", "Auto Boost wyłączony.")

    def start_monitoring(self):
        def update_loop():
            while True:
                boosts = {k: v.get() for k, v in self.game_boosts.items()}
                metrics = self.monitor.get_metrics(boosts)
                
                # Update labels with colors
                fps_color = self.colors['accent'] if metrics['fps'] >= 120 else self.colors['warning'] if metrics['fps'] >= 60 else self.colors['danger']
                self.fps_label.config(text=f"📊 FPS: {metrics['fps']}", fg=fps_color)
                
                game_color = self.colors['warning'] if metrics['game'] != '-' else self.colors['muted']
                self.game_label.config(text=f"🎮 Gra: {metrics['game']}", fg=game_color)
                
                ping_text = f"📡 Ping: {metrics['ping']}ms" if metrics['ping'] > 0 else "📡 Ping: -"
                self.ping_label.config(text=ping_text)
                
                cpu_color = self.colors['danger'] if metrics['cpu'] >= 80 else self.colors['warning'] if metrics['cpu'] >= 60 else self.colors['text']
                self.cpu_label.config(text=f"🖥️ CPU: {int(metrics['cpu'])}%", fg=cpu_color)
                
                mem_color = self.colors['danger'] if metrics['memory'] >= 80 else self.colors['warning'] if metrics['memory'] >= 60 else self.colors['text']
                self.memory_label.config(text=f"💾 RAM: {int(metrics['memory'])}%", fg=mem_color)
                
                self.network_label.config(text=f"🌐 Network: {int(metrics['network'])}ms")
                
                time.sleep(2)

        thread = threading.Thread(target=update_loop, daemon=True)
        thread.start()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = LunaFPSApp()
    app.run()