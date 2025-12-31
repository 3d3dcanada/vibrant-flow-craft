import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Subscription from "./pages/Subscription";
import Achievements from "./pages/Achievements";
import ProfileSettings from "./pages/ProfileSettings";
import RewardsCenter from "./pages/RewardsCenter";
import CreditsStore from "./pages/CreditsStore";
import CommunityModels from "./pages/CommunityModels";
import Recycling from "./pages/Recycling";
import GiftCards from "./pages/GiftCards";
import CommunityCleanup from "./pages/CommunityCleanup";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ETransferCheckout from "./pages/ETransferCheckout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/subscription" element={<Subscription />} />
            <Route path="/dashboard/achievements" element={<Achievements />} />
            <Route path="/dashboard/settings" element={<ProfileSettings />} />
            <Route path="/dashboard/rewards" element={<RewardsCenter />} />
            <Route path="/dashboard/credits" element={<CreditsStore />} />
            <Route path="/dashboard/credits/checkout" element={<ETransferCheckout />} />
            <Route path="/dashboard/community" element={<CommunityModels />} />
            <Route path="/dashboard/community-cleanup" element={<CommunityCleanup />} />
            <Route path="/dashboard/recycling" element={<Recycling />} />
            <Route path="/dashboard/gift-cards" element={<GiftCards />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
