import * as React from "react"
import { graphql } from "gatsby"


const PostTemplate = ({data}) => {

  const dataset = data.markdownRemark
  console.log('dataset is', data)

  return (
    <div>
      <h1>{dataset.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{__html: dataset.html}} />
    </div>
  )

}

export default PostTemplate

export const pageQuery = graphql`
  query PostBySlug(
    $id: String!
  ) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        uuid
        slug
        tags
        authors
        location
        schema_fields
      }
    }
  }
`