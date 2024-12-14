/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{tsx,ts,js,jsx}',
    './src/components/xy-editor/**/*.{tsx,ts,js,jsx}',  // 包括xy-editor及其子目录
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

