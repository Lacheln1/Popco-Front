import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import svgr from "vite-plugin-svgr";
const dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    global: "globalThis",
  },
  resolve: { alias: { "@": path.resolve(dirname, "./src") } },
  server: {
    proxy: {
      "/api/client": {
        target: "http://popco.site",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
