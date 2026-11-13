import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const upstreamTemplate = require('@docusaurus/core/lib/ssg/ssgTemplate.html.js').default
const appHtmlTag = '<%~ it.appHtml %>'

if (!upstreamTemplate.includes(appHtmlTag)) {
  throw new Error('Docusaurus SSR template changed; review the React 18 UTF-8 padding workaround')
}

// React 18 can emit unused buffer bytes at multibyte text boundaries:
// https://github.com/facebook/react/pull/26228
// Remove this padding before HTML minification and search indexing.
export default upstreamTemplate.replace(appHtmlTag, "<%~ it.appHtml.replace(/\\0/g, '') %>")
