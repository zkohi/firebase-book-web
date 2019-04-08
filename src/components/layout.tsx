import React from "react"
import { Link } from "gatsby"

// @ts-ignore
import { rhythm, scale } from "../utils/typography"
import styled from "styled-components"

const Container = styled.div`
  margin: 3rem auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const HeaderTitle = styled.h3`
  text-align: center;
  fontFamily: Montserrat, sans-serif
  marginTop: 0;
`

class Layout extends React.Component<any, any> {
  render() {
    const { location, title, children } = this.props
    // @ts-ignore
    const rootPath = `/ja/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.2),
            marginBottom: rhythm(1),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <HeaderTitle
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </HeaderTitle>
      )
    }
    return (
      <Container>
        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <header>{header}</header>
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://firebase.google.com" target="_blank">Firebase</a>
          </footer>
        </div>
      </Container>
    )
  }
}

export default Layout
