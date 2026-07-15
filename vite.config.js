import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/" — the app is hosted at the root of {subdomain}.praxsuite.app
export default defineConfig({
  plugins: [react()],
  base: "/",
});
