import {spawnSync} from 'node:child_process'
import {createRequire} from 'node:module'
import path from 'node:path'
import {generateSecurityHeaders} from './security-policy.mjs'

const require = createRequire(import.meta.url)
const args = process.argv.slice(2)
const coreDir = path.dirname(require.resolve('@docusaurus/core/package.json'))
const result = spawnSync(process.execPath, [path.join(coreDir, 'bin/docusaurus.mjs'), 'build', ...args], {
  stdio: 'inherit',
})
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
if (!args.includes('--help') && !args.includes('-h')) {
  const outIndex = args.indexOf('--out-dir')
  const outDir = outIndex >= 0 ? args[outIndex + 1] : args.find(arg => arg.startsWith('--out-dir='))?.slice(10)
  const report = await generateSecurityHeaders(path.resolve(outDir ?? 'build'), path.resolve('.site-security'))
  console.log(`[security] Generated CSP for ${report.pages} pages (${report.hashes} inline script hashes)`)
}
