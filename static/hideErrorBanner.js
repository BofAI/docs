// 拦截浏览器插件（如 MetaMask 的 inpage.js）抛出的未处理错误，
// 避免开发模式下 webpack 错误浮层误报。站点代码从不调用任何钱包插件；
// 此脚本经 docusaurus.config.js scripts 注入 <head>，先于 webpack 客户端
// 注册监听，因此能在浮层收到事件前 stopImmediatePropagation。
window.addEventListener('error', (e) => {
  if (e.filename && e.filename.startsWith('chrome-extension://')) {
    e.stopImmediatePropagation()
  }
})

window.addEventListener('unhandledrejection', (e) => {
  const s = e.reason && (e.reason.stack || String(e.reason))
  if (s && s.indexOf('chrome-extension://') !== -1) {
    e.stopImmediatePropagation()
  }
})

window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('__docusaurus-base-url-issue-banner-container')
  if (modal) {
    modal.style.display = 'none'
    modal.style.visibility = 'hidden'
    modal.style.opacity = '0'
    modal.style.height = '0'
    modal.style.pointerEvents = 'none'
  }
})
