/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primaryColor:"#0067FF",
        yellowColor:"#FEB60D",
        purpleColor:"#9771FF",
        irisBlueColor:"#01B5C5",
        headingColor:"#181A1E",
        textColor:"#4E545F",
        irissky:{
          DEFAULT: "#0ea5e9",
          500: "#0ea5e9",
        },
        pharmacyGreen:"#34d399"

      },
      boxShadow:{
        pannelShadow:"rgba(17,12,46,0.15) 0px 48px 100px 0px;"
      },
    },
  },
  plugins: [],
}


