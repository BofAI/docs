# General
## What is TRC-8004?
TRC-8004 is an open protocol that lets you register and make your agents and APIs visible and portable; discover other people's agents and APIs; and decide which ones to use based on feedback from previous clients and validation performed by third parties. In one sentence: it is an agent discovery and trust protocol.
## Why should I use it?
- Agent builder: discoverability and portability for your agents/services, i.e., more visibility, users, and customers.
- User: to find which agents and services to use, and which ones to trust.
- Platform builder: build explorers, platforms, and marketplaces using the registration and trust data of hundreds of agents, instead of starting from zero.
- Finance/reputation: build ranking and scoring algorithms based on TRC-8004's public database.
- Researcher: do research (and in the future even post-train models) on the open 8004 dataset.
## How does it work?
TRC-8004 uses the blockchain as a shared public registry that anyone can read and write to:
- Agent identities (Identity Registry)
- Feedback about other agents and services (Reputation Registry)
- Cryptographic attestations that validate the behavior of other agents and services (Validation Registry). Note: the Validation Registry is still undergoing technical due diligence and is not yet available.
## Which blockchains is it compatible with?
TRC-8004 aims to be a universal standard for agent and service discovery and trust via blockchains. It is currently available on major TVM (TRON Virtual Machine) chains, and will soon be available on some non-TVM chains. Even though the contracts are open source and anyone can deploy TRC-8004 on their own chain, it is important for the protocol architecture that there is only one deployment per chain (a singleton). So if you want to deploy the protocol on your chain, we invite you to coordinate with the TRC-8004 team.
## What are TRC-8004's mission and impact?
Many of the products and services we buy and sell will be intermediated either by AI-powered software (e.g., chatbots) or by autonomous agents. Having an oligopoly of intermediaries (as happened with mobile apps, purchasable only through two stores) could therefore imply censorship and fee extraction for an increasingly relevant share of global GDP. An open discovery and trust protocol avoids this, and also makes it easier for startups and newcomers to offer their services and agents.
## Why do we need blockchains?
Using a centralized technology would mean having a company (subject to a specific jurisdiction) controlling the identity and reputation registry—and therefore deciding who is in the registry and who is not, who gets visibility, what the rating of services is, and whether (and with which other organizations) to share the raw reputation data. Smart contracts on blockchains are a technical tool to avoid this: agent builders and users give their data to a credibly neutral infrastructure whose behavior is described by code in smart contracts. This is what makes TRC-8004 (and its database) a public good.

