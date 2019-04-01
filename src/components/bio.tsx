import React from "react"
import { StaticQuery, graphql } from "gatsby"
// import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <p>
              Written by{" "}
              <strong>
                <a href={`https://twitter.com/${social.twitter}`}>@{author}</a>
              </strong>
              .{` `}
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    #    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
    #      childImageSharp {
    #        fixed(width: 50, height: 50) {
    #          ...GatsbyImageSharpFixed
    #        }
    #      }
    #    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
