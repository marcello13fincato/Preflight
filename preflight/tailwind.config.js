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
        // use CSS variables defined in globals.css for flexibility and theme tokens
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        background: 'var(--color-background)',
        'background-alt': 'var(--color-background-alt)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        accent: 'var(--color-accent)',
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
