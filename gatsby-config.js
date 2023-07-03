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
        "name": "datasets",
        "path": "./src/index/_datasets"
      },
      __key: "datasets"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "tools",
        "path": "./src/index/_tools"
      },
      __key: "tools"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "guides",
        "path": "./src/index/_guides"
      },
      __key: "guides"
    },
  {
    resolve: `gatsby-transformer-remark`,
  },
  `gatsby-plugin-slug`,
  ]
};