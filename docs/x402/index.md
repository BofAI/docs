---
title: 'Welcome to x402-tron'
slug: /
description: >-
  This guide will help you understand x402-tron, the open payment standard for TRON blockchain, and help
  you get started building or integrating services with x402-tron.
---

x402-tron is the TRON implementation of the x402 open payment standard that enables services to charge for access to their APIs and content directly over HTTP. It is built around the HTTP `402 Payment Required` status code and allows clients to programmatically pay for resources without accounts, sessions, or credential management.

With x402-tron, any web service can require payment before serving a response, using TRON blockchain payments for speed, privacy, and efficiency.

**Want to contribute to our docs?** [The GitHub repo is open to PRs!](https://github.com/bankofai/x402-tron-docs) Our only ask is that you keep these docs as a neutral resource, with no branded content other than linking out to other resources where appropriate.

**Looking for working examples?** Check out the [x402-tron-demo repository](https://github.com/bankofai/x402-tron-demo) for complete, runnable examples.

### Why Use x402-tron?

x402-tron addresses key limitations of existing payment systems:

- **High fees and friction** with traditional credit cards and fiat payment processors
- **Incompatibility with machine-to-machine payments**, such as AI agents
- **Lack of support for micropayments**, making it difficult to monetize usage-based services
- **Fast and low-cost transactions** on TRON blockchain

### Who is x402-tron for?

- **Sellers:** Service providers who want to monetize their APIs or content. x402-tron enables direct, programmatic payments from clients with minimal setup.
- **Buyers:** Human developers and AI agents seeking to access paid services without accounts or manual payment flows.

Both sellers and buyers interact directly through HTTP requests, with payment handled transparently through the protocol on TRON blockchain.

### What Can You Build?

x402-tron enables a range of use cases, including:

- API services paid per request
- AI agents that autonomously pay for API access
- Paywalls for digital content
- Microservices and tooling monetized via microtransactions
- Proxy services that aggregate and resell API capabilities

### How Does It Work?

At a high level, the flow is simple:

1. A buyer requests a resource from a server.
2. If payment is required, the server responds with `402 Payment Required`, including payment instructions.
3. The buyer prepares and submits a payment payload (signed using TIP-712).
4. The server verifies and settles the payment using an x402 facilitator's /verify and /settle endpoints.
5. If payment is valid, the server provides the requested resource.

For more detail, see:

- [Client / Server](./core-concepts/client-server.md)
- [Facilitator](./core-concepts/facilitator.md)
- [HTTP 402](./core-concepts/http-402.md)

The goal is to make programmatic commerce accessible, permissionless, and developer-friendly on TRON blockchain.

### Supported Networks

x402-tron supports the following TRON networks:

- **TRON Mainnet** (`tron:mainnet`)
- **TRON Shasta Testnet** (`tron:shasta`)
- **TRON Nile Testnet** (`tron:nile`)

### Get Started

Ready to build? Start here:

- [Quickstart for Sellers](./getting-started/quickstart-for-sellers.md)
- [Quickstart for Agent](./getting-started/quickstart-for-agent.md)
- [Explore Core Concepts](./core-concepts/http-402.md)
