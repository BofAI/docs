import { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function LlmServiceRedirect() {
  const history = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    const isZh = pathname.startsWith('/zh-Hans');
    history.replace(isZh ? '/zh-Hans/llm-service/introduction' : '/llm-service/introduction');
  }, []);

  return null;
}
