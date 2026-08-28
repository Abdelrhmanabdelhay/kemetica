/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': 'var(--primary-blue)',
        'secondary-gold': 'var(--secondary-gold)',
        'gold-hover': 'var(--gold-hover)',
        'bg-sand': 'var(--bg-sand)',
        'text-dark': 'var(--text-dark)',
        'pure-white': 'var(--pure-white)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        signature: ['"Dancing Script"', 'cursive'], // add this
        sans: ['var(--font-body)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
