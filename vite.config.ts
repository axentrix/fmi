import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // here is the import
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/fmi/' : '/',
  plugins: [
    react(), 
    tailwindcss()], // add that here and don't forget the import!
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
