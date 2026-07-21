---
title: 'Changelogs'
description: 'Product updates and announcements for BANK OF AI — all products, newest first.'
---

# Changelogs

Product updates and announcements for BANK OF AI.

<div className="changelog-entry">
<div className="changelog-date">Jul 21, 2026</div>
<div className="changelog-body">

### Docs

<div className="changelog-tags"><span className="changelog-tag">Product Updates</span><span className="changelog-tag">Docs</span><span className="changelog-tag">x402</span></div>

- **TRON network IDs now use CAIP-2 format** across the x402 docs — `tron:0x2b6653dc` (Mainnet), `tron:0xcd8690dc` (Nile), `tron:0x94a9059e` (Shasta). In application code, prefer the SDK constants `TRON_MAINNET` / `TRON_NILE` / `TRON_SHASTA` over hard-coded hex strings. [Network & Token Support](../x402/core-concepts/network-and-token-support/)
- **`auth-capture` scheme removed** — x402 now documents four payment schemes: `exact`, `upto`, `batch-settlement`, and `exact_gasfree` (TRON). [SDK Features](../x402/sdk-features/)
- **x402 quickstarts simplified** for both buyers and sellers.
- **New model**: Kimi K3 pricing docs added to LLM Service.
- **Rewritten BANK OF AI introduction** — restructured around what your AI actually gains, with a capability overview and an end-to-end execution example.
- **New section — Best Practices**: hands-on walkthroughs and habits worth keeping, alongside the product docs. [Read the first one](../devnotes/first-onchain-swap/)

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jul 17, 2026</div>
<div className="changelog-body">

### Docs

<div className="changelog-tags"><span className="changelog-tag">Product Updates</span><span className="changelog-tag">Docs</span></div>

- **New x402 CLI documentation set**: overview, quick start, full command reference, and FAQ — in English and 中文. [Read the docs](../x402/cli/)
- **Docs site refresh**: offline full-text search (⌘K), a Changelogs tab, section icons, and a cleaner sidebar layout.

</div>
</div>

<div className="changelog-entry">
<div className="changelog-date">Jul 15, 2026</div>
<div className="changelog-body">

### x402 CLI

<div className="changelog-tags"><span className="changelog-tag">New Release</span><span className="changelog-tag">x402</span><span className="changelog-tag">CLI</span></div>

- **`v1.0.0` — first stable release** of `@bankofai/x402-cli`, a TypeScript command-line client for x402 payments: `pay` any x402-protected URL, `serve` a local paywall endpoint, `roundtrip` for end-to-end smoke tests, plus `gateway` and `catalog` for provider files and the service catalog.
- Built on the published `@bankofai/x402-core` / `x402-evm` / `x402-tron` SDK 1.0 packages; `scheme=exact` with Permit2.
- Networks: TRON (`tron:mainnet` / `tron:nile` / `tron:shasta`) and BSC (`eip155:56` / `eip155:97`). [Quick Start](../x402/cli/quickstart/)

</div>
</div>
