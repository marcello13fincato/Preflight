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
        primary: '#0A66C2',
        'primary-hover': '#004182',
        background: '#002845',
        'background-alt': '#003d66',
        'text-primary': '#ffffff',
        'text-secondary': '#d1d5db',
        border: '#374151',
        success: '#3DC073',
        accent: '#0A98FF',
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
