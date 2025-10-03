export const environment = {
  production: false,
  // IMPORTANT: Backend base URL. Use relative '/api' by default so dev proxy or ingress can route.
  // For deployment, set MAPPING_BACKEND_URL at build-time and replace this value accordingly via environment.prod.ts or runtime config.
  apiBaseUrl: '/api',
  theme: {
    name: 'Ocean Professional',
    colors: {
      primary: '#2563EB',
      secondary: '#F59E0B',
      success: '#10B981',
      error: '#EF4444',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827'
    }
  }
};
