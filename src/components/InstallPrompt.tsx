import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePWA } from "@/hooks/usePWA";
import { Download, X, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const InstallPrompt = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "Aplikacja zainstalowana!",
        description: "Luna FPS jest teraz dostępna na Twoim urządzeniu."
      });
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    toast({
      title: "Instalacja odłożona",
      description: "Możesz zainstalować aplikację później z ustawień."
    });
  };

  return (
    <Card className="card-elevated glass neon-frame animate-fade-in mb-6">
      <CardHeader className="flex flex-row items-start space-y-0">
        <div className="flex items-center gap-3 flex-1">
          <Smartphone className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-lg">Zainstaluj Luna FPS</CardTitle>
            <CardDescription>
              Szybszy dostęp bez przeglądarki
            </CardDescription>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleDismiss}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleInstall}
            className="flex-1"
            variant="hero"
          >
            <Download className="h-4 w-4 mr-2" />
            Zainstaluj aplikację
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="sm:w-auto"
          >
            Może później
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};