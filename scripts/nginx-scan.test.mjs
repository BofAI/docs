import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import test from 'node:test'
import {fileURLToPath} from 'node:url'

const script = fileURLToPath(new URL('./check-nginx-scan.mjs', import.meta.url))
const component = {
  version: '1.2.3',
  purl: 'pkg:generic/nginx@1.2.3',
  cpe: 'cpe:2.3:a:f5:nginx:1.2.3:*:*:*:*:*:*:*',
}

function verify(components, versionOutput = 'nginx version: nginx/1.2.3') {
  return spawnSync(process.execPath, [script, versionOutput], {
    input: JSON.stringify({bomFormat: 'CycloneDX', components}),
    encoding: 'utf8',
  })
}

test('accepts an upstream Nginx component matching the running server', () => {
  for (const vendor of ['f5', 'nginx']) {
    const result = verify([{...component, cpe: `cpe:2.3:a:${vendor}:nginx:1.2.3:*:*:*:*:*:*:*`}])
    assert.equal(result.status, 0, result.stderr)
  }
})

test('rejects an empty catalog, a version mismatch and missing upstream identifiers', () => {
  for (const result of [
    verify([]),
    verify(undefined),
    verify([component], 'nginx version: nginx/1.2.4'),
    verify([{...component, version: '1.2.4'}]),
    verify([{...component, purl: 'pkg:apk/alpine/nginx@1.2.3-r0'}]),
    verify([{...component, cpe: undefined}]),
    verify([component], ''),
  ]) {
    assert.equal(result.status, 1, result.stderr)
  }
})
