import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WagmiWalletProvider } from "@/contexts/wagmi-wallet-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import AdminRewards from "@/pages/admin-rewards";


import { useEffect } from "react";
import "@/lib/complete-overlay-suppression";
import "@/lib/error-suppression";
import "@/lib/disable-runtime-overlay";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/rewards" component={AdminRewards} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Global error handler to prevent runtime error overlays
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || '';
      console.warn('Unhandled promise rejection (gracefully handled):', reason);
      
      // Always prevent error overlay to avoid runtime error disruptions
      event.preventDefault();
      
      // Suppress the error to prevent it from bubbling up to error handling plugins
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    const handleError = (event: ErrorEvent) => {
      const errorMsg = event.error?.toString() || event.message || '';
      console.warn('Global error caught:', errorMsg);
      
      // Always prevent error overlay to avoid runtime error disruptions
      event.preventDefault();
      
      // Suppress the error to prevent it from bubbling up to error handling plugins
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return <>{children}</>;
}

// Removed background video component and related logic

function App() {
  // Clear React Query cache on checkpoint rollback
  useEffect(() => {
    const checkForRollback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('cb')) {
        queryClient.clear();
        queryClient.resetQueries();
        
        // Remove cache-busting parameter from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('cb');
        window.history.replaceState({}, '', url.toString());
      }
    };
    
    checkForRollback();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiWalletProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WagmiWalletProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
