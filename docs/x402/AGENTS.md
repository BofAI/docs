# Documentation Agent Instructions

## Package Identity

- Docusaurus documentation source for x402-tron
- MDX/Markdown files with `sidebars.js` as navigation configuration

## Directory Structure

- `docs/core-concepts/` — Protocol explanations (HTTP 402, client-server, facilitator, wallet, network support)
- `docs/getting-started/` — Quickstart guides for buyers and sellers (MD files with tabs)
- `docs/index.md` — Welcome/landing page
- `docs/faq.md` — Frequently asked questions
- `sidebars.js` — Docusaurus sidebar navigation configuration
- `docusaurus.config.js` — Main Docusaurus configuration
- `docs/sdk-features.md` - Feature list of Python and TypeScript SDKs

## Code-to-Doc Mapping

- Changes to `typescript/packages/` affect TypeScript SDK references
- Changes to `python/x402/` affect Python SDK references
- Changes to facilitator endpoints affect quickstart guides
- Changes to mechanisms affect core-concepts docs

## Style Guidelines

- Use Python for primary code examples (it's the most complete SDK)
- Include TypeScript examples where available
- Include error handling in all API examples
- Write for developers with 2-5 years experience
- Use Docusaurus MDX components (`<Tabs>`, `<TabItem>`) for multi-language code examples
- Import Tabs at top of files using them: `import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';`
- Show both success and error response examples for API endpoints
- Use real-world parameter values in examples (not foo/bar placeholders)

## Conventions

- DO: Add new pages to `sidebars.js` navigation
- DO: Include code examples from real SDK files
- DO: Use `<Tabs>` and `<TabItem>` for multi-language code examples
- DO: Add frontmatter (title, description) to all pages
- DON'T: Add pages without updating `sidebars.js`
- **Git: Create PRs for review; NEVER commit directly to main**

## TRON-Specific Content

- Network identifiers use format `tron:<network>` (mainnet, nile, shasta)
- Use TIP-712 (not EIP-712) for TRON signing references
- Token addresses are base58-encoded (start with 'T')
- Reference TronGrid endpoints for node access
- Example token: USDT at `TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf` (Nile)

## Touch Points / Key Files

- `docs/index.md` — Landing page
- `docs/faq.md` — Frequently asked questions
- `sidebars.js` — Navigation configuration (MUST update when adding pages)
- `docusaurus.config.js` — Main site configuration
- `docs/core-concepts/*.md` — Conceptual documentation
- `docs/getting-started/*.md` — Quickstart guides (MDX for tab components)
- `docs/sdk-features.md` — Update when SDK capabilities change

## File Extensions

- Use `.md` for all pages (Docusaurus parses MDX in standard `.md` files)
- Avoid using `.mdx` extension for better editor compatibility

## Common Gotchas

- `sidebars.js` controls Docusaurus navigation; pages not listed won't appear in sidebar
- Links between pages should omit file extensions
- TRON addresses are case-sensitive and base58-encoded
- Files with tabs must import Tabs components before using them

## Pre-PR Checks

- All links work (no broken references)
- New pages added to `sidebars.js` navigation
- Code examples compile and run
- Frontmatter present on all pages (title, description)
- MDX syntax is valid
- Run `yarn build` to verify no build errors

## SDK Feature Parity Document

When SDK code changes involve:

- New mechanisms in `*/mechanisms/`
- New signers in `*/signers/`
- New client/server features

Update `sdk-features.md` to reflect the current state. Check both SDKs (python/, typescript/) when updating.

## Development Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build

# Serve production build locally
yarn serve
```
