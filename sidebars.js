/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'BANK OF AI',
      className: 'sidebar-icon sidebar-icon-bankofai',
      collapsed: false,
      items: [
        'BANK-OF-AI/Intro',
        'BANK-OF-AI/QuickStart',
        {
          type: 'link',
          label: 'Official Website',
          href: 'https://bankofai.io/',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/BofAI',
        },
      ],
    },
    {
      type: 'category',
      label: 'x402 Payment Protocol',
      className: 'sidebar-icon sidebar-icon-x402',
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
          collapsed: true,
          items: [
            'x402/getting-started/quickstart-for-sellers',
            {
              type: 'category',
              label: 'Quickstart for Buyers',
              collapsed: true,
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
            'x402/core-concepts/OfficialFacilitator',
            'x402/core-concepts/gateway',
            {
              type: 'category',
              label: 'API Catalog',
              collapsed: true,
              items: [
                'x402/api-catalog/index',
                'x402/api-catalog/get-started',
                'x402/api-catalog/list-your-service',
                'x402/api-catalog/reference',
              ],
            },
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
          type: 'category',
          label: 'x402 CLI',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'x402/cli/index',
              label: 'Overview',
            },
            'x402/cli/quickstart',
            'x402/cli/command-reference',
            'x402/cli/faq',
          ],
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
      label: 'SKILLS',
      className: 'sidebar-icon sidebar-icon-skills',
      collapsed: false,
      items: [
        'McpServer-Skills/SKILLS/Intro',
        'McpServer-Skills/SKILLS/QuickStart',
        'McpServer-Skills/SKILLS/BANKOFAISkill',
        'McpServer-Skills/SKILLS/Faq',
      ],
    },
    {
      type: 'category',
      label: 'Agent Wallet',
      className: 'sidebar-icon sidebar-icon-wallet',
      collapsed: true,
      items: [
        'Agent-Wallet/Intro',
        'Agent-Wallet/QuickStart',
        {
          type: 'category',
          label: 'Explore Further',
          collapsed: true,
          items: [
            'Agent-Wallet/Developer/CLI-Reference',
            'Agent-Wallet/Developer/SDK-Guide',
            'Agent-Wallet/Developer/SDK-Cookbook',
          ],
        },
        'Agent-Wallet/FAQ',
      ],
    },
    {
      type: 'category',
      label: 'LLM Service',
      className: 'sidebar-icon sidebar-icon-llm',
      collapsed: true,
      items: [
        { type: 'doc', id: 'llmservice/introduction', label: 'Introduction' },
        { type: 'doc', id: 'llmservice/quick-start', label: 'Quick Start' },
        { type: 'doc', id: 'llmservice/pricing-and-usage', label: 'Pricing and Usage' },
        {
          type: 'category',
          label: 'Models',
          collapsed: true,
          items: [
            {
              type: 'category',
              label: 'OpenAI (GPT)',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/gpt-5-6-sol', label: 'GPT-5.6 Sol' },
                { type: 'doc', id: 'llmservice/models/gpt-5-6-terra', label: 'GPT-5.6 Terra' },
                { type: 'doc', id: 'llmservice/models/gpt-5-6-luna', label: 'GPT-5.6 Luna' },
                { type: 'doc', id: 'llmservice/models/gpt-5-5', label: 'GPT-5.5' },
                { type: 'doc', id: 'llmservice/models/gpt-5-5-instant', label: 'GPT-5.5 Instant' },
                { type: 'doc', id: 'llmservice/models/gpt-5-4', label: 'GPT-5.4' },
                { type: 'doc', id: 'llmservice/models/gpt-5-4-pro', label: 'GPT-5.4 Pro' },
                { type: 'doc', id: 'llmservice/models/gpt-5-4-mini', label: 'GPT-5.4 Mini' },
                { type: 'doc', id: 'llmservice/models/gpt-5-4-nano', label: 'GPT-5.4 Nano' },
                { type: 'doc', id: 'llmservice/models/gpt-5-2', label: 'GPT-5.2' },
                { type: 'doc', id: 'llmservice/models/gpt-5-mini', label: 'GPT-5 Mini' },
                { type: 'doc', id: 'llmservice/models/gpt-5-nano', label: 'GPT-5 Nano' },
              ],
            },
            {
              type: 'category',
              label: 'Anthropic (Claude)',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/claude-sonnet-5', label: 'Claude Sonnet 5' },
                { type: 'doc', id: 'llmservice/models/claude-fable-5', label: 'Claude Fable 5' },
                { type: 'doc', id: 'llmservice/models/claude-opus-4-8', label: 'Claude Opus 4.8' },
                { type: 'doc', id: 'llmservice/models/claude-opus-4-7', label: 'Claude Opus 4.7' },
                { type: 'doc', id: 'llmservice/models/claude-opus-4-6', label: 'Claude Opus 4.6' },
                { type: 'doc', id: 'llmservice/models/claude-opus-4-5', label: 'Claude Opus 4.5' },
                { type: 'doc', id: 'llmservice/models/claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
                { type: 'doc', id: 'llmservice/models/claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
                { type: 'doc', id: 'llmservice/models/claude-haiku-4-5', label: 'Claude Haiku 4.5' },
              ],
            },
            {
              type: 'category',
              label: 'Google (Gemini)',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/gemini-3-6-flash', label: 'Gemini 3.6 Flash' },
                { type: 'doc', id: 'llmservice/models/gemini-3-5-flash', label: 'Gemini 3.5 Flash' },
                { type: 'doc', id: 'llmservice/models/gemini-3-5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
                { type: 'doc', id: 'llmservice/models/gemini-3-1-pro', label: 'Gemini 3.1 Pro' },
                { type: 'doc', id: 'llmservice/models/gemini-3-flash', label: 'Gemini 3 Flash' },
              ],
            },
            {
              type: 'category',
              label: 'DeepSeek',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/deepseek-v4-pro', label: 'DeepSeek V4 Pro' },
                { type: 'doc', id: 'llmservice/models/deepseek-v4-flash', label: 'DeepSeek V4 Flash' },
                { type: 'doc', id: 'llmservice/models/deepseek-v3.2', label: 'DeepSeek V3.2' },
              ],
            },
            {
              type: 'category',
              label: 'SpaceXAI (Grok)',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/grok-4.5', label: 'Grok 4.5' },
              ],
            },
            {
              type: 'category',
              label: 'Z.AI (GLM)',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/glm-5-2', label: 'GLM-5.2' },
                { type: 'doc', id: 'llmservice/models/glm-5-1', label: 'GLM-5.1' },
              ],
            },
            {
              type: 'category',
              label: 'Moonshot AI (Kimi)',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/kimi-k3', label: 'Kimi K3' },
                { type: 'doc', id: 'llmservice/models/kimi-k2.6', label: 'Kimi K2.6' },
                { type: 'doc', id: 'llmservice/models/kimi-k2.5', label: 'Kimi K2.5' },
              ],
            },
            {
              type: 'category',
              label: 'Qwen',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/qwen3.6-27b', label: 'Qwen3.6-27B' },
              ],
            },
            {
              type: 'category',
              label: 'MiniMax',
              collapsed: true,
              items: [
                { type: 'doc', id: 'llmservice/models/minimax-m3', label: 'MiniMax M3' },
                { type: 'doc', id: 'llmservice/models/minimax-m2.7', label: 'MiniMax M2.7' },
              ],
            },
          ],
        },
        { type: 'doc', id: 'llmservice/memory', label: 'Memory' },
        {
          type: 'category',
          label: 'OpenClaw',
          collapsed: true,
          items: ['llmservice/openclaw/integration-guide', 'llmservice/openclaw/one-click-script-tutorial'],
        },
        {
          type: 'category',
          label: 'Claude Code',
          collapsed: true,
          items: ['llmservice/Claude-Code/claudecode-bankofai-api-configuration-guide'],
        },
        {
          type: 'category',
          label: 'API',
          collapsed: true,
          items: ['llmservice/api/API'],
        },
      ],
    },
    {
      type: 'category',
      label: 'MCP Server',
      className: 'sidebar-icon sidebar-icon-mcp',
      collapsed: true,
      items: [
        'McpServer-Skills/MCP/Intro',
        {
          type: 'category',
          label: 'TRON MCP Server',
          collapsed: true,
          items: [
            'McpServer-Skills/MCP/TRONMCPServer/Intro',
            'McpServer-Skills/MCP/TRONMCPServer/QuickStart',
            'McpServer-Skills/MCP/TRONMCPServer/OfficialServerAccess',
            'McpServer-Skills/MCP/TRONMCPServer/LocalPrivatizedDeployment',
            'McpServer-Skills/MCP/TRONMCPServer/ToolList',
            'McpServer-Skills/MCP/TRONMCPServer/FAQ',
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
      label: '8004 Protocol',
      className: 'sidebar-icon sidebar-icon-8004',
      collapsed: true,
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
          collapsed: true,
          items: ['8004/Usage/Install', '8004/Usage/ConfigureAgents', '8004/Usage/RegistrationHTTP'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Openclaw Extension',
      className: 'sidebar-icon sidebar-icon-openclaw',
      collapsed: true,
      items: ['Openclaw-extension/Intro', 'Openclaw-extension/QuickStart', 'Openclaw-extension/FAQ'],
    },
  ],
}

module.exports = sidebars
