import assert from 'node:assert/strict'
import test from 'node:test'
import {checkNativeSearch, loadSearchBinding} from './check-native-search.mjs'

test('installed native binding can tokenize Chinese for the current Node architecture', () => {
  checkNativeSearch()
  assert.deepEqual(loadSearchBinding().cut('钱包支付'), ['钱包', '支付'])
})

test('missing native binding gives architecture details and recovery commands', () => {
  const cause = new Error('Failed to load native binding')
  assert.throws(() => checkNativeSearch(() => {throw cause}), error => {
    assert.equal(error.cause, cause)
    assert.ok(error.message.includes(`${process.platform}/${process.arch}`))
    assert.ok(error.message.includes(process.execPath))
    assert.match(error.message, /nvm use/)
    assert.match(error.message, /yarn install --frozen-lockfile --force/)
    return true
  })
})
