// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Active Table',
  tagline: 'Fully customisable editable table component',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'OvidijusParsiunas', // Usually your GitHub org/user name.
  projectName: 'active-table', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // TO-DO - enchich introduction with a section about the community e.g. twitter/sharing-examples
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/OvidijusParsiunas/active-table/tree/main/website',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
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

  // // table:
  // tableStyle
  // overflow
  // frameComponentsStyle

  // // content:
  // content
  // defaultText
  // isDefaultTextRemovable
  // cellStyle
  // isCellTextEditable
  // spellCheck

  // // header:
  // headerStyles
  // isHeaderTextEditable
  // allowDuplicateHeaders
  // displayHeaderIcons
  // headerIconStyle
  // stickyHeader
  // dataStartsAtHeader

  // // rows:
  // rowHoverStyle
  // stripedRows
  // rowDropdown
  // maxRows
  // displayAddNewRow

  // // columns:
  // isColumnResizable
  // columnResizerColors
  // columnDropdown
  // customColumnsSettings
  // maxColumns
  // preserveNarrowColumns
  // displayAddNewColumn
  // displayIndexColumn
  // Types
  // CellDropdown
  // ColumnDropdownSettings

  // // column type:
  // defaultColumnTypeName
  // availableDefaultColumnTypes
  // customColumnTypes
  // ColumnType
  // TextValidation
  // CustomTextProcessing
  // Sorting
  // IconSettings
  // Calendar
  // Checkbox
  // DEFAULT_COLUMN_TYPES

  // // pagination:
  // pagination
  // Types
  // RowsPerPageSelect
  // PaginationStyle
  // RowsPerPageOptionsStyle
  // PageButtonStyle
  // ActionButtonStyle
  // PaginationPositions
  // PaginationPosition
  // StatefulCSS
  // More examples

  // // methods:
  // getContent
  // getColumnsDetails
  // updateCell

  // // events:
  // onCellUpdate
  // onContentUpdate
  // onColumnsUpdate

  // // types:
  // DropdownDisplaySettings
  // CSSStyle
  // HoverableStyles
  // NoDimensionCSSStyle
  // ColumnDetails

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Active Table',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'Intro/getting-started',
          //   position: 'left',
          //   label: 'Intro',
          // },
          {
            type: 'doc',
            docId: 'API/introduction',
            position: 'left',
            label: 'Documentation',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/OvidijusParsiunas/active-table',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
