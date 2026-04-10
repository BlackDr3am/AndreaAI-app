export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function enhancedFormatResponse(text) {
  let fmt = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="code-block-wrapper">
                <div class="code-header">
                  <span class="code-lang">${lang || 'código'}</span>
                  <button class="copy-code-btn" onclick="copyCodeToClipboard(this)">📋 Copiar</button>
                </div>
                <pre><code>${escapeHtml(code)}</code></pre>
              </div>`;
    })
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br>');
  return fmt;
}