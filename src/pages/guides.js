import { graphql, useStaticQuery, Link } from "gatsby"
import * as React from 'react'
import Layout from './components/layout'

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
    <Layout>
        {nodes.map(node => (
          <li key={node.frontmatter.slug}>
            <span>
              < Link to={'/' + node.frontmatter.slug}> { node.frontmatter.title } -> </Link> 
                <div dangerouslySetInnerHTML={{__html: node.frontmatter.description}} />
            </span>
          </li>
        ))}
    </Layout>
  )
}

export default GuidesPage

export const Head = () => <title>iiindex -> guides</title>
