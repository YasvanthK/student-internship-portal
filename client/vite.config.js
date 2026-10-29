
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["04ff72ac7a0b-0af42d38-5173.ws6.app"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true
      }
    }
  }
});
