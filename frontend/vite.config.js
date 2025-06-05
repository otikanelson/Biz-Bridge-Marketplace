import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  root: './',  // Ensure this is correct
  outDir: "../dist",
  server: {
    port: 5173,
    open: true,
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/, // Match both .js and .jsx files
  },
  build: {
    outDir: "dist",
  },
  // Ensure deep links (like /dashboard) are handled properly
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
 // This tells Vite where to find index.html
