import { useEffect, useMemo, useRef, useState } from "react";
import heroImage from "@/assets/hero-fps.jpg";
import advancedImage from "@/assets/advanced-mode.jpg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Cpu, Monitor, MemoryStick, Zap, Gamepad2, Gauge, Rocket, Sun, Moon, Crosshair, Sword, Car, Cuboid, Settings, Download, Activity, ChevronDown, ChevronRight } from "lucide-react";


type TaskKey = "cpu" | "gpu" | "ram" | "input" | "lowlatency" | "vsync" | "gamemode" | "cache";

type GameKey = "cs2" | "fortnite" | "gtav" | "roblox";

type TaskState = Record<TaskKey, number>;

type GameTaskState = Record<GameKey, number>;
type DevKey = "devCpu" | "devGpu" | "bios";
type DevTaskState = Record<DevKey, number>;

const Index = () => {
  const [autoBoost, setAutoBoost] = useState<boolean>(() => localStorage.getItem("autoBoost") === "1");
  const [tasks, setTasks] = useState<TaskState>({ cpu: 0, gpu: 0, ram: 0, input: 0, lowlatency: 0, vsync: 0, gamemode: 0, cache: 0 });
  const timers = useRef<Map<TaskKey, number>>(new Map());

  const [gameTasks, setGameTasks] = useState<GameTaskState>({ cs2: 0, fortnite: 0, gtav: 0, roblox: 0 });
  const gameTimers = useRef<Map<GameKey, number>>(new Map());

  const [devTasks, setDevTasks] = useState<DevTaskState>({ devCpu: 0, devGpu: 0, bios: 0 });
  const devTimers = useRef<Map<DevKey, number>>(new Map());
  const [adminAction, setAdminAction] = useState<number>(0);
  const adminTimer = useRef<number | null>(null);

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

  const [language, setLanguage] = useState<string>(() => localStorage.getItem("lang") || "pl");
  useEffect(() => { localStorage.setItem("lang", language); }, [language]);
  const langLabels: Record<string, string> = { pl: "Polski", en: "English", es: "Español", tr: "Türkçe", de: "Deutsch", fr: "Français" };
  const langFlags: Record<string, string> = { pl: "🇵🇱", en: "🇬🇧", es: "🇪🇸", tr: "🇹🇷", de: "🇩🇪", fr: "🇫🇷" };

  const [developerMode, setDeveloperMode] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [autoDestroy, setAutoDestroy] = useState<boolean>(() => localStorage.getItem("autoDestroy") === "1");
  useEffect(() => { localStorage.setItem("autoDestroy", autoDestroy ? "1" : "0"); }, [autoDestroy]);
  const [testMode200, setTestMode200] = useState(false);
  const [gamesExpanded, setGamesExpanded] = useState(false);
  const APP_VERSION = "v1.0.0";

  const [offAllSettings, setOffAllSettings] = useState(false);
  const offAll = (val: boolean) => {
    setOffAllSettings(val);
    if (val) {
      timers.current.forEach((id) => window.clearInterval(id));
      timers.current.clear();
      setTasks({ cpu: 0, gpu: 0, ram: 0, input: 0, lowlatency: 0, vsync: 0, gamemode: 0, cache: 0 });
      gameTimers.current.forEach((id) => window.clearInterval(id));
      gameTimers.current.clear();
      setGameTasks({ cs2: 0, fortnite: 0, gtav: 0, roblox: 0 });
      setTestMode200(false);
      updateAutoBoost(false);
      toast({ title: "Wyłączono ustawienia", description: "Wszystkie działania zatrzymane." });
    }
  };
  useEffect(() => {
    document.title = "Luna FPS — FPS Booster & 0 Delay Optimizer";
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

// Dev/Admin działania ładowania
const runDevTask = (key: DevKey, label: string, duration = 1500) => {
  if (devTimers.current.get(key)) return;
  setDevTasks((t) => ({ ...t, [key]: 0 }));
  const start = Date.now();
  const tick = () => {
    const p = Math.min(100, Math.round(((Date.now() - start) / duration) * 100));
    setDevTasks((t) => ({ ...t, [key]: p }));
    if (p >= 100) {
      const id = devTimers.current.get(key);
      if (id) window.clearInterval(id);
      devTimers.current.delete(key);
      toast({ title: label, description: "Zakończono pomyślnie" });
    }
  };
  const id = window.setInterval(tick, 60);
  devTimers.current.set(key, id);
};

const disableDevTask = (key: DevKey, label: string) => {
  const id = devTimers.current.get(key);
  if (id) { window.clearInterval(id); devTimers.current.delete(key); }
  setDevTasks((t) => ({ ...t, [key]: 0 }));
  toast({ title: label, description: "Wyłączono / przywrócono ustawienia." });
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

const devPretty = useMemo(() => ({
  devCpu: { icon: Cpu, title: "CPU 100%", desc: "Symulacja pełnego obciążenia CPU." },
  devGpu: { icon: Monitor, title: "GPU 100%", desc: "Symulacja pełnego obciążenia GPU." },
  bios: { icon: Settings, title: "Optymalizacja BIOS", desc: "Symulacja optymalizacji ustawień firmware." },
}), []);

  const ActionCard = ({ k }: { k: TaskKey }) => {
    const Icon = pretty[k].icon;
    const running = tasks[k] > 0 && tasks[k] < 100;
    const done = tasks[k] >= 100;
    return (
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="shrink-0" />
            <CardTitle>{pretty[k].title}</CardTitle>
          </div>
          <CardDescription>{pretty[k].desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={tasks[k]} variant={testMode200 ? "danger" : "default"} glow={testMode200} />
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {running ? "W trakcie…" : done ? (testMode200 ? "Zakończono — zastosowano 200%" : "Zakończono") : "Gotowe do startu"}
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

  const DevActionCard = ({ d }: { d: DevKey }) => {
    const Icon = devPretty[d].icon;
    const running = devTasks[d] > 0 && devTasks[d] < 100;
    const done = devTasks[d] >= 100;
    return (
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="shrink-0" />
            <CardTitle>{devPretty[d].title}</CardTitle>
          </div>
          <CardDescription>{devPretty[d].desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={devTasks[d]} variant={testMode200 ? "danger" : "default"} glow={testMode200} />
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {running ? "W trakcie…" : done ? (testMode200 ? "Zakończono — zastosowano 200%" : "Zakończono") : "Gotowe do startu"}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => disableDevTask(d, devPretty[d].title)}>Wyłącz</Button>
            <Button variant="hero" onClick={() => runDevTask(d, devPretty[d].title)} disabled={running}>{done ? "Uruchom ponownie" : running ? "Pracuję" : "Uruchom"}</Button>
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
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="shrink-0" />
            <CardTitle>{gamesPretty[g].title}</CardTitle>
          </div>
          <CardDescription>{gamesPretty[g].desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={gameTasks[g]} variant={testMode200 ? "danger" : "default"} glow={testMode200} />
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

  const AdvancedGameOptions = () => {
    return (
      <Card className="card-elevated glass animate-fade-in">
        <CardHeader>
          <CardTitle>Tryb zaawansowany</CardTitle>
          <CardDescription>Skalowanie, wygładzenie i pro‑funkcje</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={advancedImage} alt="Tryb zaawansowany — grafika Luna FPS" className="mb-4 w-full h-24 md:h-28 object-cover rounded-md shadow" loading="lazy" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <span>Turbo Boost 🏎🔥</span>
              <Switch aria-label="Turbo Boost" />
            </div>
            <div className="flex items-center justify-between">
              <span>Deep Clean 🧹</span>
              <Switch aria-label="Deep Clean" />
            </div>
            <div className="flex items-center justify-between">
              <span>Silent Mode 💤</span>
              <Switch aria-label="Silent Mode" />
            </div>
            <div className="flex items-center justify-between">
              <span>Skalowanie 🖼</span>
              <Switch aria-label="Skalowanie" />
            </div>
            <div className="flex items-center justify-between">
              <span>Wygładzenie 🔧</span>
              <Switch aria-label="Wygładzenie" />
            </div>
            <div className="flex items-center justify-between">
              <span>Ultra Reflex ⚡</span>
              <Switch aria-label="Ultra Reflex" />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto DLSS/FSR Switch 🖼</span>
              <Switch aria-label="Auto DLSS/FSR Switch" />
            </div>
            <div className="flex items-center justify-between">
              <span>FPS Stabilizer 🏎</span>
              <Switch aria-label="FPS Stabilizer" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AdminCatalogPanel = () => (
    <Card className="card-elevated glass neon-frame animate-fade-in">
      <CardHeader>
        <CardTitle>Katalog Admina — Optymalizacja</CardTitle>
        <CardDescription>Symulacja paska ładowania (grafika)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary/60">
          <div className="progress-neon-indicator progress-indeterminate absolute inset-0" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={"min-h-screen bg-background " + (testMode200 ? "f1-mode" : "")}>
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <div className={"text-lg font-semibold " + (testMode200 ? "text-glow" : "")}>
            Luna FPS
            {testMode200 && <span className="ml-2 text-sm text-red-400">⚡ 200%</span>}
          </div>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Ustawienia" title="Ustawienia">
                  <Settings />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tryb developera</span>
                    <Switch checked={developerMode} onCheckedChange={setDeveloperMode} aria-label="Tryb developera" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wersja aplikacji</span>
                    <span className="text-xs text-muted-foreground">{APP_VERSION}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tryb auto zniszczenia</span>
                    <Switch checked={autoDestroy} onCheckedChange={setAutoDestroy} aria-label="Tryb auto zniszczenia" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Off all settings</span>
                    <Switch checked={offAllSettings} onCheckedChange={offAll} aria-label="Off all settings" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tryb admina</span>
                    {adminUnlocked ? (
                      <Button variant="outline" size="sm" onClick={() => setAdminUnlocked(false)}>Zablokuj</Button>
                    ) : (
                      <Button variant="hero" size="sm" onClick={() => setPasswordOpen(true)}>Odblokuj</Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Język <span className="ml-1">{langFlags[language]}</span></span>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Wybierz język" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-sm text-muted-foreground">Auto Boost</span>
            <Switch checked={autoBoost} onCheckedChange={updateAutoBoost} aria-label="Auto Boost" />
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="hero-gradient animate-gradient-slow">
            <div className="container relative z-10 py-16 md:py-24">
              <h1 className={"text-4xl md:text-5xl font-bold tracking-tight mb-4 " + (testMode200 ? "text-glow animate-pulse" : "")}>
                Luna FPS Gaming Optimizer
                {testMode200 && <div className="text-lg text-red-400 mt-2">⚡ TRYB 200% AKTYWNY ⚡</div>}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Profesjonalna optymalizacja gier: zwiększ FPS, zredukuj opóźnienia, maksymalizuj wydajność.
              </p>
              <InstallPrompt />
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="hero" size="lg" onClick={runAll}>Uruchom pełną optymalizację</Button>
                <Button variant="outline" size="lg" onClick={() => toast({ title: "Tryb testowy", description: "Aplikacja web symuluje operacje systemowe." })}>Tryb testowy</Button>
              </div>
            </div>
            <img src={heroImage} alt="Futurystyczne tło gaming / optymalizacja wydajności" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="eager" />
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-semibold mb-6">FPS Booster</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <ActionCard k="cpu" />
                <ActionCard k="gpu" />
                <ActionCard k="ram" />
              </div>
            </div>
            
            <div className="space-y-6">
              <PerformanceMonitor />
              
              <Card className="card-elevated glass float">
                <CardHeader>
                  <CardTitle className="text-base">Szybkie akcje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="hero" 
                    size="sm" 
                    className="w-full"
                    onClick={runAll}
                    disabled={Object.values(tasks).some(v => v > 0 && v < 100)}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Boost All
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => offAll(!offAllSettings)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {offAllSettings ? "Włącz" : "Wyłącz"} wszystko
                  </Button>
                  
                  {testMode200 && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full pulse-glow"
                      onClick={() => setTestMode200(false)}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Wyłącz tryb 200%
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container pb-16">
          <Collapsible open={gamesExpanded} onOpenChange={setGamesExpanded}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Katalog optymalizacji gier</h2>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-2 hover:bg-accent/50 transition-all duration-200 relative z-20"
                >
                  {gamesExpanded ? (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Zwiń katalog
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      Rozwiń katalog gier
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg relative z-10">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Crosshair className="h-5 w-5" />
                      Strzelanki
                    </h3>
                    <GameCard g="cs2" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sword className="h-5 w-5" />
                      Battle Royale
                    </h3>
                    <GameCard g="fortnite" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Akcja / Świat otwarty
                    </h3>
                    <GameCard g="gtav" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Cuboid className="h-5 w-5" />
                      Sandbox / Kreatywne
                    </h3>
                    <GameCard g="roblox" />
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-border/30">
                  <h3 className="text-lg font-semibold mb-4">Tryb zaawansowany</h3>
                  <AdvancedGameOptions />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
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
            Strona jest w trybie bety i jest ciągle dopracowywana, więc błędy mogą być nieuniknione.
          </p>
        </section>

        <section className="container pb-16">
          <h2 className="text-2xl font-semibold mb-6">Ściąga Luna FPS</h2>
          <Card className="card-elevated animate-fade-in">
            <CardContent className="pt-6">
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Auto Boost — automatycznie uruchamia wszystkie optymalizacje.</li>
                <li>Off all settings — zatrzymuje i resetuje wszystkie działania.</li>
                <li>Tryb 200% — czerwone paski, maksymalne ustawienia testowe.</li>
                <li>Tryb zaawansowany — skalowanie i wygładzenie obrazu dla każdej gry.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {(developerMode || adminUnlocked) && (
          <section className="container pb-16">
            <h2 className="text-2xl font-semibold mb-6">Zaawansowane</h2>

            {developerMode && (
              <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
                <DevActionCard d="devCpu" />
                <DevActionCard d="devGpu" />
                <DevActionCard d="bios" />
              </div>
            )}

            {developerMode && (
              <div className="mt-10 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4">Katalog Admina</h3>
                <AdminCatalogPanel />
              </div>
            )}

            <div className="mt-10 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Admin</h3>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">Status: {testMode200 ? "Testowy 200% aktywny" : (adminUnlocked ? "Wyłączony" : "Zablokowany — odblokuj w Ustawieniach")}</p>
                {adminAction > 0 && adminAction < 100 && (
                  <Progress value={adminAction} variant={testMode200 ? "f1" : "neon"} glow={true} />
                )}
                <Button
                  variant="destructive"
                  disabled={!adminUnlocked}
                  onClick={() => {
                    if (adminTimer.current) { window.clearInterval(adminTimer.current); adminTimer.current = null; }
                    setAdminAction(0);
                    const start = Date.now();
                    const duration = 1000;
                    const tick = () => {
                      const p = Math.min(100, Math.round(((Date.now() - start) / duration) * 100));
                      setAdminAction(p);
                      if (p >= 100) {
                        if (adminTimer.current) window.clearInterval(adminTimer.current);
                        adminTimer.current = null;
                        setTestMode200((v) => !v);
                      }
                    };
                    const id = window.setInterval(tick, 60);
                    adminTimer.current = id;
                  }}
                  title={!adminUnlocked ? "Odblokuj tryb admina w Ustawieniach" : undefined}
                >
                  Optymalizacja 200%
                </Button>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="card-elevated glass neon-frame">
                    <CardHeader>
                      <CardTitle>Podgląd logów systemowych 📜</CardTitle>
                      <CardDescription>Podgląd logów w czasie rzeczywistym</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" disabled={!adminUnlocked}>Otwórz</Button>
                    </CardFooter>
                  </Card>

                  <Card className="card-elevated glass neon-frame">
                    <CardHeader>
                      <CardTitle>Test trybu awaryjnego 🛠</CardTitle>
                      <CardDescription>Symulacja bezpiecznych ustawień</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" disabled={!adminUnlocked}>Uruchom</Button>
                    </CardFooter>
                  </Card>

                  <Card className="card-elevated glass neon-frame">
                    <CardHeader>
                      <CardTitle>Panel debugowania gier 🎮🛡</CardTitle>
                      <CardDescription>Narzędzia do diagnostyki tytułów</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" disabled={!adminUnlocked}>Otwórz</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Włącz tryb admina</DialogTitle>
              <DialogDescription>Podaj hasło, aby odblokować tryb administratora.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input type="password" placeholder="Hasło" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (passwordInput === "3323") {
                    setAdminUnlocked(true);
                    setPasswordOpen(false);
                    setPasswordInput("");
                    toast({ title: "Tryb admina", description: "Odblokowano tryb administratora." });
                  } else {
                    toast({ title: "Błędne hasło", description: "Nieprawidłowe hasło.", variant: "destructive" });
                  }
                }}
              >
                Potwierdź
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <footer className="py-6 border-t">
          <div className="container text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Luna FPS Gaming Optimizer {APP_VERSION} - Strona w trybie beta
            </div>
            <div className="text-xs text-muted-foreground">
              Profesjonalne narzędzie do optymalizacji gier | Błędy mogą być nieuniknione
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Index;
