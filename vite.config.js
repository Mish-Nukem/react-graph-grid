import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import tailwindcss from '@tailwindcss/vite'
import postcssNesting from 'postcss-nesting';

// https://vite.dev/config/
export default defineConfig({
    map: false,
    plugins: [
        react(),
        //tailwindcss(),
        postcssNesting(),
    ],
})
