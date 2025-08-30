#!/usr/bin/env python3
"""
FPS Booster Pro Launcher
Uruchamia główną aplikację boostującą FPS
"""

import sys
import os
import subprocess

def check_dependencies():
    """Sprawdź czy wymagane biblioteki są zainstalowane"""
    try:
        import tkinter
        import psutil
        return True
    except ImportError as e:
        print(f"Brak wymaganej biblioteki: {e}")
        print("Instalacja wymaganych pakietów...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "psutil"])
        return True

def main():
    print("=== FPS BOOSTER PRO ===")
    print("Uruchamianie aplikacji...")
    
    if not check_dependencies():
        print("Błąd: Nie można zainstalować wymaganych pakietów")
        return
    
    # Uruchom główną aplikację
    try:
        from main import FPSBoosterApp
        app = FPSBoosterApp()
        app.run()
    except Exception as e:
        print(f"Błąd uruchamiania: {e}")
        input("Naciśnij Enter aby zamknąć...")

if __name__ == "__main__":
    main()