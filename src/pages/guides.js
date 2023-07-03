import { graphql, useStaticQuery, Link } from "gatsby"
import * as React from 'react'

const GuidesPage = () => {
  const {
    pages: { nodes },
  } = useStaticQuery(graphql`
    {
      pages: allMarkdownRemark 
      (filter: {fileAbsolutePath: {regex: "/_guides/"  }}) {
        nodes {
          frontmatter {
            title
            slug
            description
          }
        }
      }
    }
  `)

  // return nodes.map(node => node.path)

  return (
    <main>
        {nodes.map(node => (
          <li key={node.frontmatter.slug}>
            <span>
              < Link to={node.frontmatter.slug}> { node.frontmatter.title } -> </Link> 
                <div dangerouslySetInnerHTML={{__html: node.frontmatter.description}} />
            </span>
          </li>
        ))}
    </main>
  )
}

export default GuidesPage

export const Head = () => <title>iiindex -> guides</title>
