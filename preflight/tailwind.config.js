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
        'bg': 'var(--color-bg)',
        'surface': 'var(--color-surface)',
        'soft': 'var(--color-soft)',
        'soft-2': 'var(--color-soft-2)',
        'text': 'var(--color-text)',
        'text-muted': 'var(--color-muted)',
        'border': 'var(--color-border)',
        success: 'var(--success, #16a34a)',
        warning: 'var(--warning, #f59e0b)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      boxShadow: {
        premium: '0 10px 25px -5px rgba(0,0,0,0.3)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'fadeup': 'fadeup 0.45s ease-out both',
        'ping-dot': 'ping-dot 2s ease-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(500%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(29,78,216,0.25)' },
          '50%': { boxShadow: '0 0 0 8px rgba(29,78,216,0)' },
        },
        fadeup: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ping-dot': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
      },
      transitionDuration: {
        200: '200ms',
      },
      transitionTimingFunction: {
        ease: 'ease',
      },
    },
  },
  plugins: [],
};
