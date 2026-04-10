export function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

export function adjustTextareaHeight(textarea, maxHeight = 200) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
}