import { graphql, useStaticQuery, Link } from "gatsby"
import * as React from 'react'
import Layout from './components/layout'
import { quickSearch } from "./helpers/quicksearch"
import { Index } from "lunr"

const ToolsPage = () => {
  const {
    pages: { nodes },
    lunr: lunr
  } = useStaticQuery(graphql`
    {
      pages: allMarkdownRemark 
      (filter: {fileAbsolutePath: {regex: "/_tools/"  }}) {
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
      lunr: LunrIndexTools
    }
  `)


  const [results, setResults] = React.useState(nodes);
  const { store } = lunr
  // Lunr in action here
  const index = Index.load(lunr.index)

  const filter = (query, index, store) => {
    const results = quickSearch(query, index, store)
    const res_nodes = results.map(res => nodes.find(node => node.frontmatter.slug === res.slug.replace('/', '')))
    setResults(res_nodes)
  }

  return (
    <Layout>
        <div>
        <h1>Tools</h1>
        <p>
        para about tools
        </p>
        </div>
        <div>
          <form role="search">
            <label htmlFor="search-input" style={{ display: "block" }}>
              <b>Filter:</b>
            </label>
            <input
              id="search-input"
              type="search"
              placeholder="tool name"
              onChange={(event) => filter(event.target.value, index, store)}
            />
            <button type="submit">Go</button>
          </form>
        </div>
        <ul className="indexList">
          {results.map(node => (
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
                <span>{ node.frontmatter.description.replace(/^(.{200}[^\s]*).*/, "$1")  }</span>
              </div>
            </li>
          </Link>
          ))}
        </ul>
    </Layout>
  )
}

export default ToolsPage

export const Head = () => <title>iiindex -> tools</title>
