import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/activeTable.ts',
      formats: ['es'],
      fileName: 'activeTable',
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
