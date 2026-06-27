/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
              "on-primary": "#ffffff",
              "on-secondary-fixed-variant": "#005137",
              "error": "#ba1a1a",
              "tertiary-fixed-dim": "#bdc7db",
              "tertiary": "#485262",
              "on-tertiary-container": "#e1ebff",
              "outline": "#6e7a73",
              "surface-container-highest": "#e0e2e6",
              "on-secondary-fixed": "#002114",
              "surface-variant": "#e0e2e6",
              "surface-container-high": "#e6e8ec",
              "on-secondary-container": "#00714e",
              "surface-tint": "#006c4e",
              "tertiary-container": "#606a7b",
              "surface-dim": "#d8dade",
              "surface-bright": "#f7f9fd",
              "primary": "#005d42",
              "on-secondary": "#ffffff",
              "outline-variant": "#bdc9c1",
              "on-tertiary": "#ffffff",
              "on-primary-fixed": "#002115",
              "on-error": "#ffffff",
              "on-tertiary-fixed-variant": "#3d4757",
              "inverse-on-surface": "#eff1f5",
              "secondary": "#006c4b",
              "primary-fixed": "#97f5cc",
              "secondary-fixed": "#68fcbf",
              "on-tertiary-fixed": "#121c2a",
              "surface-container-low": "#f2f4f8",
              "inverse-surface": "#2d3134",
              "on-surface-variant": "#3e4943",
              "inverse-primary": "#7bd8b1",
              "secondary-container": "#64f9bc",
              "on-primary-fixed-variant": "#00513a",
              "tertiary-fixed": "#d9e3f7",
              "surface": "#f7f9fd",
              "primary-fixed-dim": "#7bd8b1",
              "on-surface": "#191c1f",
              "background": "#f7f9fd",
              "surface-container-lowest": "#ffffff",
              "primary-container": "#047857",
              "surface-container": "#eceef2",
              "on-error-container": "#93000a",
              "on-primary-container": "#9ffdd3",
              "error-container": "#ffdad6",
              "secondary-fixed-dim": "#45dfa4",
              "on-background": "#191c1f",
              primaryColor:"#047857",
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
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "spacing": {
              "lg": "32px",
              "gutter": "24px",
              "base": "4px",
              "sm": "16px",
              "md": "24px",
              "xs": "8px",
              "margin": "32px",
              "xl": "48px"
      },
      "fontFamily": {
              "headline-md": [
                      "Manrope"
              ],
              "headline-lg": [
                      "Manrope"
              ],
              "body-lg": [
                      "Inter"
              ],
              "label-md": [
                      "Inter"
              ],
              "body-md": [
                      "Inter"
              ],
              "display-lg": [
                      "Manrope"
              ],
              "caption": [
                      "Inter"
              ]
      },
      "fontSize": {
              "headline-md": [
                      "24px",
                      {
                              "lineHeight": "32px",
                              "fontWeight": "600"
                      }
              ],
              "headline-lg": [
                      "32px",
                      {
                              "lineHeight": "40px",
                              "letterSpacing": "-0.01em",
                              "fontWeight": "600"
                      }
              ],
              "body-lg": [
                      "18px",
                      {
                              "lineHeight": "28px",
                              "fontWeight": "400"
                      }
              ],
              "label-md": [
                      "14px",
                      {
                              "lineHeight": "20px",
                              "letterSpacing": "0.01em",
                              "fontWeight": "500"
                      }
              ],
              "body-md": [
                      "16px",
                      {
                              "lineHeight": "24px",
                              "fontWeight": "400"
                      }
              ],
              "display-lg": [
                      "48px",
                      {
                              "lineHeight": "56px",
                              "letterSpacing": "-0.02em",
                              "fontWeight": "700"
                      }
              ],
              "caption": [
                      "12px",
                      {
                              "lineHeight": "16px",
                              "fontWeight": "400"
                      }
              ]
      },
      boxShadow:{
        pannelShadow:"rgba(17,12,46,0.15) 0px 48px 100px 0px;",
        "surface": "0_10px_25px_-5px_rgba(4,120,87,0.05)"
      }
    },
  },
  plugins: [],
}


