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
      label: 'TRC-8004 Protocol',
      collapsed: false,
      items: ['TRC-8004/general', 'TRC-8004/identity', 'TRC-8004/reputation', 'TRC-8004/validation'],
    },
  ],
}

module.exports = sidebars
