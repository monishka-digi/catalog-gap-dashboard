export function suggestionKey(item) {
  return `${item.sku}|${item.attr}`;
}

export function confidenceColor(value) {
  if (value >= 0.9) return "#22c55e";
  if (value >= 0.8) return "#3b82f6";
  return "#f59e0b";
}

export function confidencePercent(value) {
  return Math.round(value * 100);
}

export function groupByPriority(items, priorities) {
  const grouped = priorities.reduce((acc, priority) => ({ ...acc, [priority]: [] }), {});
  items.forEach((item) => {
    grouped[item.priority].push(item);
  });
  return grouped;
}
