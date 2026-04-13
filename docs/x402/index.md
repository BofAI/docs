---
title: 'Welcome to x402'
slug: /
description: >-
  This guide introduces the x402 open payment standard on blockchain and helps you start building or integrating x402-powered services.
---

# Welcome to x402

x402 is an open blockchain payment standard built on the HTTP `402 Payment Required` status code. It enables web services to charge for APIs or content through a “pay-before-response” mechanism — without relying on traditional account systems or session management.  

x402 currently supports the **TRON** and **BSC** networks, with plans to expand to a broader multi-chain ecosystem in the future.

**Interested in contributing to the documentation?**  
Feel free to submit a PR to the [GitHub repository](https://github.com/BofAI/docs). Our only principle is to maintain neutrality — aside from essential resource links, please avoid promotional or branded content.

**Looking for runnable examples?**  
Visit the [x402-demo repository](https://github.com/BofAI/x402-demo) for a complete, production-ready sample project.

---

## Why Use x402?

x402 addresses the core pain points of existing payment systems:

- **High fees and complex workflows** in traditional credit card and fiat payment channels  
- **Poor support for machine-to-machine (M2M) payments**, such as autonomous AI agent transactions  
- **Lack of efficient micro-payment infrastructure**, making usage-based monetization difficult  
- Leveraging blockchain’s **fast and low-cost transaction capabilities**

---

## Who Is x402 For?

- **Sellers:** Service providers who want to monetize APIs or content. With minimal configuration, x402 enables direct, programmatic payments from clients.
- **Buyers:** Developers and AI agents who want to access paid services without registration flows or manual intervention.

Buyers and sellers interact directly through HTTP requests, while payments are executed transparently and automatically on-chain by the protocol.

---

## What Can You Build?

x402 supports a wide range of use cases:

- **Pay-per-request APIs**
- **AI agents capable of autonomously paying for APIs**
- **Digital content paywalls**
- **Microservices monetized via microtransactions**
- **API aggregation services that do not resell underlying capabilities**

---

## How It Works

At a high level, the workflow is straightforward:

1. **Request Initiated:** The buyer requests a protected resource from the server.
2. **Payment Required:** If payment is required, the server returns a `402 Payment Required` response along with payment instructions.
3. **Payment Submitted:** The buyer generates and submits a signed payment payload.
4. **Verification & Settlement:** The server calls the x402 Facilitator’s `/verify` and `/settle` endpoints to validate and settle the payment.
5. **Resource Delivered:** Once verification succeeds, the server delivers the requested resource.

To explore further:

- [Client / Server](./core-concepts/client-server)
- [Facilitator](./core-concepts/facilitator)
- [HTTP 402](./core-concepts/http-402)

Our goal is to build a low-barrier, permissionless, developer-friendly programmable commerce layer on blockchain.

---

## Network Support

x402 currently supports the following networks:

- **TRON Mainnet** (`tron:mainnet`)
- **TRON Shasta Testnet** (`tron:shasta`)
- **TRON Nile Testnet** (`tron:nile`)
- **BSC Mainnet** (`eip155:56`)
- **BSC Testnet** (`eip155:97`)

---

## Quick Start

Ready to build? Start here:

- [Quickstart for Sellers](./getting-started/quickstart-for-sellers)
- [Quickstart for Agents](./getting-started/quickstart-for-agent)
- [Http 402](./core-concepts/http-402)
