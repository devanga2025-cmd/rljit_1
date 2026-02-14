import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";
import Index from "./pages/Index";
import MotherRegister from "./pages/MotherRegister";
import FatherRegister from "./pages/FatherRegister";
import WorkerRegister from "./pages/WorkerRegister";
import MotherDashboard from "./pages/MotherDashboard";
import FatherDashboard from "./pages/FatherDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mother/register" element={<MotherRegister />} />
              <Route path="/father/register" element={<FatherRegister />} />
              <Route path="/worker/register" element={<WorkerRegister />} />
              <Route path="/mother" element={<MotherDashboard />} />
              <Route path="/father" element={<FatherDashboard />} />
              <Route path="/worker" element={<WorkerDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
