// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Wrought',
  icon: {
    favicon: './src/assets/favicon.png',
    touchicon: './src/assets/favicon.png'
  },
  siteUrl: ('https://wrought.cc'),
  settings: {
    web: false,
    twitter: false,
    github: false,
    nav: {
      links: [
        { path: '/spec/', title: 'Docs' }
      ]
    },
    sidebar: [
      {
        name: 'spec',
        sections: [
          {
            title: 'Spec',
            items: [
              '/spec/',
              '/spec/syntax/',
              '/spec/semantics/',
              '/spec/wasm-output/',
            ]
          },
          {
            title: 'Other Info',
            items: [
              '/contributing/',
              '/getting-started/',
            ]
          }
        ]
      },
      {
        name: 'info',
        sections: [
          {
            title: 'Info',
            items: [
              '/contributing/',
              '/getting-started/',
            ]
          },
          {
            title: 'Spec',
            items: [
              '/spec/',
              '/spec/syntax/',
              '/spec/semantics/',
              '/spec/wasm-output/',
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        baseDir: './content',
        path: '**/*.md',
        typeName: 'MarkdownPage',
        remark: {
          externalLinksTarget: '_blank',
          externalLinksRel: ['noopener', 'noreferrer'],
          plugins: [
            // '@gridsome/remark-prismjs',
            'gridsome-remark-katex'
          ]
        }
      }
    },

    {
      use: 'gridsome-plugin-tailwindcss',
      options: {
        tailwindConfig: './tailwind.config.js',
        purgeConfig: {
          // Prevent purging of prism classes.
          whitelistPatternsChildren: [
            /token$/
          ]
        }
      }
    },

    {
      use: '@gridsome/plugin-sitemap',
      options: {}
    }

  ]
}
