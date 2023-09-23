// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Active Table',
  tagline: 'Fully customisable editable table component',
  url: 'https://activetable.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',

  // GitHub pages deployment config
  organizationName: 'OvidijusParsiunas', // GitHub org/user name
  projectName: 'active-table', // repo name

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // TO-DO - enrich introduction with a section about the community e.g. twitter/sharing-examples
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Used for the "edit this page" links.
          editUrl: 'https://github.com/OvidijusParsiunas/active-table/tree/main/website',
          sidebarPath: 'sidebars.js',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    () => ({
      name: 'custom-webpack-config',
      configureWebpack: () => {
        return {
          module: {
            rules: [
              {
                test: /\.m?js/,
                resolve: {
                  fullySpecified: false,
                },
              },
            ],
          },
        };
      },
    }),
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'description', content: 'Framework agnostic table component for editable data experience'},
        {name: 'keywords', content: 'table, grid, edit, component, javascript'},
        {name: 'og:title', content: 'Active Table'},
        {name: 'og:description', content: 'Framework agnostic table component for editable data experience'},
        {name: 'og:url', content: 'https://activetable.io/'},
        {
          name: 'og:image',
          content:
            'https://raw.githubusercontent.com/OvidijusParsiunas/active-table/main/assets/social-media/social-media.png',
        },
        {name: 'twitter:title', content: 'Active Table'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:site', content: '@activetable'},
        {name: 'twitter:description', content: 'Framework agnostic table component for editable data experience'},
        {
          name: 'twitter:image',
          content:
            'https://raw.githubusercontent.com/OvidijusParsiunas/active-table/main/assets/social-media/social-media.png',
        },
      ],
      navbar: {
        title: 'Active Table',
        items: [
          {
            type: 'docSidebar',
            position: 'left',
            label: 'Docs',
            sidebarId: 'docs',
          },
          {
            type: 'docSidebar',
            position: 'left',
            label: 'Examples',
            sidebarId: 'examples',
          },
          {
            href: 'https://github.com/OvidijusParsiunas/active-table',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'CQP32TX5E8',
        apiKey: 'd77116a11a6f89f37f0fc41ef92ad295',
        indexName: 'activetable',
      },
    }),
  // this is used to prevent the website font changing after it is rendered
  // https://github.com/OvidijusParsiunas/active-table/issues/9
  // the strategy is to preload the font-faces and their sources, additionally each one will need a 'preload' and 'stylesheet'
  // rel attribute as 'preload' by itself does not apply the stylesheet
  headTags: [
    // The following is used to prevent the component styling from rendering too late
    // https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2 appears to be the only font used immediately
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
        as: 'font',
        type: 'font/woff2',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
        as: 'font',
        type: 'font/woff2',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
        as: 'style',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
        as: 'style',
      },
    },
    // The following is used to prevent site's 'inter_webfont' font-family from rendering too late
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/inter.woff2',
        as: 'font',
        type: 'font/woff2',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: '/fonts/inter.woff2',
        as: 'font',
        type: 'font/woff2',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/inter-webfont.css',
        as: 'style',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: '/fonts/inter-webfont.css',
        as: 'style',
      },
    },
  ],
};

module.exports = config;
