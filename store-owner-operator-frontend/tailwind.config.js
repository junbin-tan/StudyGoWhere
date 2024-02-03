/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat'],
        'lato': ['Lato'],
        'garamond': ['Garamond'],
        'playpen': ['Playpen Sans'],
        'caveat': ['Caveat'],
      },
      width: {
        '250': '250px',
        '1/24': 'calc(100% / 24)',
        '1/48': 'calc(100% / 48)',
      },
      colors: {
        'brown-100': '#65451F',
        'brown-90':'#765827',
        'brown-80': '#C8AE7D',
        'brown-70': '#EAC696',

        'gray-100': '#242424',
        'gray-90':'#454545',
        'gray-80':'#696969',
        'gray-70': '#8E8E8E',

        'lightgray-100': '#BBBBBB',
        'lightgray-90': '#ECECEC',
        'lightgray-80': '#F9F9F9',
        'lightgray-70': '#F3F3F3',

        'custom-red' : '#D74A45',
        'custom-lightblue': '#79c8cf',
        'custom-darkblue': '#1F737A',
        // 'custom-yellow': '#1F737A',
        // 'custom-yellow-2': '#FB9300',
        'custom-yellow-2': '#FF7400',
        'custom-yellow': '#E04F53', // not really yellow, this is the primary color (red)
        'custom-lighter-red': '#FABEB6',
        'custom-blue': '#0700D9',
        'custom-lilac': '#F0E1FF',
        'custom-yellow-hover': '#B03E41',
        'white': "#FFFFFF",

      },
      spacing: {
        '1/5': "20%",
        '1/8': "12.5%",

      },
      gridTemplateColumns: {
        // Simple 48 column grid
        '48': 'repeat(48, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
      },

      gridColumn: {
        'span-16': 'span 16 / span 16',
      }
    }
  },
  plugins: [],
  corePlugins: {
    // preflight: false,
  },
  important: '#root'
}