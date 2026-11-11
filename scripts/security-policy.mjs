import {createHash} from 'node:crypto'
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {parse} from 'parse5'

const inertScriptTypes = new Set(['application/json', 'application/ld+json'])

export function inlineScriptHashes(html) {
  const hashes = new Set()
  function visit(node) {
    for (const attr of node.attrs ?? []) {
      if (attr.name.startsWith('on')) {
        throw new Error(`Inline event handler ${attr.name} is incompatible with the site CSP`)
      }
    }
    if (node.tagName === 'script') {
      const attrs = Object.fromEntries(node.attrs.map(({name, value}) => [name, value]))
      if (attrs.src) {
        if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(attrs.src.trim())) {
          throw new Error(`External script is not permitted: ${attrs.src}`)
        }
      } else if (!inertScriptTypes.has((attrs.type ?? '').trim().toLowerCase())) {
        const text = node.childNodes.map(child => child.value ?? '').join('')
        if (text.trim()) hashes.add(`sha256-${createHash('sha256').update(text).digest('base64')}`)
      }
    }
    for (const child of node.childNodes ?? []) visit(child)
    if (node.content) visit(node.content)
  }
  visit(parse(html))
  return [...hashes].sort()
}

export function securityHeaders(hashes) {
  const policy = [
    "default-src 'none'",
    `script-src 'self' ${[...new Set(hashes)].sort().map(hash => `'${hash}'`).join(' ')}`,
    "script-src-attr 'none'",
    // React, Infima and KaTeX set inline styles; executable inline JS remains blocked.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://files.readme.io",
    "font-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "media-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'none'",
  ].join('; ')
  if (Buffer.byteLength(policy) > 7000) throw new Error('CSP exceeds the safe response header size')
  return {
    'Content-Security-Policy': policy,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Strict-Transport-Security': 'max-age=31536000',
  }
}

export async function generateSecurityHeaders(buildDir, outputDir) {
  const hashes = new Set()
  let count = 0
  async function scan(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) await scan(file)
      else if (entry.name.endsWith('.html')) {
        const html = await readFile(file, 'utf8')
        for (const hash of inlineScriptHashes(html)) hashes.add(hash)
        count += 1
      }
    }
  }
  await scan(buildDir)
  if (!count) throw new Error(`No HTML pages found in ${buildDir}`)
  const headers = securityHeaders([...hashes])
  const nginx = Object.entries(headers).map(([name, value]) =>
    `add_header ${name} "${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}" always;`
  ).join('\n')
  await mkdir(outputDir, {recursive: true})
  await writeFile(path.join(outputDir, 'nginx-headers.conf'), `${nginx}\n`)
  await writeFile(path.join(outputDir, 'headers.json'), `${JSON.stringify(headers, null, 2)}\n`)
  return {pages: count, hashes: hashes.size}
}
