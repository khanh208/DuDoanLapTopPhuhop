/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tông màu Formula chủ đạo
        formula: {
          red: '#e10600',       // Đỏ F1 (Speed Red)
          carbon: '#0b0e11',    // Đen Carbon sâu
          slate: '#1f2937',     // Xám Slate cho Card
          darker: '#080a0c',    // Đen nền tối hơn
          blue: '#00d2ff',      // Xanh Electric (cho chỉ số AI/Tech)
        }
      },
      fontFamily: {
        // Font chữ không chân, mạnh mẽ cho phong cách kỹ thuật
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        // Hiệu ứng gradient cho nút hoặc thẻ
        'formula-gradient': 'linear-gradient(135deg, #e10600 0%, #900400 100%)',
      }
    },
  },
  plugins: [],
}