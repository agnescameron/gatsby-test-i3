import React, { useState, useEffect, useContext, useReducer } from 'react';

const formReducer = (state, event) => {
    return {
     ...state,
     [event.name]: event.value
   }
}

const Filter = ({key, num, index, tagsIndex, fieldsIndex, toolsIndex, tagStore, toolStore, fieldStore, handleFilterChange}) => {
    const [searchTags, setSearchTags] = React.useState(false);
    const [searchFields, setSearchFields] = React.useState(false);
    const [tagResults, setTagResults] = React.useState([]);
    const [fieldResults, setFieldResults] = React.useState([]);
 

  const tagSearch = event => {
    // const q = e.target.value
    console.log('searching tags', tagsIndex)
    let q = event.target.value.slice(-1) === " " ? event.target.value : event.target.value + '*';
    let res = []
    try {
      // Search is a lunr method
      res = tagsIndex.search(q).map(({ ref }) => {
        // Map search results to an array of {slug, title, excerpt} objects
        return {
          _id: ref,
          ...tagStore[ref],
        }
      })
      console.log('got results', res, q)
      setTagResults(res)
        // return res
    } catch (error) {
      console.log(error)
    }
  }

  const fieldSearch = event => {
    // const q = e.target.value
    console.log('searching fields', fieldsIndex)
    let q = event.target.value.slice(-1) === " " ? event.target.value : event.target.value + '*';
    let res = []
    try {
      // Search is a lunr method
      res = fieldsIndex.search(q).map(({ ref }) => {
        // Map search results to an array of {slug, title, excerpt} objects
        return {
          _id: ref,
          ...fieldStore[ref],
        }
      })
      console.log('got results', res, q)
      setFieldResults(res)
        // return res
    } catch (error) {
      console.log(error)
    }
  }



  const fetchResults = async (result, docs) => {
    console.log('fetching')
  }

  // const handleFilterChange = (num, event) => {
  //   console.log('filter', num, event.target.value)
  // }

  const handleFilterFieldChange = event => {
    console.log('filter', event.target.value)
    handleFilterChange(num, event)
    event.target.value == 'tags' ? setSearchTags(true) : setSearchTags(false);
    event.target.value == 'salient_fields' ? setSearchFields(true) : setSearchFields(false);
  }

  // const handleFieldSearchChange = async event => {
  //   event.preventDefault()
  //   console.log('field search change')
  // }

  const removeFilter = async event => {
    event.preventDefault()
    console.log('removing')
  }


  // const handleTagSearchChange = async event => {
  //   event.preventDefault()
  //   console.log('tag search change')

  // }


  return(
    <div className="Filter">
    { num !== 0 && 
      <label>
        <select name="modifier" id="modifier" onChange={event => handleFilterChange(num, event)}>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
          <option value="NOT">NOT</option>
        </select>
      </label>
    }

      <label>
        <select name="field" id="field" onChange={handleFilterFieldChange}>
         <option value="any">Any Field</option>
          <option value="title">Title</option>
          <option value="description">Description</option>
          <option value="salient_fields">Dataset Headers</option>
          <option value="tags">Tags</option>
          <option value="contributors">Contributors</option>
        </select>
      </label>

      <label>contains:
        { searchTags && 
            <span><input id="searchInput" name="fieldString" type="text" onChange={tagSearch}/>
            { tagResults && <div id="inputAppend">possible tags: {tagResults.filter( (item, i) => i < 5 ).map( (result, j) => <li key={j}>{result.tag} </li> )}</div>}
            </span>
        }
        { searchFields && 
            <span><input id="searchInput" name="fieldString" type="text" onChange={fieldSearch}/>
            { fieldResults && <div id="inputAppend">possible fields: {fieldResults.filter( (item, i) => i < 5 ).map( (result, j) => <li key={j}>{result.field} </li>)}</div>}
            </span>
        }
        { ( !searchTags && !searchFields ) && 
          <input id="tagSearch" name="fieldString" type="text" onChange={event => handleFilterChange(num, event)}/>
        }
      </label>
      
      { num !== 0 && <button onClick={event => removeFilter(num, event)}>-</button> }
    </div>
  )
}

export default Filter;