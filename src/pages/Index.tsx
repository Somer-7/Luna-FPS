import { useEffect, useMemo, useRef, useState } from "react";
import heroImage from "@/assets/hero-fps.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Cpu, Monitor, MemoryStick, Zap, Gamepad2, Gauge, Rocket, Sun, Moon, Crosshair, Sword, Car, Cuboid } from "lucide-react";


type TaskKey = "cpu" | "gpu" | "ram" | "input" | "lowlatency" | "vsync" | "gamemode" | "cache";

type GameKey = "cs2" | "fortnite" | "gtav" | "roblox";

type TaskState = Record<TaskKey, number>;

type GameTaskState = Record<GameKey, number>;

const Index = () => {
  const [autoBoost, setAutoBoost] = useState<boolean>(() => localStorage.getItem("autoBoost") === "1");
  const [tasks, setTasks] = useState<TaskState>({ cpu: 0, gpu: 0, ram: 0, input: 0, lowlatency: 0, vsync: 0, gamemode: 0, cache: 0 });
  const timers = useRef<Map<TaskKey, number>>(new Map());

  const [gameTasks, setGameTasks] = useState<GameTaskState>({ cs2: 0, fortnite: 0, gtav: 0, roblox: 0 });
  const gameTimers = useRef<Map<GameKey, number>>(new Map());

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.title = "FPS Booster & 0 Delay Optimizer | Gaming Performance";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Zwiększ FPS i zredukuj opóźnienia: CPU/GPU/RAM optymalizacja, Auto Boost, 0 Delay (Low Latency, brak V‑Sync, czyszczenie cache).");
  }, []);

  useEffect(() => {
    if (autoBoost) {
      toast({ title: "Auto Boost", description: "Automatyczna optymalizacja uruchomiona." });
      runAll();
    }
  }, []);

  const updateAutoBoost = (val: boolean) => {
    setAutoBoost(val);
    localStorage.setItem("autoBoost", val ? "1" : "0");
    toast({ title: val ? "Auto Boost aktywny" : "Auto Boost wyłączony" });
    if (val) runAll();
  };

  const runTask = (key: TaskKey, label: string, duration = 2200) => {
    if (timers.current.get(key)) return; // already running
    setTasks((t) => ({ ...t, [key]: 0 }));
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setTasks((t) => ({ ...t, [key]: p }));
      if (p >= 100) {
        const id = timers.current.get(key);
        if (id) window.clearInterval(id);
        timers.current.delete(key);
        toast({ title: label, description: "Zakończono pomyślnie" });
      }
    };
    const id = window.setInterval(tick, 60);
    timers.current.set(key, id);
  };

const runAll = () => {
  runTask("cpu", "Optymalizacja procesora");
  runTask("gpu", "Optymalizacja karty graficznej");
  runTask("ram", "Czyszczenie pamięci RAM", 1800);
  runTask("input", "Redukcja input lag", 1200);
  runTask("lowlatency", "GPU Low Latency", 1400);
  runTask("vsync", "Wyłączenie V-Sync", 1000);
  runTask("gamemode", "Włączenie Game Mode", 1000);
  runTask("cache", "Czyszczenie cache DirectX/Shaders", 1600);
};

const disableTask = (key: TaskKey, label?: string) => {
  const id = timers.current.get(key);
  if (id) { window.clearInterval(id); timers.current.delete(key); }
  setTasks((t) => ({ ...t, [key]: 0 }));
  toast({ title: label ?? pretty[key].title, description: "Wyłączono / przywrócono ustawienia." });
};

const runGameProfile = (key: GameKey, label: string, duration = 2200) => {
  if (gameTimers.current.get(key)) return;
  setGameTasks((g) => ({ ...g, [key]: 0 }));
  const start = Date.now();
  const tick = () => {
    const p = Math.min(100, Math.round(((Date.now() - start) / duration) * 100));
    setGameTasks((g) => ({ ...g, [key]: p }));
    if (p >= 100) {
      const id = gameTimers.current.get(key);
      if (id) window.clearInterval(id);
      gameTimers.current.delete(key);
      toast({ title: label, description: "Profil zastosowany" });
    }
  };
  const id = window.setInterval(tick, 60);
  gameTimers.current.set(key, id);
};

const disableGameProfile = (key: GameKey, label: string) => {
  const id = gameTimers.current.get(key);
  if (id) { window.clearInterval(id); gameTimers.current.delete(key); }
  setGameTasks((g) => ({ ...g, [key]: 0 }));
  toast({ title: label, description: "Profil wyłączony" });
};

const pretty = useMemo(() => ({
  cpu: { icon: Cpu, title: "Optymalizacja procesora", desc: "Wyłącz zbędne procesy i podnieś priorytet gier." },
  gpu: { icon: Monitor, title: "Optymalizacja GPU", desc: "Reset/ustawienia sterowników, odśmiecenie VRAM." },
  ram: { icon: MemoryStick, title: "Czyszczenie RAM", desc: "Zwolnij pamięć dla gier." },
  input: { icon: Zap, title: "Input Lag", desc: "Wyłącz buforowanie wejścia." },
  lowlatency: { icon: Gauge, title: "GPU Low Latency", desc: "Tryb niskich opóźnień." },
  vsync: { icon: Gamepad2, title: "V-Sync", desc: "Wyłącz synchronizację pionową." },
  gamemode: { icon: Rocket, title: "Game Mode", desc: "Automatyczne ustawienia Windows." },
  cache: { icon: Zap, title: "Cache DX/Shaders", desc: "Szybkie czyszczenie cache." },
}), []);

