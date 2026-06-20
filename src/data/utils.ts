/** Normalize progress to [0, 1) */
export function normalizeProgress(p: number): number {
  return ((p % 1) + 1) % 1;
}

/** Convert hex color to hue (0-360) */
export function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    if (max === r) h = (g - b) / (max - min);
    else if (max === g) h = 2 + (b - r) / (max - min);
    else h = 4 + (r - g) / (max - min);
  }
  return (h * 60 + 360) % 360;
}

/** Simple syntax highlighting for code display */
export function highlightCode(code: string): string {
  return code
    .replace(
      /\b(const|let|var|return|if|else|for|of|in|new|function|Math)\b/g,
      '<span class="kw">$1</span>',
    )
    .replace(
      /\b(Math\.\w+|sin|cos|exp|pow|abs|floor|round|max|min|PI)\b/g,
      '<span class="fn">$1</span>',
    )
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>')
    .replace(/(".*?"|'.*?')/g, '<span class="str">$1</span>')
    .replace(/(\/\/.+)/g, '<span class="cm">$1</span>');
}

/** Extract unique categories from animations */
export function getCategories(
  animations: Array<{ category: string }>,
): string[] {
  return [...new Set(animations.map((a) => a.category))];
}
