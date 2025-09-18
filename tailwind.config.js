/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Add this line to enable class-based dark mode
  theme: {
    extend: {
      backgroundImage: {
      'subg-light': 'linear-gradient(45deg, #fff4f4, #fffaea)',
      'subg-dark': 'linear-gradient(45deg, #4a3535, #2f2b22)',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        '4xl': '0 45px 80px -15px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'stagger-fade-in': 'staggerFadeIn 0.5s ease-out forwards',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
        },
        staggerFadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // Light gradients
    'from-green-100', 'via-blue-50', 'to-purple-100',
    'from-pink-100', 'via-yellow-50', 'to-red-100',
    'from-blue-100', 'via-indigo-50', 'to-cyan-100',
    'from-yellow-100', 'via-orange-50', 'to-pink-100',
    'from-purple-100', 'via-green-50', 'to-blue-100',
    'from-teal-100', 'via-lime-50', 'to-green-100',
    'from-red-100', 'via-pink-50', 'to-yellow-100',
    'from-indigo-100', 'via-blue-50', 'to-purple-100',
    'from-gray-100', 'via-gray-50', 'to-blue-100',
    // Dark gradients
    'dark:from-gray-900', 'dark:via-gray-800', 'dark:to-blue-900',
    'dark:from-purple-900', 'dark:via-blue-900', 'dark:to-green-900',
    'dark:from-blue-900', 'dark:via-indigo-900', 'dark:to-cyan-900',
    'dark:from-pink-900', 'dark:via-yellow-900', 'dark:to-red-900',
    'dark:from-green-900', 'dark:via-lime-900', 'dark:to-teal-900',
    'dark:from-red-900', 'dark:via-pink-900', 'dark:to-yellow-900',
    'dark:from-indigo-900', 'dark:via-blue-900', 'dark:to-purple-900',
    'dark:from-gray-800', 'dark:via-gray-900', 'dark:to-blue-900',
    // Gradient direction classes
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    'bg-gradient-to-l',
    'bg-gradient-to-t',
    'bg-gradient-to-b',
    'bg-gradient-to-tr',
    'bg-gradient-to-tl',
    'bg-gradient-to-bl',
  ],
}
