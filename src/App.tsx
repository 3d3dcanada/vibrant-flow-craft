import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
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
import PromoProducts from "./pages/PromoProducts";
import BusinessSubscription from "./pages/BusinessSubscription";
import NotFound from "./pages/NotFound";

// New pages
import Mission from "./pages/Mission";
import About from "./pages/About";
import RecycleBuyback from "./pages/RecycleBuyback";
import AdminBuybackRequests from "./pages/admin/AdminBuybackRequests";
import Refunds from "./pages/Refunds";
import CommunityPolicy from "./pages/CommunityPolicy";
import Schedule from "./pages/Schedule";
import CustomerDashboard from "./pages/CustomerDashboard";
import QuoteConfigurator from "./pages/QuoteConfigurator";
import BrandGames from "./pages/BrandGames";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrintResponsibility from "./pages/PrintResponsibility";

// Maker Dashboard pages
import MakerOverview from "./pages/maker/MakerOverview";
import MakerRequests from "./pages/maker/MakerRequests";
import MakerJobs from "./pages/maker/MakerJobs";
import MakerPrinters from "./pages/maker/MakerPrinters";
import MakerFilament from "./pages/maker/MakerFilament";
import MakerEarnings from "./pages/maker/MakerEarnings";
import MakerProfile from "./pages/maker/MakerProfile";

// Admin Dashboard pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminContentPromos from "./pages/admin/AdminContentPromos";
import AdminStoreManager from "./pages/admin/AdminStoreManager";
import AdminCreditPackages from "./pages/admin/AdminCreditPackages";
import AdminMakerManager from "./pages/admin/AdminMakerManager";
import AdminOperations from "./pages/admin/AdminOperations";

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
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/promo-products" element={<PromoProducts />} />
            <Route path="/business-subscription" element={<BusinessSubscription />} />

            {/* New public pages */}
            <Route path="/mission" element={<Mission />} />
            <Route path="/about" element={<About />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/community-policy" element={<CommunityPolicy />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/quote" element={<QuoteConfigurator />} />
            <Route path="/recycle-buyback" element={<RecycleBuyback />} />
            <Route path="/brand-games" element={<BrandGames />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/print-responsibility" element={<PrintResponsibility />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/customer" element={<CustomerDashboard />} />
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

            {/* Maker Dashboard routes */}
            <Route path="/dashboard/maker" element={<MakerOverview />} />
            <Route path="/dashboard/maker/requests" element={<MakerRequests />} />
            <Route path="/dashboard/maker/jobs" element={<MakerJobs />} />
            <Route path="/dashboard/maker/printers" element={<MakerPrinters />} />
            <Route path="/dashboard/maker/filament" element={<MakerFilament />} />
            <Route path="/dashboard/maker/earnings" element={<MakerEarnings />} />
            <Route path="/dashboard/maker/profile" element={<MakerProfile />} />

            {/* Admin Dashboard routes */}
            <Route path="/dashboard/admin" element={<AdminOverview />} />
            <Route path="/dashboard/admin/content" element={<AdminContentPromos />} />
            <Route path="/dashboard/admin/store" element={<AdminStoreManager />} />
            <Route path="/dashboard/admin/packages" element={<AdminCreditPackages />} />
            <Route path="/dashboard/admin/makers" element={<AdminMakerManager />} />
            <Route path="/dashboard/admin/ops" element={<AdminOperations />} />
            <Route path="/dashboard/admin/buyback" element={<AdminBuybackRequests />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
