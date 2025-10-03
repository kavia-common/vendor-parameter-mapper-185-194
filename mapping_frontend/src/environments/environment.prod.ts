export const environment = {
  production: true,
  // Use relative path by default; configure reverse proxy or deploy with same-origin backend.
  // If deploying with a different origin, adjust this value during build-time.
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
