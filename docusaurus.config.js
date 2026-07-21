const math = require('remark-math')
const katex = require('rehype-katex')
require('dotenv').config()

module.exports = {
  title: 'BANK OF AI | Developer Guide',
  tagline: 'HTTP 402 Payment Protocol for TRON',
  url: 'https://docs.bankofai.io',
  baseUrl: '/',
  trailingSlash: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-Hans': {
        label: '中文',
      },
    },
  },
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'ignore',
  favicon: 'img/favicon.ico',
  organizationName: 'open-aibank',
  projectName: 'x402-tron',
  scripts: [{ src: '/hideErrorBanner.js', async: false }],
  themeConfig: {
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
    image: 'img/logo.png',
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      additionalLanguages: ['solidity', 'python', 'bash'],
    },
    navbar: {
      title: '',
      logo: {
        alt: 'BANK OF AI',
        src: 'img/logo.png', // 浅色模式
        srcDark: 'img/logo_dark.png', // 深色模式
        href: '/',
        height: 36,
        width: 154,
      },
      items: [
        // 顶部左侧页签：Docs / Changelogs
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'devnotesSidebar',
          docsPluginId: 'devnotes',
          position: 'left',
          label: 'Best Practices',
        },
        {
          type: 'docSidebar',
          sidebarId: 'changelogSidebar',
          docsPluginId: 'changelog',
          position: 'left',
          label: 'Changelogs',
        },
        // 多语言选项
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
          includeCurrentVersion: true,
        },
        theme: {
          customCss: require.resolve('./src/css/sidebar.css'),
        },
        blog: false,
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  plugins: [
    require.resolve('./docusaurus-plugin-global-style'),
    // Changelog：独立 docs 实例，路径 /changelog，对应顶部 Changelogs 页签
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'changelog',
        path: 'changelog',
        routeBasePath: 'changelog',
        sidebarPath: require.resolve('./sidebarsChangelog.js'),
      },
    ],
    // Developer Notes：独立 docs 实例，路径 /devnotes，对应顶部 Developer Notes 页签
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'devnotes',
        path: 'devnotes',
        routeBasePath: 'devnotes',
        sidebarPath: require.resolve('./sidebarsDevnotes.js'),
      },
    ],
    // Offline full-text search (no Algolia account needed). Indexes both locales.
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'zh'],
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        searchResultContextMaxLength: 80,
        explicitSearchResultPath: true,
      },
    ],
    function webpackFallbackPlugin() {
      return {
        name: 'custom-webpack-fallback-plugin',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                url: require.resolve('url/'),
              },
            },
          }
        },
      }
    },
  ],
}
