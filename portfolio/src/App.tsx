import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import CV from "./pages/CV";
import { PortfolioProvider, usePortfolio } from "@/context/PortfolioContext";
import { notifyAdminExitLogout } from "@/lib/portfolio-api";

const queryClient = new QueryClient();

const isAdminPath = (pathname: string) => pathname.startsWith("/admin");

const AdminSessionWatcher = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = usePortfolio();
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const wasOnAdminPage = isAdminPath(previousPath);
    const isOnAdminPage = isAdminPath(location.pathname);

    if (isAuthenticated && wasOnAdminPage && !isOnAdminPage) {
      void logout();
    }

    previousPathRef.current = location.pathname;
  }, [isAuthenticated, location.pathname, logout]);

  useEffect(() => {
    if (!isAuthenticated || !isAdminPath(location.pathname)) {
      return;
    }

    const handleAdminPageExit = () => {
      void notifyAdminExitLogout();
    };

    window.addEventListener("pagehide", handleAdminPageExit);
    window.addEventListener("beforeunload", handleAdminPageExit);

    return () => {
      window.removeEventListener("pagehide", handleAdminPageExit);
      window.removeEventListener("beforeunload", handleAdminPageExit);
    };
  }, [isAuthenticated, location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PortfolioProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminSessionWatcher />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cv" element={<CV />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PortfolioProvider>
  </QueryClientProvider>
);

export default App;
