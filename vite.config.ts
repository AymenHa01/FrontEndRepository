import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [ getAngularVitePlugin() ],
  define: {
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      'sockjs-client': 'sockjs-client/dist/sockjs.min.js',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});

function getAngularVitePlugin(): import("vite").PluginOption {
  throw new Error('Function not implemented.');
}
