import { graphql, useStaticQuery, Link } from "gatsby"
import * as React from 'react'

const IndexPage = () => {
  const {
    pages: { nodes },
  } = useStaticQuery(graphql`
    {
      pages: allMarkdownRemark {
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

export default IndexPage

export const Head = () => <title>Home Page</title>
