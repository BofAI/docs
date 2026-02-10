/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'x402 Payment Protocol',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'x402/index',
          label: 'Introduction',
        },
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'x402/getting-started/quickstart-for-sellers',
            {
              type: 'category',
              label: 'Quickstart for Buyers',
              collapsed: false,
              items: ['x402/getting-started/quickstart-for-human', 'x402/getting-started/quickstart-for-agent'],
            },
          ],
        },
        {
          type: 'category',
          label: 'Core Concepts',
          items: [
            'x402/core-concepts/http-402',
            'x402/core-concepts/client-server',
            'x402/core-concepts/facilitator',
            'x402/core-concepts/wallet',
            'x402/core-concepts/network-and-token-support',
          ],
        },
        {
          type: 'doc',
          id: 'x402/sdk-features',
          label: 'SDK Features',
        },
        {
          type: 'doc',
          id: 'x402/faq',
          label: 'FAQ',
        },
      ],
    },
    {
      type: 'category',
      label: 'ERC-8004 协议',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'ERC-8004/general',
          label: '简介',
        },

         {
          type: 'category',
          label: '核心概念',
          collapsed: false,
          items: [
            'ERC-8004/identity',
            'ERC-8004/reputation',
            'ERC-8004/validation',
            
          ],
        },

         {
          type: 'category',
          label: 'SDK 实现',
          items: [
            {
              type: 'doc',
              id: 'ERC-8004/AgentT/Intro',
              label: '简介',
            },
             {
              type: 'doc',
              id: 'ERC-8004/AgentT/SupportedNetworks',
              label: '支持的网络',
            },
             {
              type: 'doc',
              id: 'ERC-8004/AgentT/QuickStart',
              label: '快速开始',
            },
            {
              type: 'category',
              label: '使用指南',
              collapsed: false,
              items: ['ERC-8004/AgentT/Usage/Install', 'ERC-8004/AgentT/Usage/ConfigureAgents', 'ERC-8004/AgentT/Usage/RegistrationHTTP'],
            },
          ],
        },
      ],
    },
     {
      type: 'category',
      label: ' MCP & SKILLS',
      collapsed: false,
      items: [
            {
              type: 'doc',
              id: 'McpServer-Skills/Intro',
              label: '简介',
            },
            {
              type: 'category',
              label: 'MCP',
              collapsed: true,
              items: ['McpServer-Skills/MCP/Intro', 'McpServer-Skills/MCP/Features', 'McpServer-Skills/MCP/Installation','McpServer-Skills/MCP/Configuration','McpServer-Skills/MCP/API'],
            },
             {
              type: 'category',
              label: 'SKILLS',
              collapsed: true,
              items: ['McpServer-Skills/SKILLS/Intro', 'McpServer-Skills/SKILLS/UseSkills'],
            },
          ],
            
    },
    {
      type: 'category',
      label: 'Openclaw 扩展插件',
      collapsed: false,
      items: ['Openclaw-extension/Overview', 'Openclaw-extension/Setup-use'],
            
    },

  ],
}

module.exports = sidebars
