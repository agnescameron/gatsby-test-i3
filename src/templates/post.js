import React from "react"

const PostTemplate = ({data: {post}}) => (
  <div>
    <h1>{post.title}</h1>
    <div dangerouslySetInnerHTML={{__html: post.html}} />
  </div>
)

export default PostTemplate

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
    post: markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
      }
    }
  }
`