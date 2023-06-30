/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `gatsby-test-i3`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [
    "gatsby-plugin-mdx", 
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "index",
        "path": "./src/index/_datasets"
      },
      __key: "index"
    },
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [`remark-frontmatter`]
    }
  },
  `gatsby-plugin-slug`,
  ]
};