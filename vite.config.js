import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import tailwindcss from '@tailwindcss/vite'
import postcssNesting from 'postcss-nesting';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    map: false,
    plugins: [
        react(),
        //tailwindcss(),
        postcssNesting(),
    ],
    build: {
        // Режим библиотеки
        lib: {
            // Точка входа: основной файл, который экспортирует всё публичное API
            entry: path.resolve(__dirname, 'index.js'), // или index.ts
            // Название библиотеки (для глобальной переменной, если нужно)
            name: 'react-graph-grid',
            // Форматы сборки: cjs (CommonJS) и es (ES Module)
            formats: ['cjs', 'es'],
            // Функция для генерации имён файлов
            fileName: (format) => {
                if (format === 'es') {
                    return 'index.esm.js';   // для import
                }
                return 'index.js';          // для require
            },
        },
        // Очищать папку dist перед каждой сборкой
        emptyOutDir: true,
        // Не минифицировать код (обычно для библиотек это плюс, но можно включить)
        minify: false,
        // объединяет весь CSS в один файл
        cssCodeSplit: false,
        // Продвинутые настройки Rollup
        rollupOptions: {
            // Внешние зависимости, которые не нужно бандлить
            external: ['react', 'react-dom'],
            output: {
                // Сохраняем структуру экспортов для правильной tree-shaking
                preserveModules: true, // важно для ESM
                // Для CommonJS указываем тип экспорта
                exports: 'named',
                // имя выходного CSS-файла
                assetFileNames: 'default.css',
                // Для ESM: сохраняем структуру экспортов, не создаём глобальных переменных
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
})
