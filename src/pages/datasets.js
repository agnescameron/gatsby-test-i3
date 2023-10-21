import { graphql, useStaticQuery, Link } from "gatsby"
import * as React from 'react'
import Layout from './components/layout'
import "./index.css"

const DatasetPage = () => {
  const {
    pages: { nodes },
  } = useStaticQuery(graphql`
    {
      pages: allMarkdownRemark (filter: {fileAbsolutePath: {regex: "/_datasets/"  }}) {
        nodes {
          frontmatter {
            title
            slug
            description
            uuid
            thumbnail_url
          }
        }
      }
    }
  `)

  // return nodes.map(node => node.path)

  return (
    <Layout>
    <ul className="indexList">
        {nodes.map(node => (
        <Link to={"/" + node.frontmatter.slug}>
          <li key={node.frontmatter.slug}>
          <div className="itemThumb">
            { node.frontmatter.thumbnail_url ?
            <img src={node.frontmatter.thumbnail_url}/> :
            <img src={"/assets/thumbnails/"+ node.frontmatter.uuid +".png"}/>
            }
          </div>
            <div className="itemCard">
              <b>{ node.frontmatter.title }</b><br />
              <span dangerouslySetInnerHTML={{__html: node.frontmatter.description.substring(0, 250) + "..." }} />
            </div>
          </li>
        </Link>
        ))}
  </ul>
    </Layout>
  )
}

export default DatasetPage

export const Head = () => <title>iiindex -> datasets</title>
