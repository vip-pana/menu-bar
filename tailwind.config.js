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
        // Guidati da variabili CSS: il lato ospite le riscrive a ogni
        // caricamento (vedi src/theme.js). Il bancone usa i default in :root.
        volt: {
          DEFAULT: 'rgb(var(--volt) / <alpha-value>)',
          soft: 'rgb(var(--volt-soft) / <alpha-value>)',
          deep: 'rgb(var(--volt-deep) / <alpha-value>)',
        },
      },
      boxShadow: {
        glow: '0 0 20px -2px rgb(var(--volt) / .45)',
        'glow-sm': '0 0 12px -3px rgb(var(--volt) / .5)',
      },
    },
  },
  plugins: [],
}
