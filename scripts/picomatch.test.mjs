import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)

for (const consumer of ['micromatch', 'tinyglobby']) {
  const requireFromConsumer = createRequire(require.resolve(consumer))
  const picomatch = requireFromConsumer('picomatch')
  const { version } = requireFromConsumer('picomatch/package.json')

  test(`picomatch ${version} preserves escaped stars in repeated extglobs`, () => {
    assert.equal(picomatch.makeRe(String.raw`+(docs\*)`).test('docs*docs*'), true)
    assert.equal(picomatch.makeRe(String.raw`*(docs\*)`).test('docs*'), true)
    assert.equal(picomatch.makeRe(String.raw`+(docs\\\*)`).test(String.raw`docs\*`), true)
  })

  test(`picomatch ${version} preserves literal stars in parsed groups`, () => {
    const cases = [
      ['+(docs[*])', 'docs*'],
      ['*(docs[*])', 'docs*docs*'],
      ['+(docs[0*])', 'docs0docs*'],
      ['+(docs[[:digit:]*])', 'docs0docs*'],
      ['+(docs{1..3}[*])', 'docs2*'],
      ['+("*")', '*'],
    ]

    for (const [pattern, input] of cases) {
      assert.equal(picomatch.makeRe(pattern).test(input), true, pattern)
    }
  })

  test(`picomatch ${version} still guards repeated wildcard stars`, () => {
    const cases = [
      [String.raw`+(docs\*notes*)`, { flags: 'u' }],
      [String.raw`+(docs\\*)`],
      [String.raw`+(docs\*)`, { unescape: true }],
      ['+(docs[*]notes*)'],
      ['+(docs[*])', { nobracket: true }],
      ['+(docs*)', { maxExtglobRecursion: false }],
    ]

    for (const [pattern, options] of cases) {
      const [, opening] = picomatch.parse(pattern, options).tokens
      assert.equal(opening.type, 'text', pattern)
      assert.equal(opening.value, pattern)
      assert.equal(picomatch.makeRe(pattern, options).test(pattern), true, pattern)
    }
  })
}
