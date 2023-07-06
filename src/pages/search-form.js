/* src/components/search-form.js */
import React, { useState, useRef } from "react"
import { navigate } from "@reach/router"
import { Link, graphql, useStaticQuery } from "gatsby"
import { Index } from "lunr"

const SearchForm = ({ initialQuery = "" }) => {
  // Create a piece of state, and initialize it to initialQuery
  // query will hold the current value of the state,
  // and setQuery will let us change it
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = React.useState([]);

  const data = useStaticQuery( graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      LunrIndex
    }
`)
  
  // LunrIndex is available via page query
  const { store } = data.LunrIndex
  // Lunr in action here
  const index = Index.load(data.LunrIndex.index)
  // We need to get reference to the search input element
  const inputEl = useRef(null)

  // On input change use the current value of the input field (e.target.value)
  // to update the state's query value
  const quickSearch = event => {
    // const q = e.target.value
    let q = event.target.value.slice(-1) === " " ? event.target.value : event.target.value + '*';
    setQuery(event.target.value)
    let res = []
    try {
      // Search is a lunr method
      res = index.search(q, {
          fields: {
              title: {boost: 10},
              description: {boost: 5}
          }
        }).map(({ ref }) => {
        // Map search results to an array of {slug, title, excerpt} objects
        return {
          slug: ref,
          ...store[ref],
        }
      })
      console.log('got results', results)
      setResults(res)
    } catch (error) {
      console.log(error)
    }

  }


  // When the form is submitted navigate to /search
  // with a query q paramenter equal to the value within the input search
  const handleSubmit = e => {
    e.preventDefault()
    // `inputEl.current` points to the mounted search input element
    const q = inputEl.current.value
    navigate(`/search?q=${q}`)
  }
  return (
    <div>
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-input" style={{ display: "block" }}>
        Search for:
      </label>
      <input
        ref={inputEl}
        id="search-input"
        type="search"
        value={query}
        placeholder="e.g. duck"
        onChange={quickSearch}
      />
      <button type="submit">Go</button>
    </form>
      <div>
        { results.length > 0 && <div><b>Quick search results:</b> 
          { results.filter( (item, i) => i < 5 ).map( 
            (result, j) => <li key={j}> {result.title} </li> 
            )}</div>}
      </div>
      </div>
  )
}
export default SearchForm

