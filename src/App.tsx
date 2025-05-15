
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { StockProvider } from "./contexts/StockContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import Explore from "./pages/Explore";
import Wishlist from "./pages/Wishlist";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StockDetail from "./pages/StockDetail";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <StockProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<Layout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/stock/:symbol" element={<StockDetail />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StockProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
