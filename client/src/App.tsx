import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FacultyForm from "./pages/FacultyForm";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL ;

    const pingServer = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          console.log("✅ Backend server is awake and responding.");
          setIsServerReady(true);
        } else {
          console.warn("⚠️ Backend responded but not ready, retrying...");
          setTimeout(pingServer, 3000);
        }
      } catch (error) {
        console.warn("🕓 Waiting for backend to wake up...", error);
        setTimeout(pingServer, 3000);
      }
    };

    pingServer();
  }, []);

  if (!isServerReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-sm">
            Initializing server... Please wait a moment ⏳
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/faculty-form" element={<FacultyForm />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
