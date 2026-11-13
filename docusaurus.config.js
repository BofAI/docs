import math from 'remark-math'
import katex from 'rehype-katex'
import { themes } from 'prism-react-renderer'
import ssrTemplate from './scripts/ssr-template.mjs'
require('dotenv').config()

export default {
  title: 'BANK OF AI | Developer Guide',
  tagline: 'HTTP 402 Payment Protocol for TRON',
  url: 'https://docs.bankofai.io',
  baseUrl: '/',
  trailingSlash: true,
  ssrTemplate,
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
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
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
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['solidity', 'python', 'bash'],
    },
    navbar: {
      title: '',
      logo: {
        alt: 'BANK OF AI',
        src: 'img/logo.png', // 浅色模式
        srcDark: 'img/logo_dark.png', // 深色模式
        href: '/BANK-OF-AI/Intro/',
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
  // Load the official components explicitly: preset-classic also installs SVGR,
  // whose unused deepmerge dependency is affected by GHSA-gcqx-w48m-w2h4.
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        routeBasePath: '/',
        exclude: ['**/AGENTS.md', '**/_*.{js,jsx,ts,tsx,md,mdx}', '**/_*/**', '**/*.test.*', '**/__tests__/**'],
        sidebarPath: require.resolve('./sidebars.js'),
        remarkPlugins: [math],
        rehypePlugins: [katex],
        includeCurrentVersion: true,
      },
    ],
    '@docusaurus/plugin-content-pages',
    ...(process.env.NODE_ENV === 'production'
      ? ['@docusaurus/plugin-sitemap']
      : ['@docusaurus/plugin-debug']),
    require.resolve('./docusaurus-plugin-global-style'),
    // 兼容旧链接：/McpServer-Skills/Intro/ 重定向到 Skills 简介、/x402/cli/ 重定向到 wallet-cli（自动覆盖各 locale）
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath) {
          if (existingPath.endsWith('/McpServer-Skills/SKILLS/Intro/') || existingPath.endsWith('/McpServer-Skills/SKILLS/Intro')) {
            return [existingPath.replace('/McpServer-Skills/SKILLS/Intro', '/McpServer-Skills/Intro')]
          }
          // 旧 x402 CLI 页面（docs/x402/cli/）已迁到 wallet-cli，保留旧地址
          const walletCli = existingPath.match(/^(\/zh-Hans)?\/wallet-cli\/((?:quickstart|command-reference|faq)\/)?$/)
          if (walletCli) {
            return [`${walletCli[1] || ''}/x402/cli/${walletCli[2] || ''}`]
          }
          if (existingPath === '/llmservice/image-models/pricing/') {
            return ['/llmservice/image-models/grok-imagine-image-2-0/']
          }
          if (existingPath === '/zh-Hans/llmservice/image-models/pricing/') {
            return ['/zh-Hans/llmservice/image-models/grok-imagine-image-2-0/']
          }
          return undefined
        },
      },
    ],
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
  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss: [
          require.resolve('./src/css/sidebar.css'),
          require.resolve('katex/dist/katex.min.css'),
        ],
      },
    ],
    // Offline full-text search. Index all three docs instances in both locales.
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'zh'],
        indexBlog: false,
        docsRouteBasePath: ['/', '/changelog', '/devnotes'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        searchResultContextMaxLength: 80,
        explicitSearchResultPath: true,
      },
    ],
  ],
}
