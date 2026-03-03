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
        primary: 'var(--primary)',
        'primary-dark': 'var(--primaryDark)',
        'bg': 'var(--bg)',
        'surface': 'var(--surface)',
        'soft': 'var(--soft)',
        'soft-2': 'var(--soft2)',
        'text': 'var(--text)',
        'text-muted': 'var(--muted)',
        'border': 'var(--border)',
        success: 'var(--success, #16a34a)',
        warning: 'var(--warning, #f59e0b)',
      },
      boxShadow: {
        premium: '0 10px 25px -5px rgba(0,0,0,0.3)',
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
