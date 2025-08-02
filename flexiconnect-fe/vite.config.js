import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Components
      '@components': path.resolve(__dirname, 'src/components'),
      '@applicationForms': path.resolve(__dirname, 'src/components/application-forms'),
      '@forms': path.resolve(__dirname, 'src/components/forms'),

      // Configs & Contexts
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),

      // Layouts
      '@layouts': path.resolve(__dirname, 'src/layouts'),

      // Pages
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@admin': path.resolve(__dirname, 'src/pages/admin'),
      '@auth': path.resolve(__dirname, 'src/pages/auth'),
      '@candidate': path.resolve(__dirname, 'src/pages/candidate'),
      '@candidateProfile': path.resolve(__dirname, 'src/pages/candidate/candidate-profile'),
      '@employer': path.resolve(__dirname, 'src/pages/employer'),
      '@employerProfile': path.resolve(__dirname, 'src/pages/employer/employer-profile'),
      '@jobPosts': path.resolve(__dirname, 'src/pages/employer/job-posts'),
      '@public': path.resolve(__dirname, 'src/pages/public'),
    },
  },
  server: {
    port: 3000,
  },
});
