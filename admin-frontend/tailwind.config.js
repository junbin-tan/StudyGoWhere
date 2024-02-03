/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // colors: {
    //   // 'brown-100': '#65451F',
    //   // 'brown-90':'#765827',
    //   // 'brown-80': '#C8AE7D',
    //   // 'brown-70': '#EAC696',

    //   // 'gray-100': '#242424',
    //   // 'gray-90':'#454545',
    //   // 'gray-80':'#696969',
    //   // 'gray-70': '#8E8E8E',
  
    //   // 'lightgray-100': '#BBBBBB',
    //   // 'lightgray-90': '#ECECEC',
    //   // 'lightgray-80': '#F9F9F9',

    //   // 'white': '#FFF',
    // },
    extend: {
      fontFamily: {
          'montserrat': ['Montserrat'],
          'lato': ['Lato'],
          'garamond': ['Garamond']
      },
      width: {
        '250': '250px',
      }
  }
  },
  plugins: [],
}