export function isNonEmptyString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

export function isValidEmotion(emotion) {
  const valid = ['happy', 'excited', 'curious', 'thinking', 'surprised', 'nervous', 'sad', 'loving', 'playful', 'proud', 'confused', 'inspired', 'neutral'];
  return valid.includes(emotion);
}