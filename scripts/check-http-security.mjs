import assert from 'node:assert/strict'
import {setTimeout} from 'node:timers/promises'

const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:8080')
const routes = [
  ['/index.html', 200],
  ['/BANK-OF-AI/Intro/', 200],
  ['/zh-Hans/BANK-OF-AI/Intro/', 200],
  ['/x402/cli/quickstart/', 200],
  ['/missing-security-check-page/', 404],
  ['/zh-Hans/missing-security-check-page/', 404],
  ['/assets/missing-security-check.js', 404],
  ['/.git/config', 404],
  ['/.env', 404],
]

for (let attempt = 0; ; attempt += 1) {
  try {
    await fetch(origin, {signal: AbortSignal.timeout(2000)})
    break
  } catch (error) {
    if (attempt >= 19) throw error
    await setTimeout(250)
  }
}

for (const [route, expected] of routes) {
  const response = await fetch(new URL(route, origin), {signal: AbortSignal.timeout(5000)})
  const headers = response.headers
  assert.equal(response.status, expected, route)
  assert.equal(headers.get('x-content-type-options'), 'nosniff', route)
  assert.equal(headers.get('x-frame-options'), 'DENY', route)
  assert.equal(headers.get('cross-origin-opener-policy'), 'same-origin', route)
  assert.equal(headers.get('referrer-policy'), 'strict-origin-when-cross-origin', route)
  assert.match(headers.get('strict-transport-security') ?? '', /max-age=31536000/, route)
  assert.match(headers.get('permissions-policy') ?? '', /camera=\(\)/, route)
  const csp = headers.get('content-security-policy') ?? ''
  assert.match(csp, /default-src 'none'/, route)
  assert.match(csp, /frame-ancestors 'none'/, route)
  const scripts = csp.split('; ').find(value => value.startsWith('script-src ')) ?? ''
  assert.match(scripts, /sha256-/, route)
  assert.doesNotMatch(scripts, /unsafe-inline|unsafe-eval|https:|\*/, route)
  assert.doesNotMatch(headers.get('server') ?? '', /nginx\/\d/, route)
  if (headers.get('content-type')?.startsWith('text/html')) {
    assert.equal(headers.get('cache-control'), 'no-store', route)
  }
  await response.arrayBuffer()
}
console.log(`[security] HTTP headers and status codes passed for ${routes.length} routes`)
