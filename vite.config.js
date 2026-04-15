import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 使用 esbuild 内置压缩
    minify: 'esbuild',
    // rollup 分包
    rollupOptions: {
      external: ['fsevents'],
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 静态资源内联阈值
    assetsInlineLimit: 4096,
    // 清理旧构建产物
    cleanOutDir: true,
    // 报告大小
    reportCompressedSize: true
  }
})
