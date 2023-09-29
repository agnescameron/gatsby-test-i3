import React, { useState, useEffect, useContext, useReducer } from 'react';

const formReducer = (state, event) => {
    return {
     ...state,
     [event.name]: event.value
   }
}

const Filter = ({key, num, index, tagsIndex, fieldsIndex, toolsIndex}) => {
    const [searchTags, setSearchTags] = React.useState(false);
    const [searchFields, setSearchFields] = React.useState(false);
    const [tagResults, setTagResults] = React.useState([]);
    const [fieldResults, setFieldResults] = React.useState([]);
 

  const fetchResults = async (result, docs) => {
    console.log('fetching')
  }

  const handleFilterChange = event => {
    console.log('filter', event.target.value)
  }

  const handleFilterFieldChange = event => {
    console.log('filter', event.target.value)
  }

  const handleFieldSearchChange = async event => {
    event.preventDefault()
    console.log('field search change')
  }

  const removeFilter = async event => {
    event.preventDefault()
    console.log('removing')
  }


  const handleTagSearchChange = async event => {
    event.preventDefault()
    console.log('tag search change')

  }


  return(
    <div className="Filter">
    { num !== 0 && 
      <label>
        <select name="modifier" id="modifier" onChange={event => handleFilterChange(index, event)}>
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
            <span><input id="searchInput" name="fieldString" type="text" onChange={handleTagSearchChange}/>
            { tagResults && <div id="inputAppend">possible tags: {tagResults.filter( (item, i) => i < 5 ).map( (result, j) => <li key={j}>{Math.round(result.score*10)/10}: {result.tag} </li> )}</div>}
            </span>
        }
        { searchFields && 
            <span><input id="searchInput" name="fieldString" type="text" onChange={handleFieldSearchChange}/>
            { fieldResults && <div id="inputAppend">possible fields: {fieldResults.filter( (item, i) => i < 5 ).map( (result, j) => <li key={j}>{Math.round(result.score*10)/10}: {result.field} </li>)}</div>}
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