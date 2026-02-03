import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Settings from "./pages/Settings";
import ESGAnalytics from "./pages/ESGAnalytics";
import GreenTaxonomy from "./pages/GreenTaxonomy";
import CarbonNetZero from "./pages/CarbonNetZero";
import Reports from "./pages/Reports";
import PortfolioDrilldown from "./pages/PortfolioDrilldown";
import PFISubmissions from "./pages/PFISubmissions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/insights" element={<ESGAnalytics />} />
            <Route path="/goals-indicator" element={<Goals />} />
            <Route path="/programme" element={<Projects />} />
            <Route path="/programme/new-programme" element={<NewProject />} />
            <Route path="/green-taxonomy" element={<GreenTaxonomy />} />
            <Route path="/carbon-netzero" element={<CarbonNetZero />} />
            <Route path="/projects-drilldown" element={<PortfolioDrilldown />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/form" element={<PFISubmissions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
