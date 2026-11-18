import {readFileSync} from 'node:fs'

const versionOutput = process.argv[2] ?? ''
const version = /^nginx version: nginx\/(\d+\.\d+\.\d+)$/.exec(versionOutput)?.[1]
if (!version) throw new Error(`Unexpected nginx -v output: ${versionOutput}`)

const report = JSON.parse(readFileSync(0, 'utf8'))
const purl = `pkg:generic/nginx@${version}`
const cpes = ['f5', 'nginx'].map(vendor => `cpe:2.3:a:${vendor}:nginx:${version}:*:*:*:*:*:*:*`)
const identified = report.components?.some(component =>
  component.purl === purl && component.version === version && cpes.includes(component.cpe),
)
if (!identified) throw new Error(`Grype did not identify upstream Nginx ${version} in its scan report`)
console.log(`[security] Grype identified ${purl} with its upstream CPE`)
