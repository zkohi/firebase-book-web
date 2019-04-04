import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../../components/bio"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

class BlogIndex extends React.Component<any, any> {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Firebase Sub Guides"
          keywords={[
            `firebase`,
            `guides`,
            `documentation`,
            `authentication`,
            `firestore`,
            `functions`,
            `hosting`,
            `storage`,
            `messaging`,
            `deployment`,
            `javascript`,
            `node`,
            `web`,
          ]}
        />
        {/*<Bio />*/}
        <p>
          このガイドの内容は、私が実際にfirebaseをウェブアプリ（JavaScript）で使用した際の経験を元にした情報を記載しております。ウェブアプリ以外を使用する場合でも、firebaseの各種機能を使用する上で、有益な情報も多くあると思います。
        </p>
        <p>
          主に
          <a href="https://firebase.google.com/docs/web/setup">
            公式ドキュメント
          </a>
          を引用して説明を行っています。公式ドキュメントでは不足している情報や注意点・必ず目を通しておくべき内容などを記載しておりますので、補足情報として役に立てていただければ幸いです。
        </p>
        <p>
          firebaseを使用したことがない方でも、
          <a href="https://firebase.google.com/docs/samples/p">公式サンプル</a>
          が多数あるので、ご自身で試してみるとfirebaseに対する理解が深まります。
        </p>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div
              key={node.fields.slug}
              style={{ borderBottom: `solid 2px black` }}
            >
              <h3>
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___order], order: ASC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
