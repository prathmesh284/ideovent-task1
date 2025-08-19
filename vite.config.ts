/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  proxy:{
    // Proxy API calls to the Node server
    '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
    }
  }
}