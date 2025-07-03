import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/stats': {
        target: 'https://marketplace.visualstudio.com/_apis/gallery/publishers/eliostruyf/extensions/vscode-demo-time/stats',
        changeOrigin: true,
        rewrite: () => '',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', function(proxyReq) {
            // We need to set the accept header for the VS Code Marketplace API
            proxyReq.setHeader('accept', 'application/json;api-version=7.2-preview.1;excludeUrls=true');
            
            // For authentication, we'd typically set this here, but in this implementation
            // we'll handle auth as a query parameter that gets forwarded
          });
        },
      }
    }
  }
})