import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./context/AuthContext";
import { RegistryProvider } from "./context/RegistryContext";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import MyChildrenPage from "./pages/dashboard/MyChildrenPage";
import ChildDashboardPage from "./pages/dashboard/ChildDashboardPage";
import PublicRegistryPage from "./pages/PublicRegistryPage";
import AddGiftPage from "./pages/dashboard/AddGiftPage";
import EditChildPage from "./pages/dashboard/EditChildPage";
import EditGiftPage from "./pages/dashboard/EditGiftPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import HowItWorks from "./pages/HowItWorks";
import ThankYouManagerPage from "./pages/dashboard/ThankYouManagerPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <RegistryProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* Public Registry Route */}
              <Route path="/registry/:childId" element={<PublicRegistryPage />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<MyChildrenPage />} />
                <Route path="my-children" element={<MyChildrenPage />} />
                <Route path="child/:childId" element={<ChildDashboardPage />} />
                <Route path="child/:childId/edit" element={<EditChildPage />} />
                <Route path="child/:childId/add-gift" element={<AddGiftPage />} />
                <Route path="child/:childId/thank-you" element={<ThankYouManagerPage />} />
                <Route path="gift/:giftId/edit" element={<EditGiftPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </RegistryProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;