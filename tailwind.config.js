/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        fun: ['"Fredoka"', '"Bubblegum Sans"', 'cursive', 'sans-serif'],
        body: ['"Comic Neue"', 'cursive', 'sans-serif'],
      },
      colors: {
        candy: {
          pink: '#FF6B9D',
          purple: '#C44DFF',
          blue: '#4DA6FF',
          cyan: '#36D6E7',
          green: '#44E55A',
          yellow: '#FFD93D',
          orange: '#FF8C42',
          red: '#FF5252',
        },
        bubble: {
          50: '#FFF5F7',
          100: '#FFE5EC',
          200: '#FFC2D4',
          300: '#FF9EBC',
          400: '#FF6B9D',
          500: '#FF3D7F',
          600: '#E6366F',
        },
        sky: {
          light: '#E8F4FD',
          medium: '#B5DCEE',
        }
      },
      borderRadius: {
        'blob': '30px',
        'bubble': '20px',
      },
      boxShadow: {
        'candy': '0 4px 15px rgba(255, 107, 157, 0.3)',
        'fun': '0 6px 20px rgba(196, 77, 255, 0.25)',
        'playful': '0 8px 25px rgba(77, 166, 255, 0.2)',
        'bouncy': '0 10px 30px rgba(68, 229, 90, 0.2)',
      },
      animation: {
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
