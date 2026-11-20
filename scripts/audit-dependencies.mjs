import { spawnSync } from 'node:child_process'
import { verifyPicomatchPatches } from './patch-picomatch.mjs'

const verifiedVersions = verifyPicomatchPatches()
const audit = spawnSync('yarn', ['audit', '--json', '--non-interactive', '--network-timeout', '60000'], {
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
  stdio: ['ignore', 'pipe', 'inherit'],
})
if (audit.error) throw audit.error

const severityFlags = { info: 1, low: 2, moderate: 4, high: 8, critical: 16 }
const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 }
let summary
let failed = false
let covered = 0

for (const line of audit.stdout.split('\n').filter(Boolean)) {
  const { type, data } = JSON.parse(line)
  if (type === 'warning' || type === 'error') console.error(data)
  if (type === 'error') failed = true
  if (type === 'auditSummary') {
    if (summary) throw new Error('Yarn returned more than one audit summary')
    summary = data
  }
  if (type !== 'auditAdvisory') continue

  const { advisory, resolution } = data
  if (!Object.hasOwn(counts, advisory.severity)) throw new Error('Unknown audit severity')
  counts[advisory.severity]++

  // Yarn sees the registry versions even after the verified local backport.
  if (advisory.id === 1247710 && resolution.id === advisory.id &&
      advisory.module_name === 'picomatch' && advisory.severity === 'high' &&
      advisory.github_advisory_id === 'GHSA-fc5q-39xc-vjpf' &&
      advisory.cves?.length === 1 && advisory.cves[0] === 'CVE-2026-112366' &&
      advisory.findings?.length && advisory.findings.every(({ version }) => verifiedVersions.has(version))) {
    covered++
    continue
  }

  console.error(`${advisory.severity}: ${advisory.module_name} — ${advisory.url} (${resolution.path})`)
  failed = true
}

let expectedStatus = 0
for (const [severity, flag] of Object.entries(severityFlags)) {
  if (summary?.vulnerabilities?.[severity] !== counts[severity]) {
    throw new Error(`Incomplete Yarn audit results for severity ${severity}`)
  }
  if (counts[severity]) expectedStatus |= flag
}
if (audit.status !== expectedStatus) throw new Error(`Unexpected Yarn audit exit status ${audit.status}`)

if (covered) console.log(`Verified backport covers ${covered} findings for GHSA-fc5q-39xc-vjpf`)
console.log(`Yarn audited ${summary.totalDependencies} packages`)
if (failed) process.exitCode = 1
