import React from 'react'
import { Redirect } from '@docusaurus/router'
import useBaseUrl from '@docusaurus/useBaseUrl'

// /llmservice/ → /llmservice/introduction/
// useBaseUrl 会自动带上当前语言前缀（zh-Hans 构建的 baseUrl 为 /zh-Hans/），
// 末尾斜杠与 docusaurus.config.js 中 trailingSlash: true 保持一致。
export default function LlmServiceRedirect() {
  return <Redirect to={useBaseUrl('/llmservice/introduction/')} />
}
