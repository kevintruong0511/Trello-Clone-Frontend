const GAP = 1024;

/** Position for an item landing at `index` within `sorted` (item already removed). */
export const positionAt = (sorted: { position: number }[], index: number): number => {
  if (sorted.length === 0) return GAP;
  if (index <= 0) return sorted[0].position / 2;
  if (index >= sorted.length) return sorted[sorted.length - 1].position + GAP;
  return (sorted[index - 1].position + sorted[index].position) / 2;
};
