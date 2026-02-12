const math = require('remark-math')
const katex = require('rehype-katex')
require('dotenv').config()

module.exports = {
  title: 'BANK OF AI | Developer Guide',
  tagline: 'HTTP 402 Payment Protocol for TRON',
  url: 'https://docs.x402-tron.org/',
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
        // 多语言选项
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/bankofai',
          position: 'right',
          className: 'persistent',
        },
        {
          label: 'TRON',
          href: 'https://tron.network',
          position: 'right',
          className: 'persistent',
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
    // [
    //   '@docusaurus/plugin-client-redirects',
    //   {
    //     redirects: [
    //       {
    //         from: '/overview',
    //         to: '/',
    //       },
    //     ],
    //   },
    // ],
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
