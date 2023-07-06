/* src/pages/search.js */
import React from "react"
import { Link, graphql } from "gatsby"
import { Index } from "lunr"
// import SearchForm from "./search-form"

// We can access the results of the page GraphQL query via the data props
const SearchPage = ({ data, location }) => {
  
  // We can read what follows the ?q= here
  // URLSearchParams provides a native way to get URL params
  // location.search.slice(1) gets rid of the "?" 
  const params = new URLSearchParams(location.search.slice(1))
  const q = params.get("q") || ""

  // LunrIndex is available via page query
  const { store } = data.LunrIndex
  // Lunr in action here
  const index = Index.load(data.LunrIndex.index)
  let results = []
  try {
    // Search is a lunr method
    results = index.search(q).map(({ ref }) => {
      // Map search results to an array of {slug, title, excerpt} objects
      return {
        slug: ref,
        ...store[ref],
      }
    })
    console.log('got results', results)
  } catch (error) {
    console.log(error)
  }
  return (
    <p>searchpage</p>
  )
}
export default SearchPage
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    LunrIndex
  }
`