/* src/components/search-form.js */
import React, { useState, useRef, useContext, useReducer } from "react"
import { navigate } from "gatsby"
import { Link, graphql, useStaticQuery } from "gatsby"
import { Index } from "lunr"
import Filter from "./components/Filter"


const formReducer = (state, event) => {
    return {
     ...state,
     [event.name]: event.value
   }
}


const AdvSearch = ({ initialQuery = "" }) => {
  // Create a piece of state, and initialize it to initialQuery
  // query will hold the current value of the state,
  // and setQuery will let us change it
  const formTemplate = { index: 'datasets', code: false, documentation: false, permalink: false, free: false};
  const filterTemplate = { field: 'any', fieldString: ''};
  const [searchString, setSearchString] = React.useState("");
  const [filters, setFilters] = React.useState([{...filterTemplate}, {...filterTemplate, modifier: 'AND'}]);
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = React.useState([]);
  const [currentForm, setCurrentForm] = useReducer(formReducer, formTemplate);

   const fieldMap = {
      "any": "Any Field", 
      "title": "Title", 
      "description": "Description", 
      "schema_fields": "Dataset Headers", 
      "tags": "Tags", 
      "contributors": "Contributors", 
   }

  const data = useStaticQuery( graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      LunrIndex
      LunrIndexTools
      LunrIndexTags
      LunrIndexFields
    }
`)
  
  // LunrIndex is available via page query
  const { store } = data.LunrIndex
  const { toolStore } = data.LunrIndexTools
  const { tagStore } = data.LunrIndexTags
  const { fieldStore } = data.LunrIndexFields
  // Lunr in action here
  const mainIndex = Index.load(data.LunrIndex.index)
  const toolsIndex = Index.load(data.LunrIndexTools.index)
  const tagsIndex = Index.load(data.LunrIndexTags.index)
  const fieldsIndex = Index.load(data.LunrIndexFields.index)

  // console.log('got tools', toolsIndex, 'got tags', tagsIndex)
  // We need to get reference to the search input element
  const inputEl = useRef(null)


    const fetchResults = async (result, docs) => {
        return result.map((item) => {
              var match = docs.find((doc) => item.ref.toString() === doc._id.toString())
              match.score = item.score
              return match
        })
    }

    const handleFormChange = event => {
      if(event.target.value !== '') {
        setCurrentForm({
          name: event.target.name,
          value: event.target.type === "checkbox" ? event.target.checked : event.target.value
        });
      }
    }


    const handleFilterChange = (index, event) => {
      let data = [...filters];
      data[index][event.target.name] = event.target.value;
      setFilters(data);
    }

    const addFilter = event => {
      event.preventDefault()
      setFilters([...filters, {...filterTemplate, modifier: 'AND'}]);
    }

    const removeFilter = (index, event) => {
      // event.preventDefault()
      const reducedFilters = [...filters]
      reducedFilters.splice(index, 1);
      setFilters([...reducedFilters]);
    }

  // On input change use the current value of the input field (e.target.value)
  // to update the state's query value
  const advSearch = event => {
    // const q = e.target.value
    event.preventDefault();
    let searchString='';
    filters.forEach( filter => {
      console.log('filter', filter)
      if(filter.fieldString !== ""){
        let modifier = '';
        if(filter.modifier === "AND") modifier = '+';
        else if(filter.modifier === "NOT") modifier = '-';
        searchString += filter.field === 'any' ? modifier + filter.fieldString + " " : modifier + filter.field + ":" + filter.fieldString + " ";
      }
    })

    // let q = event.target.value.slice(-1) === " " ? event.target.value : event.target.value + '*';
    // setQuery(event.target.value)
    Object.keys(currentForm).forEach(key => {
      if (currentForm[key] === true) searchString += '+' + key + ":* ";
    })

    const index = currentForm.index === 'datasets' ? mainIndex : toolsIndex
    // const docs = currentForm.index === 'datasets' ? props.datasets : props.tools


    let res = []
    try {
      // Search is a lunr method
      res = index.search(searchString).map(({ ref }) => {
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
    results.length > 0 && console.log(results[0])
    results.length > 0 && navigate(results[0].slug + '/')
  }


  return (
        <div>

          <div className="searchBox">
          <h2>advanced search</h2>
          <form onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
            <label><h3>query builder:</h3>
            <div>
              <div className="formSection">
                  <label>search index:<br/>
                    <label><input type="radio" name="index" value="datasets" defaultChecked="true" onChange={handleFormChange}/>datasets</label><br/>
                    <label><input type="radio" name="index" value="tools" onChange={handleFormChange}/>tools</label><br/>
                   </label>
              </div>
               <div className="formSection">
               <>
              { filters.map( (filter, i) => <Filter 
                key={i}
                num={i} 
                index={mainIndex}
                tagsIndex={tagsIndex}
                fieldsIndex={fieldsIndex}
                toolsIndex={toolsIndex}
                tagStore={tagStore}
                toolStore={toolStore}
                fieldStore={fieldStore}
                handleFilterChange={handleFilterChange}
                removeFilter={removeFilter}
                /> )
               }
                </>
                  <button type="button" onClick={addFilter}>+</button>
                <div>
                </div>
            { filters.length > 0 && <div><b>current query:</b> 
              { filters.map( (filter, i) => <li key={i}>{filter.modifier} {fieldMap[filter.field]} contains {filter.fieldString}</li>)}</div>}
                  </div>
                <div className="formSection">
                  <label>reusability:<br/>
                    <label><input type="checkbox" name="code" onChange={handleFormChange}/>code available</label><br/>
                    <label><input type="checkbox" name="documentation" onChange={handleFormChange}/>documentation available</label><br/>
                  </label>
                  </div>
              </div>
            </label>
                </form>
          <form onSubmit={advSearch}>
            <br/>
            <button>run advanced search</button>
          </form>
          <div>
            { results.length > 0 && <div><b>Advanced search results:</b> {results.filter( (item, i) => i < 5 ).map( (result, j) => <li key={j}>{Math.round(result.score*10)/10}: {result.title} </li> )}</div>}
          </div>
          </div>
        </div>
  )
}
export default AdvSearch

