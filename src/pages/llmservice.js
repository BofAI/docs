import { useEffect } from 'react'
import { useHistory, useLocation } from '@docusaurus/router'

export default function LlmServiceRedirect() {
  const history = useHistory()
  const { pathname } = useLocation()

  useEffect(() => {
    const isZh = pathname.startsWith('/zh-Hans')
    history.replace(isZh ? '/zh-Hans/llmservice/introduction' : '/llmservice/introduction')
  }, [])

  return null
}