const gamesPretty = useMemo(() => ({
  cs2: { icon: Crosshair, title: "Counter‑Strike 2", desc: "Profil FPS: niskie opóźnienia, stabilne frametime." },
  fortnite: { icon: Sword, title: "Fortnite", desc: "Profil FPS: szybkie budowanie, responsywność wejścia." },
  gtav: { icon: Car, title: "GTA V", desc: "Profil FPS: płynność w otwartym świecie, streaming zasobów." },
  roblox: { icon: Cuboid, title: "Roblox", desc: "Profil FPS: lekkość klienta, mniejsze opóźnienia." },
}), []);

  const ActionCard = ({ k }: { k: TaskKey }) => {
    const Icon = pretty[k].icon;
    const running = tasks[k] > 0 && tasks[k] < 100;
    const done = tasks[k] >= 100;
    return (
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="shrink-0" />
            <CardTitle>{pretty[k].title}</CardTitle>
          </div>
          <CardDescription>{pretty[k].desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={tasks[k]} />
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {running ? "W trakcie…" : done ? "Zakończono" : "Gotowe do startu"}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => disableTask(k, pretty[k].title)}>
              Wyłącz
            </Button>
            <Button variant="hero" onClick={() => runTask(k, pretty[k].title)} disabled={running}>
              {done ? "Uruchom ponownie" : running ? "Pracuję" : "Uruchom"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const GameCard = ({ g }: { g: GameKey }) => {
    const Icon = gamesPretty[g].icon;
    const running = gameTasks[g] > 0 && gameTasks[g] < 100;
    const done = gameTasks[g] >= 100;
    return (
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="shrink-0" />
            <CardTitle>{gamesPretty[g].title}</CardTitle>
          </div>
          <CardDescription>{gamesPretty[g].desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={gameTasks[g]} />
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {running ? "W trakcie…" : done ? "Zastosowano" : "Gotowe do startu"}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => disableGameProfile(g, gamesPretty[g].title)}>Wyłącz</Button>
            <Button variant="hero" onClick={() => runGameProfile(g, gamesPretty[g].title)} disabled={running}>{done ? "Zastosuj ponownie" : running ? "Pracuję" : "Zastosuj profil"}</Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <div className="text-lg font-semibold">FPS Booster</div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Przełącz tryb kolorów"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Tryb jasny" : "Tryb ciemny"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            <span className="text-sm text-muted-foreground">Auto Boost</span>
            <Switch checked={autoBoost} onCheckedChange={updateAutoBoost} aria-label="Auto Boost" />
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="hero-gradient animate-gradient-slow">
            <div className="container relative z-10 py-16 md:py-24">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                FPS Booster & 0 Delay Optimizer
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Zwiększ FPS i obniż opóźnienia jednym kliknięciem. Inteligentne
                profile optymalizacji CPU/GPU/RAM oraz tryby 0 Delay.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="hero" size="lg" onClick={runAll}>Uruchom pełną optymalizację</Button>
                <Button variant="outline" size="lg" onClick={() => toast({ title: "Tryb testowy", description: "Aplikacja web symuluje operacje systemowe." })}>Tryb testowy</Button>
              </div>
            </div>
            <img src={heroImage} alt="Futurystyczne tło gaming / optymalizacja wydajności" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="eager" />
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <h2 className="text-2xl font-semibold mb-6">FPS Booster</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <ActionCard k="cpu" />
            <ActionCard k="gpu" />
            <ActionCard k="ram" />
          </div>
        </section>

        <section className="container pb-16">
          <h2 className="text-2xl font-semibold mb-6">Optymalizacje gier</h2>
          <Tabs defaultValue="cs2" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="cs2">CS2</TabsTrigger>
              <TabsTrigger value="fortnite">Fortnite</TabsTrigger>
              <TabsTrigger value="gtav">GTA V</TabsTrigger>
              <TabsTrigger value="roblox">Roblox</TabsTrigger>
            </TabsList>
            <TabsContent value="cs2">
              <GameCard g="cs2" />
            </TabsContent>
            <TabsContent value="fortnite">
              <GameCard g="fortnite" />
            </TabsContent>
            <TabsContent value="gtav">
              <GameCard g="gtav" />
            </TabsContent>
            <TabsContent value="roblox">
              <GameCard g="roblox" />
            </TabsContent>
          </Tabs>
        </section>

        <section className="container pb-16">
          <h2 className="text-2xl font-semibold mb-6">0 Delay</h2>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            <ActionCard k="input" />
            <ActionCard k="lowlatency" />
            <ActionCard k="vsync" />
            <ActionCard k="gamemode" />
            <ActionCard k="cache" />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Uwaga: to aplikacja webowa – przedstawione działania są symulowane (bez modyfikacji systemu/sterowników).
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;
