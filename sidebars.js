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
      label: '8004 Protocol',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: '8004/general',
          label: 'Introduction',
        },
        {
          type: 'doc',
          id: '8004/contract',
        },
        {
          type: 'doc',
          id: '8004/QuickStart',
        },
        {
          type: 'doc',
          id: '8004/SupportedNetworks',
        },
        {
          type: 'category',
          label: 'Usage',
          collapsed: false,
          items: [
            '8004/Usage/Install',
            '8004/Usage/ConfigureAgents',
            '8004/Usage/RegistrationHTTP'
          ],
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
          label: 'Introduction',
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
            'McpServer-Skills/SKILLS/BANKOFAISkill',
            'McpServer-Skills/SKILLS/Faq',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Openclaw Extension',
      collapsed: false,
      items: [
        'Openclaw-extension/Overview',
        'Openclaw-extension/Setup-use'
      ],
    },

    {
      type: 'category',
      label: 'LLM Service',
      collapsed: false,
      items: [
        { type: 'doc', id: 'llm-service/introduction', label: 'Introduction' },
        { type: 'doc', id: 'llm-service/quick-start', label: 'Quick Start' },
        { type: 'doc', id: 'llm-service/pricing-and-usage', label: 'Pricing and Usage' },
        {
          type: 'category',
          label: 'Models',
          collapsed: true,
          items: [
            'llm-service/models/chatgpt-5-2',
            'llm-service/models/chatgpt-5-mini',
            'llm-service/models/chatgpt-5-nano',
            'llm-service/models/claude-haiku-4-5',
            'llm-service/models/claude-opus-4-5',
            'llm-service/models/claude-opus-4-6',
            'llm-service/models/claude-sonnet-4-5',
            'llm-service/models/claude-sonnet-4-6',
            'llm-service/models/gemini-3-1-pro',
            'llm-service/models/gemini-3-flash',
            'llm-service/models/glm-5',
            'llm-service/models/kimi-k2.5',
            'llm-service/models/minimax-m2.5',
          ],
        },
        {
          type: 'category',
          label: 'OpenClaw',
          collapsed: true,
          items: [
            'llm-service/openclaw/integration-guide',
            'llm-service/openclaw/one-click-script-tutorial',
          ],
        },
        {
          type: 'category',
          label: 'API',
          collapsed: true,
          items: [
            'llm-service/api/API',
          ],
        },
      ],
    },
  ],
}

module.exports = sidebars
