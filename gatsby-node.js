exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter!
    }
    type Frontmatter {
      title: String!
      authors: String
      tags: [String]
      schema_fields: [String]
      slug: String!
      location: String
    }
  `
  createTypes(typeDefs)
}


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data, errors } = await graphql(`
  {
	  datasets: allMarkdownRemark {
	    nodes {
	    	html
	      frontmatter {
	        title
	        slug
	      	tags
	      	authors
	      	location
	      }
	    }
	}
}
  `)

  if (errors) {
    console.log(errors)
  }
  data.datasets.nodes.forEach((dataset, index) => {
    createPage({
      path: dataset.frontmatter.slug,
      component: require.resolve(`./src/templates/post.js`)
    })
  })
}
