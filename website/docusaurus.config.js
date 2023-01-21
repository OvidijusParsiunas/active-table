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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/OvidijusParsiunas/active-table',
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

  // Introduction - this should be the homepage
  // Installation
  // API
  // // table:
  // // // tableStyle: TableStyle;
  // // content:
  // // // content: TableContent;
  // // // spellCheck: boolean;
  // // // updateCellText: DynamicCellTextUpdateT;
  // // header:
  // // // stickyHeader: boolean;
  // // // dataBeginsAtHeader: boolean;
  // // // duplicateHeadersAllowed: boolean;
  // // // areIconsDisplayedInHeaders: boolean;
  // // rows:
  // // // rowHover: RowHover | null;
  // // // stripedRows: StripedRowsType | boolean | null;
  // // // rowDropdownSettings: RowDropdownSettings;
  // // // maxRows?: number;
  // // columns:
  // // // defaultColumnsSettings: ColumnsSettingsDefault;
  // // // customColumnsSettings: CustomColumnsSettings;
  // // // preserveNarrowColumns: boolean;
  // // // maxColumns?: number;
  // // // columnResizerStyle: UserSetColumnSizerStyle;
  // // // columnDropdownDisplaySettings: DropdownDisplaySettings;
  // // // overwriteColumnWidths: ColumnsWidths | null;
  // // events:
  // // // onCellUpdate: OnCellUpdate;
  // // // onColumnUpdate: OnColumnUpdate;
  // // // onTableUpdate: OnTableUpdate;
  // // // onColumnWidthsUpdate: OnColumnWidthsUpdate;
  // // overflow: // could be in with table
  // // // overflow: Overflow | null;
  // // pagination:
  // // // pagination: Pagination | null;
  // // misc:
  // // // auxiliaryTableContent: AuxiliaryTableContent;

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Active Table',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'Intro/getting-started',
            position: 'left',
            label: 'Intro',
          },
          {
            type: 'doc',
            docId: 'API/how-to-use',
            position: 'left',
            label: 'API',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/OvidijusParsiunas/active-table',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'API',
                to: '/docs/API/how-to-use',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
