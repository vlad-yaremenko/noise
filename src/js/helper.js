export function normalize(v, maxValue, max, min) {
  return (v / maxValue) * (max - min) + min;
}
