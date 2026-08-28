export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fondali e bordi: nero leggermente bluastro, non grigio neutro.
        ink: {
          base: '#07090F',
          raised: '#0E131C',
          edge: '#1B2430',
        },
        // Testi, dal piu' acceso al piu' spento.
        frost: {
          DEFAULT: '#E8F4F8',
          dim: '#A8BCCC',
          mute: '#748899',
        },
        // L'accento della festa.
        volt: {
          DEFAULT: '#22D3EE',
          soft: '#67E8F9',
          deep: '#0891B2',
        },
      },
      boxShadow: {
        glow: '0 0 20px -2px rgba(34, 211, 238, .45)',
        'glow-sm': '0 0 12px -3px rgba(34, 211, 238, .5)',
      },
    },
  },
  plugins: [],
}
