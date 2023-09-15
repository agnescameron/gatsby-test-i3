/* gatsby-node.js */
const { GraphQLJSONObject } = require(`graphql-type-json`)
const striptags = require(`striptags`)
const lunr = require(`lunr`)

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter!
    }
    type Frontmatter {
      title: String!
      authors: String
      description: String
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
	    	id
	      frontmatter {
	      	slug
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
      component: require.resolve(`./src/templates/post.js`),
      context: {
      	id: dataset.id
    	}
    })
  })
}


exports.createResolvers =  async ({ cache, createResolvers }) => {
  console.log('creating resolvers')
  createResolvers({
    Query: {
      LunrIndex: {
        type: GraphQLJSONObject,
        resolve: async (source, args, context, info) => {
          const dataNodes = await context.nodeModel.findAll({
            type: `MarkdownRemark`,
          })
          const type = info.schema.getType(`MarkdownRemark`)
          return createIndex(dataNodes, type, cache)
        },
      },
    },
  })
}


/* gatsby-node.js */
const createIndex = async (dataNodes, type, cache) => {
  const cacheKey = `IndexLunr`
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }
  const documents = []
  const store = {}
  // Iterate over all posts 
  for (const node of dataNodes.entries) {
    console.log('node fields', node.fields)
    const {slug} = node.fields
    console.log('slug is', slug)
    const title = node.frontmatter.title
    const description = node.frontmatter.description
    let html = await Promise.all([
      type.getFields().html.resolve(node),
    ])
    html = html[0]

    documents.push({
      slug: node.fields.slug,
      title: node.frontmatter.title,
      description: node.frontmatter.description,
      content: striptags(html),
    })
    store[slug] = {
      title,
    }
  }
  const index = lunr(function() {
    this.ref(`slug`)
    this.field(`title`)
    this.field(`description`)
    this.field(`content`)
    for (const doc of documents) {
      this.add(doc)
    }
  })
  const json = { index: index.toJSON(), store }
  await cache.set(cacheKey, json)
  return json
}