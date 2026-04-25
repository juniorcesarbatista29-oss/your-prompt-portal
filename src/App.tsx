import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import { OfferPopup } from "./components/OfferPopup.tsx";
import { prefetchInitialData } from "@/lib/queries";

// Lazy-loaded routes (code-split)
const Sobre = lazy(() => import("./pages/Sobre.tsx"));
const Catalogo = lazy(() => import("./pages/Catalogo.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminSignup = lazy(() => import("./pages/admin/AdminSignup.tsx"));
const AdminBikes = lazy(() => import("./pages/admin/AdminBikes.tsx"));
const AdminBikeForm = lazy(() => import("./pages/admin/AdminBikeForm.tsx"));
const AdminOffers = lazy(() => import("./pages/admin/AdminOffers.tsx"));
const AdminAccount = lazy(() => import("./pages/admin/AdminAccount.tsx"));
const AdminSite = lazy(() => import("./pages/admin/AdminSite.tsx"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent.tsx"));
const AdminLinks = lazy(() => import("./pages/admin/AdminLinks.tsx"));
const AdminGuard = lazy(() =>
  import("./components/admin/AdminGuard.tsx").then((m) => ({ default: m.AdminGuard }))
);
const AdminLayout = lazy(() =>
  import("./components/admin/AdminLayout.tsx").then((m) => ({ default: m.AdminLayout }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 min — no refetch on remounts/route changes
      staleTime: 5 * 60 * 1000,
      // Keep in cache for 30 min after last use
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

// Warm cache for shared data (bikes + active offer) immediately on app load
prefetchInitialData(queryClient);

// Prefetch lazy route chunks during browser idle time so the first
// inter-page navigation feels instant (no chunk download wait).
const prefetchRouteChunks = () => {
  import("./pages/Sobre.tsx");
  import("./pages/Catalogo.tsx");
};
if (typeof window !== "undefined") {
  type IdleWindow = Window & {
    requestIdleCallback?: (cb: () => void) => number;
  };
  const w = window as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(prefetchRouteChunks);
  } else {
    setTimeout(prefetchRouteChunks, 1500);
  }
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
    {!isAdmin && <OfferPopup />}
    <Suspense fallback={null}>
      <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminBikes />} />
            <Route path="bikes" element={<AdminBikes />} />
            <Route path="bikes/:id" element={<AdminBikeForm />} />
            <Route path="ofertas" element={<AdminOffers />} />
            <Route path="site" element={<AdminSite />} />
            <Route path="conteudo" element={<AdminContent />} />
            <Route path="links" element={<AdminLinks />} />
            <Route path="conta" element={<AdminAccount />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
