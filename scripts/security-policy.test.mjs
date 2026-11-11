import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {generateSecurityHeaders, inlineScriptHashes, securityHeaders} from './security-policy.mjs'

test('CSP hashes the exact executable script text and excludes inert JSON', () => {
  const script = '\nwindow.location.href = "/wallet-cli/";\n'
  const expected = `sha256-${createHash('sha256').update(script).digest('base64')}`
  assert.deepEqual(inlineScriptHashes(`<script>${script}</script><script type="application/ld+json">{}</script>`), [expected])
  assert.notDeepEqual(inlineScriptHashes('<script>window.evil = true</script>'), [expected])
})

test('build rejects external scripts and inline event handlers', () => {
  assert.throws(() => inlineScriptHashes('<script src="https://example.com/remote.js"></script>'), /External script/)
  assert.throws(() => inlineScriptHashes('<script src="//example.com/remote.js"></script>'), /External script/)
  assert.throws(() => inlineScriptHashes('<script src="  https://example.com/remote.js"></script>'), /External script/)
  assert.throws(() => inlineScriptHashes('<img src="x" onerror="alert(1)">'), /Inline event handler/)
})

test('security policy blocks unapproved script execution and embedding', () => {
  const headers = securityHeaders([])
  const policy = headers['Content-Security-Policy']
  const scripts = policy.split('; ').find(value => value.startsWith('script-src '))
  assert.doesNotMatch(scripts, /unsafe-inline|unsafe-eval|https:|\*/)
  assert.match(policy, /frame-ancestors 'none'/)
  assert.match(policy, /object-src 'none'/)
  assert.equal(headers['X-Content-Type-Options'], 'nosniff')
})

test('generated Nginx headers cover both locales and redirect pages', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'docs-csp-test-'))
  try {
    const build = path.join(directory, 'build')
    const output = path.join(directory, 'security')
    await mkdir(path.join(build, 'zh-Hans'), {recursive: true})
    await writeFile(path.join(build, 'index.html'), '<script>window.theme = "dark"</script>')
    await writeFile(path.join(build, 'zh-Hans', 'index.html'), '<script>window.location.href = "/zh-Hans/"</script>')
    assert.deepEqual(await generateSecurityHeaders(build, output), {pages: 2, hashes: 2})
    const headers = JSON.parse(await readFile(path.join(output, 'headers.json'), 'utf8'))
    assert.equal((headers['Content-Security-Policy'].match(/sha256-/g) ?? []).length, 2)
    const nginx = await readFile(path.join(output, 'nginx-headers.conf'), 'utf8')
    assert.ok(nginx.trim().split('\n').every(line => line.endsWith(' always;')))
  } finally {
    await rm(directory, {recursive: true, force: true})
  }
})
