/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        soft: 'var(--color-soft)',
        'soft-2': 'var(--color-soft-2)',
        'app-text': 'var(--color-text)',
        'app-muted': 'var(--color-muted)',
        'app-border': 'var(--color-border)',
        success: 'var(--color-success)',
        'success-bg': 'var(--color-success-bg)',
        warning: 'var(--color-warning)',
        'warning-bg': 'var(--color-warning-bg)',
        danger: 'var(--color-danger)',
        'danger-bg': 'var(--color-danger-bg)',
      },
      borderRadius: {
        xl2: 'var(--radius-lg)',
        lg: 'var(--radius-md)',
        md: 'var(--radius-sm)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        premium: '0 10px 32px rgba(10,102,194,0.13)',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
      },
      transitionTimingFunction: {
        ease: 'ease',
      },
    },
  },
  plugins: [],
};
