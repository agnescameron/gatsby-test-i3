import { graphql, Link } from "gatsby"
import * as React from 'react'
import SearchForm from "./search-form";
import AdvSearch from "./adv-search";

const IndexPage = () => {

  return (
    <main>
    <h1>I3 Open Innovation Data Index</h1>
      <ul>
       <li><Link to="/datasets/">Datasets</Link></li>
       <li><Link to="/tools/">Tools</Link></li>
       <li><Link to="/guides/">Guides</Link></li>
     </ul>
     <SearchForm />
     <AdvSearch />
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
