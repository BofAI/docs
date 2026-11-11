import assert from 'node:assert/strict'
import test from 'node:test'
import {evaluate} from '@mdx-js/mdx'
import React from 'react'
import * as runtime from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import katex from 'katex'

async function render(source) {
  const {default: Content} = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  })
  return renderToStaticMarkup(React.createElement(Content))
}

test('MDX renders inline and display equations with the patched KaTeX', async () => {
  const html = await render('Inline $E=mc^2$.\n\n$$\n\\frac{1}{2} + \\sqrt{x}\n$$')
  assert.match(html, /class="katex"/)
  assert.match(html, /class="katex-display"/)
  assert.match(html, /<math /)
  assert.doesNotMatch(html, /katex-error/)
})

test('documented dollar prices and fenced commands remain literal', async () => {
  const html = await render('Input `$0.20`, output `$1.25`.\n\n```bash\necho "$HOME"\n```')
  assert.match(html, /<code>\$0\.20<\/code>/)
  assert.match(html, /<code>\$1\.25<\/code>/)
  assert.match(html, /echo &quot;\$HOME&quot;/)
  assert.doesNotMatch(html, /class="katex"/)
})

test('KaTeX rejects untrusted HTML commands', () => {
  const html = katex.renderToString('\\htmlData{onclick=alert(1)}{click}', {strict: false})
  assert.doesNotMatch(html, /<[^>]+\sonclick=/)
})

test('inherited trust cannot enable unsafe links (GHSA-238p-pmpm-9mq7)', () => {
  const previous = Object.getOwnPropertyDescriptor(Object.prototype, 'trust')
  Object.defineProperty(Object.prototype, 'trust', {value: true, writable: true, configurable: true})
  try {
    const html = katex.renderToString('\\href{javascript:alert(1)}{click}', {strict: false})
    assert.doesNotMatch(html, /<a\b[^>]*href="javascript:/)
  } finally {
    if (previous) Object.defineProperty(Object.prototype, 'trust', previous)
    else delete Object.prototype.trust
  }
})
