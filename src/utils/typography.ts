import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    h1: {
      "text-transform": `none`,
    },
    h2: {
      "border-bottom": `solid 2px black`,
      "text-transform": `none`,
    },
    h3: {
      "text-transform": `none`,
    },
    h4: {
      "text-transform": `none`,
    },
    h5: {
      "text-transform": `none`,
    },
    h6: {
      "text-transform": `none`,
    },
    "ul,ol": {
      "margin-left": `1.75rem`,
    },
    footer: {
      margin: `1rem auto`,
      "text-align": `center`,
    },
    pre: {
      "margin-bottom": `0`,
    },
    blockquote: {
      "font-size": `1em`,
      "background-color": `#fdf6e3`,
      "border-radius": `0.3em`,
      padding: `0.5em`,
      "margin-left": `0`,
      "margin-right": `0`,
      "margin-top": `0`,
    },
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    ".gatsby-highlight": {
      "background-color": `#fdf6e3`,
      "border-radius": `0.3em`,
      margin: `0.5em 0`,
      padding: `1em`,
      overflow: `auto`,
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
