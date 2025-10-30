import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import ModelInfo from "./pages/ModelInfo";
import API from "./pages/API";
import DownloadDataset from "./pages/DownloadDataset";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import CiteUs from "./pages/CiteUs";
import SubmitData from "./pages/SubmitData";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import License from "./pages/License";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/model-info" element={<ModelInfo />} />
        <Route path="/api" element={<API />} />
        <Route path="/download-dataset" element={<DownloadDataset />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cite-us" element={<CiteUs />} />
        <Route path="/submit-data" element={<SubmitData />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/license" element={<License />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
