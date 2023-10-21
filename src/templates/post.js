import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../pages/components/layout"

const PostTemplate = ({data}) => {

  const dataset = data.markdownRemark
  console.log('dataset is', data)

  return (
    <Layout>
    <div>
      <h1>{dataset.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{__html: dataset.html}} />
    </div>
    </Layout>
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
        contributors
        location
        schema_fields
      }
    }
  }
`