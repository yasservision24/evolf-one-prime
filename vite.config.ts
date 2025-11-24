import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // listen on all interfaces (keeps your "::" behavior)
    host: "::",
    port: 8000,

    // Allow these hosts to access the dev server (required for requests from your domain)
    // Include your production domain and local hosts used for testing.
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "evolf.ahujalab.iiitd.edu.in",
    ],
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
