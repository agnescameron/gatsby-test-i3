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
      authors: [String]
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
	  pages: allMarkdownRemark {
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
  data.pages.nodes.forEach((page, index) => {
    createPage({
      path: page.frontmatter.slug,
      component: require.resolve(`./src/templates/post.js`),
      context: {
      	id: page.id
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
            query: {
              filter: { fileAbsolutePath: {regex: "/_datasets/"  } },
            },
          })
          const type = info.schema.getType(`MarkdownRemark`)
          return createIndex(dataNodes, type, cache, 'IndexLunr')
        },
      },
      LunrIndexTools: {
        type: GraphQLJSONObject,
        resolve: async (source, args, context, info) => {
          const toolNodes = await context.nodeModel.findAll({
            type: `MarkdownRemark`,
            query: {
              filter: { fileAbsolutePath: {regex: "/_tools/"  } },
            },
          })
          const type = info.schema.getType(`MarkdownRemark`)
          return createIndex(toolNodes, type, cache, 'IndexTools')
        },
      },   
      LunrIndexTags: {
        type: GraphQLJSONObject,
        resolve: async (source, args, context, info) => {
          const tagNodes = await context.nodeModel.findAll({
            type: `MarkdownRemark`,
            query: {
              filter: { fileAbsolutePath: {regex: "/_datasets/"  } },
            },
          })
          const type = info.schema.getType(`MarkdownRemark`)
          return createTagIndex(tagNodes, type, cache, 'IndexTags')
        },
      },   
    },
  })
}


/* gatsby-node.js */
const createIndex = async (dataNodes, type, cache, cacheKey) => {
  // const cacheKey = `IndexLunr`
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }
  const documents = []
  const store = {}
  // Iterate over all posts 
  for (const node of dataNodes.entries) {
    const {slug} = node.fields
    const title = node.frontmatter.title
    const description = node.frontmatter.description
    const tags = node.frontmatter.tags
    // console.log('frontmatter is', node.frontmatter)
    let html = await Promise.all([
      type.getFields().html.resolve(node),
    ])
    html = html[0]

    documents.push({
      slug: node.fields.slug,
      title: node.frontmatter.title,
      authors: node.frontmatter.authors,
      description: node.frontmatter.description,
      tags: node.frontmatter.tags,
      content: striptags(html),
    })
    store[slug] = {
      title,
    }
  }
  const mainIndex = lunr(function() {
    this.ref(`slug`)
    this.field(`title`)
    this.field(`authors`)
    this.field(`description`)
    this.field(`content`)
    this.field(`tags`)
    for (const doc of documents) {
      this.add(doc)
    }
  })


  const json = { index: mainIndex.toJSON(), store }
  await cache.set(cacheKey, json)
  return json
}


const createTagIndex = async (dataNodes, type, cache, cacheKey) => {
  let allTags = [];
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }
  const store = {}

  dataNodes.entries.forEach(entry => allTags = allTags.concat(entry.frontmatter.tags));
  const tagJson = [...new Set(allTags)].map((tag, index) => ({tag: tag, _id: index}));

    const tagIndex = lunr(function() {
    this.field('tag');
    this.ref('_id');
    tagJson.forEach( tag => {
      this.add(tag);
    }, this)
  })

  const json = { index: tagIndex.toJSON(), store }
  await cache.set(cacheKey, json)
  return json
}