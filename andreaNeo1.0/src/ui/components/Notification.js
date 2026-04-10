export class Notification {
  static show(message, type = 'info', duration = 3000) {
    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.textContent = message;
    div.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
      color: white; padding: 12px 24px; border-radius: 8px;
      z-index: 10000; animation: fadeInUp 0.3s;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), duration);
  }
}