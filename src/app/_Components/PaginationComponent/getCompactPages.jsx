import React from 'react'

function getCompactPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const normalized = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < normalized.length; i++) {
    const value = normalized[i];
    const prev = normalized[i - 1];
    if (i > 0 && value - prev > 1) result.push("…");
    result.push(value);
  }
  if (!normalized.includes(current - 1) && current - 1 >= 2)
    result.splice(1, 0, current - 1);
  if (!normalized.includes(current + 1) && current + 1 <= total - 1)
    result.splice(result.length - 1, 0, current + 1);
  return result.filter((v, i) => i === 0 || v !== result[i - 1]);
}

export default getCompactPages
