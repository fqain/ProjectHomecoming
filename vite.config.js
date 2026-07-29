import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "./" makes the build work when hosted at https://username.github.io/repo-name/
export default defineConfig({
  plugins: [react()],
  base: "./",
});
