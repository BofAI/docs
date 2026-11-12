import assert from 'node:assert/strict'
import {PassThrough} from 'node:stream'
import {text} from 'node:stream/consumers'
import test from 'node:test'
import React from 'react'
import {renderToPipeableStream, renderToStaticMarkup} from 'react-dom/server'
import {compileSSGTemplate} from '@docusaurus/core/lib/ssg/ssgTemplate.js'
import ssrTemplate from './ssr-template.mjs'

test('streamed Chinese text and anchors survive UTF-8 chunk boundaries', async () => {
  const app = React.createElement('article', null, ...Array.from({length: 300}, (_, key) =>
    React.createElement('a', {key, href: '#中文标题'}, '中文链接文本🔗'),
  ))
  const stream = new PassThrough()
  const html = text(stream)
  const renderer = renderToPipeableStream(app, {
    onAllReady() { renderer.pipe(stream) },
    onError(error) { stream.destroy(error) },
  })
  const renderTemplate = await compileSSGTemplate(ssrTemplate)
  const page = renderTemplate({
    appHtml: await html,
    htmlAttributes: 'lang="zh-Hans"', bodyAttributes: '',
    version: '3.10.2', baseUrl: '/',
    metaAttributes: ['<title>中文标题</title>'], headTags: '',
    preBodyTags: '', postBodyTags: '',
    scripts: ['assets/main.js'], stylesheets: ['assets/main.css'],
  })

  assert.ok(page.includes(`<div id="__docusaurus">${renderToStaticMarkup(app)}</div>`))
  assert.ok(page.includes('<script src="/assets/main.js" defer></script>'))
  assert.ok(page.includes('<title>中文标题</title>'))
  assert.ok(!page.includes('\0'))
})
