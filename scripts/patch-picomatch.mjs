import { createHash, randomUUID } from 'node:crypto'
import { globSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Remove this backport after both locked versions have upstream replacements.
const parserHashes = new Map([
  ['2.3.2', {
    original: '3a91656f440069aa8f8e15c9d695b9f6b2209df1eab2be8127c72cbcca45ff5f',
    patched: '6eeeeed5fba1a469c6dd921f79faa29c35caff71bdbc634f5bbd43e5eb123b18',
  }],
  ['4.0.7', {
    original: '4e1e05447668aa1e94366c5516a2bcd8f5fff800cc92b1d0cd7d77703b8618c4',
    patched: '0a9aaf24f515602c0472e816c90164f103f390e1700be415dfced9855cd10abc',
  }],
])
const originalClose = `  const extglobClose = token => {
    const literal = input.slice(token.startIndex, state.index + 1);
    const body = input.slice(token.startIndex + 2, state.index);
    const analysis = analyzeRepeatedExtglob(body, opts);

    if ((token.type === 'plus' || token.type === 'star') && analysis.risky) {`
const patchedClose = String.raw`  const hasRegexStar = source => {
    let inClass = false;
    for (let i = 0; i < source.length; i++) {
      const ch = source[i];
      if (ch === '\\') {
        if (++i === source.length) return true;
      } else if (ch === '[') {
        inClass = true;
      } else if (ch === ']') {
        inClass = false;
      } else if (ch === '*' && !inClass) {
        return true;
      }
    }
    return inClass;
  };

  const repeatedBodyHasStar = token => {
    const open = tokens[token.tokensIndex];
    const paren = tokens[token.tokensIndex + 1];
    if (!open || !paren || !paren.extglob) return true;

    const start = token.output.length;
    const opening = open.output + paren.output;
    if (!state.output.startsWith(opening, start)) return true;
    if (hasRegexStar(state.output.slice(start + opening.length))) return true;

    // A later token can make the parser rebuild its output from these tokens.
    const rebuilt = tokens.slice(token.tokensIndex + 2)
      .map(part => (part.output ?? part.value) + (part.suffix ?? ''))
      .join('');
    return hasRegexStar(rebuilt);
  };

  const extglobClose = token => {
    const literal = input.slice(token.startIndex, state.index + 1);
    const body = input.slice(token.startIndex + 2, state.index);
    const analysis = analyzeRepeatedExtglob(body, opts);
    const repeated = token.type === 'plus' || token.type === 'star';
    // CVE-2026-112366: inspect the emitted regex so literal stars stay literal.
    const nestedStar = repeated && !analysis.risky && body.includes('*')
      && splitTopLevel(body).length === 1 && repeatedBodyHasStar(token);

    if (repeated && (analysis.risky || nestedStar)) {`
const originalFallback = '      open.output = safeOutput || utils.escapeRegex(literal);'
const patchedFallback = String.raw`      open.output = safeOutput || literal.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');`

function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

export function verifyPicomatchPatches({ apply = false } = {}) {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const manifests = globSync([
    'node_modules/picomatch/package.json',
    'node_modules/**/node_modules/picomatch/package.json',
  ], { cwd: root })
  const verified = new Set()

  for (const manifest of manifests) {
    const { version } = JSON.parse(readFileSync(join(root, manifest), 'utf8'))
    const hashes = parserHashes.get(version)
    if (!hashes) continue

    const path = join(root, dirname(manifest), 'lib/parse.js')
    const source = readFileSync(path, 'utf8')
    const hash = sha256(source)
    if (hash !== hashes.patched) {
      if (!apply || hash !== hashes.original) {
        throw new Error(`Expected the validated picomatch ${version} parser at ${path}`)
      }

      const patched = source.replace(originalClose, () => patchedClose).replace(originalFallback, () => patchedFallback)
      if (sha256(patched) !== hashes.patched) {
        throw new Error(`Picomatch ${version} backport produced unexpected content`)
      }

      const temporary = `${path}.${randomUUID()}.tmp`
      try {
        writeFileSync(temporary, patched, { flag: 'wx' })
        renameSync(temporary, path)
      } finally {
        rmSync(temporary, { force: true })
      }
    }
    verified.add(version)
  }

  return verified
}

if (import.meta.main) {
  const versions = verifyPicomatchPatches({ apply: true })
  if (versions.size) console.log(`Verified picomatch backport for ${[...versions].sort().join(', ')}`)
}
