import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)

export function loadSearchBinding() {
  // Resolve from the search plugin so this also works with nested dependencies.
  const searchRequire = createRequire(require.resolve('@easyops-cn/docusaurus-search-local'))
  return searchRequire('@node-rs/jieba')
}

export function checkNativeSearch(loadBinding = loadSearchBinding) {
  try {
    loadBinding()
  } catch (cause) {
    const recommendedNode = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim()
    throw new Error([
      `Cannot load the Chinese search tokenizer for ${process.platform}/${process.arch} (Node ${process.version}).`,
      `Node executable: ${process.execPath}`,
      'Native dependencies must be installed and built with the same Node architecture.',
      `Use the project Node version (${recommendedNode}) and reinstall optional dependencies:`,
      '  nvm install',
      '  nvm use',
      '  yarn install --frozen-lockfile --force',
      '  yarn build',
    ].join('\n'), {cause})
  }
}
