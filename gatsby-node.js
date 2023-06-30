exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      html: String!
    }
    type Frontmatter {
      title: String!
      authors: String!
      tags: [String]
      schema_fields: [String]!
      slug: String!
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
	      frontmatter {
	        title
	        slug
	      	tags
	      }
	    }
	}
}
  `)

  if (errors) {
    console.log(errors)
  }
  console.log('data is', data.datasets.nodes.length)

  data.datasets.nodes.forEach((dataset, index) => {
  	console.log(dataset.frontmatter)
    createPage({
      path: dataset.frontmatter.slug,
      component: require.resolve(`./src/templates/post.js`)
    })
  })
}

// const { createFilePath } = require(`gatsby-source-filesystem`)

// exports.onCreateNode = ({ node, getNode, actions }) => {
//   const { createNodeField } = actions
//   if (node.internal.type === `MarkdownRemark`) {
//     const slug = node.frontmatter.shortname
//     console.log(slug)
//     createNodeField({
//       node,
//       name: `slug`,
//       value: slug,
//     })
//   }
// }
// const path = require('path')
// const blogPostTemplate = path.resolve("./src/templates/post.js")

// exports.createPages = ({graphql, actions}) => {
//   const {createPage} = actions
//   return new Promise((resolve, reject) => {
//     resolve(
//       graphql(
//         `
//           {
//             posts: allMarkdownRemark() {
//               nodes {
//                 frontmatter {
//                   shortname
//                 }
//               }
//             }
//           }
//         `
//       ).then((result) => {
//         const posts = result.data.posts.nodes
//         posts.forEach((post) => {
//           createPage({
//             path: post.fields.slug,
//             component: blogPostTemplate,
//             context: {
//               slug: post.frontmatter.shortname,
//             },
//           })
//         })
//       })
//     )
//   })
// }