import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ChatbotWidget from "@/components/ChatbotWidget";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import { globalSettingsService } from "@/lib/globalSettings";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Inventory from "./pages/Inventory";
import Contact from "./pages/Contact";
import VehicleDetail from "./pages/VehicleDetail";
import FAQ from "./pages/FAQ";
import Admin from "./pages/Admin";
import SignIn from "./pages/SignIn";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [widgetType, setWidgetType] = useState<'chatbot' | 'whatsapp'>('chatbot');
  const [loading, setLoading] = useState(true);

  // Load settings from Supabase on mount
  useEffect(() => {
    loadSettings();
    
    // Poll for settings changes every 5 seconds
    const interval = setInterval(loadSettings, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadSettings = async () => {
    const settings = await globalSettingsService.getSettings();
    if (settings) {
      setWidgetType(settings.widget_type);
    }
    setLoading(false);
  };

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<VehicleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!loading && (widgetType === 'chatbot' ? <ChatbotWidget /> : <WhatsAppWidget />)}
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
