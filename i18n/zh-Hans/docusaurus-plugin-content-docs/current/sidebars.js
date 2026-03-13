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
          label: '简介',
        },
        {
          type: 'category',
          label: '快速入门',
          items: [
            'x402/getting-started/quickstart-for-sellers',
            {
              type: 'category',
              label: '买家快速入门',
              collapsed: false,
              items: ['x402/getting-started/quickstart-for-human', 'x402/getting-started/quickstart-for-agent'],
            },
          ],
        },
        {
          type: 'category',
          label: '核心概念',
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
          label: 'SDK 功能',
        },
        {
          type: 'doc',
          id: 'x402/faq',
          label: '常见问题',
        },
      ],
    },
    {
      type: 'category',
      label: '8004 Protocol',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: '8004/general',
          label: '简介',
        },
        {
          type: 'doc',
          id: '8004/contract',
          label: '合约',
        },
        {
          type: 'doc',
          id: '8004/QuickStart',
          label: '快速开始',
        },
        {
          type: 'doc',
          id: '8004/SupportedNetworks',
          label: '支持的网络',
        },
        {
          type: 'category',
          label: 'Usage',
          collapsed: false,
          items: ['8004/Usage/Install', '8004/Usage/ConfigureAgents', '8004/Usage/RegistrationHTTP'],
        },
      ],
    },

    {
      type: 'category',
      label: 'MCP Server & SKILLS',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'McpServer-Skills/Intro',
          label: '简介',
        },
        {
          type: 'category',
          label: 'MCP Server',
          collapsed: false,
          items: [
            'McpServer-Skills/MCP/Intro',
            {
              type: 'category',
              label: 'TRON MCP Server',
              collapsed: true,
              items: [
                
                'McpServer-Skills/MCP/TRONMCPServer/Intro',
                'McpServer-Skills/MCP/TRONMCPServer/OfficialServerAccess',
                'McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment',
                'McpServer-Skills/MCP/TRONMCPServer/API',
              ],
            },
            {
              type: 'category',
              label: 'SUN MCP Server',
              collapsed: true,
              items: [
                'McpServer-Skills/MCP/SUNMCPServer/Intro',
                'McpServer-Skills/MCP/SUNMCPServer/OfficialServerAccess',
                'McpServer-Skills/MCP/SUNMCPServer/LocalPrivatizedDeployment',
                'McpServer-Skills/MCP/SUNMCPServer/API',
              ],
            },
            {
              type: 'category',
              label: 'BSC MCP Server',
              collapsed: true,
              items: [
                'McpServer-Skills/MCP/BSCMCPServer/Intro',
                'McpServer-Skills/MCP/BSCMCPServer/Features',
                'McpServer-Skills/MCP/BSCMCPServer/Installation',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'SKILLS',
          collapsed: false,
          items: [
            'McpServer-Skills/SKILLS/Intro',
            'McpServer-Skills/SKILLS/BANKOFAISkills',
            'McpServer-Skills/SKILLS/Faq',
          ],
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
