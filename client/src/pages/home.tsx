import { useState, useEffect } from "react";
import { RPAForm } from "@/components/rpa-form";
import { Button } from "@/components/ui/button";
import { FileText, Moon, Sun, Shield, Heart } from "lucide-react";
import { hasStoredData } from "@/lib/storage";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="text-primary-foreground w-5 h-5" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold text-foreground"
                  data-testid="text-app-title"
                >
                  Gerador de RPA
                </h1>
                <p className="text-xs text-muted-foreground">
                  Recibo de Pagamento Autônomo
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                title={darkMode ? "Modo claro" : "Modo escuro"}
                data-testid="button-toggle-theme"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RPAForm />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <Shield className="w-3 h-3 mr-1 inline" />
              Todos os dados são armazenados localmente no seu navegador.
              Nenhuma informação é enviada para servidores externos.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 Gerador de RPA - Desenvolvido com{" "}
              <Heart className="w-3 h-3 text-destructive inline mx-1" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
