/* src/components/search-form.js */
import React, { useState, useReducer } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { Index } from "lunr"
import Filter from "./filter"
import "./search.css"

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
  const [filters, setFilters] = useState([{...filterTemplate}, {...filterTemplate, modifier: 'AND'}]);
  const [results, setResults] = useState([]);
  const [currentForm, setCurrentForm] = useReducer(formReducer, formTemplate);

   const fieldMap = {
      "any": "Any Field", 
      "title": "Title", 
      "description": "Description", 
      "salient_fields": "Dataset Headers", 
      "tags": "Tags", 
      "contributors": "Contributors", 
   }

    const {
    pages: { nodes },
    site: site,
    store: store,
    tagStore: tagStore,
    toolStore: toolStore,
    fieldStore: fieldStore
  } = useStaticQuery( graphql`
    {
      pages: allMarkdownRemark {
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

      site: site {
        siteMetadata {
          title
        }
      }
      store: LunrIndex
      toolStore: LunrIndexTools
      tagStore: LunrIndexTags
      fieldStore: LunrIndexFields
    }
`)
  
  // LunrIndex is available via page query
  // const { store } = data.LunrIndex
  // const { toolStore } = data.LunrIndexTools
  // const { tagStore } = data.LunrIndexTags
  // const { fieldStore } = data.LunrIndexFields
  // Lunr in action here
  const mainIndex = Index.load(store.index)
  const toolsIndex = Index.load(toolStore.index)
  const tagsIndex = Index.load(tagStore.index)
  const fieldsIndex = Index.load(fieldStore.index)

  console.log(currentForm)

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
    let orQuery = false; // bit inelegant; need to know if and-ing or or-ing the first field
    filters.forEach( filter => {
      console.log('filter', filter)
      if(filter.fieldString !== ""){
        let modifier = '';
        const fieldString = filter.fieldString.replace(/(?=[() ])/g, '\\')
        if(filter.modifier === "AND") modifier = '+';
        else if(filter.modifier === "NOT") modifier = '-';
        else if(filter.modifier === "OR") orQuery = true;
        searchString += filter.field === 'any' ? modifier + fieldString + " " : modifier + filter.field + ":" + fieldString + " ";
      }
    })

    //if it's not an OR type query, require first field
    searchString = orQuery ? searchString : '+' + searchString

    Object.keys(currentForm).forEach(key => {
      if (currentForm[key] === true) searchString += '+' + key + ":* ";
    })

    const index = currentForm.index === 'datasets' ? mainIndex : toolsIndex

    console.log('search string is', searchString, 'current form is', currentForm)

    let res_temp = []
    try {
      res_temp = index.search(searchString).map(({ ref }) => {
        return {
          slug: ref,
          ...store[ref],
        }
      })
      const res_nodes = res_temp.map(res => nodes.find(node => node.frontmatter.slug === res.slug.replace('/', '')))
      setResults(res_nodes)
    } catch (error) {
      console.log(error)
    }

  }


  return (
        <div>
          <form onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} >
            <div>
              <h3>index to search</h3>
              <div className="formSection">
                    <label><input type="radio" name="index" value="datasets" defaultChecked="true" onChange={handleFormChange}/>datasets</label><br/>
                    <label><input type="radio" name="index" value="tools" onChange={handleFormChange}/>tools</label><br/>
              </div>
               <h3>filters</h3>
               <div className="formSection">
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
                  <button type="button" id="filterButton" onClick={addFilter}>+</button><br/>
                <div>
                </div>
              </div>
              <h3>reusability</h3>
                <div className="formSection">
                    <label><input type="checkbox" name="code" onChange={handleFormChange}/>code available</label><br/>
                    <label><input type="checkbox" name="documentation" onChange={handleFormChange}/>documentation available</label><br/>
                 </div>
              </div>
              </form>
          <form id="submitAdvSearch" onSubmit={advSearch}>
              <div>
                  ↪ find <b>{currentForm.index}</b> where 
                  { filters.map( (filter, i) =>  ( filter.fieldString !== '' || filter.field !== 'any') && <span key={i}><b>{filter.modifier && filter.modifier.toLowerCase()}</b> <b>{fieldMap[filter.field].toLowerCase()}</b> contains <b>{filter.fieldString}</b> </span>)}...
                  { currentForm['code'] && <span><br/> → includes code</span> }
                  { currentForm['documentation'] && <span><br/> → includes documentation </span> }
              </div>
            <button>run search</button>
          </form>
          <div>
            { results.length > 0 && <div className="results"><h2>Advanced search results:</h2>
            <ul className="indexList"> 
              { results.filter( (item, i) => i < 5 ).map( (node, j) => 
              <Link to={"/" + node.frontmatter.slug} key={node.frontmatter.slug}>
                <li>
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
               )}
               </ul>
              </div>}
          </div>
        </div>
  )
}
export default AdvSearch

