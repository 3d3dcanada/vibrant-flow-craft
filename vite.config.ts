import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Fallback env vars in case .env is not loaded
    ...(process.env.VITE_SUPABASE_URL ? {} : {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://zcmqrecmnhjvhtmezqsn.supabase.co"),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbXFyZWNtbmhqdmh0bWV6cXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MzgzMjMsImV4cCI6MjA4MjIxNDMyM30.HAz_vPa59ezcbbGnai-rBMEwwAgAYTmN5M195RRr0Yk"),
      'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify("zcmqrecmnhjvhtmezqsn"),
    }),
  },
}));
