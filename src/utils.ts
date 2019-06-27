export function toRadians (degrees) {
  return degrees * Math.PI / 180;
}

export function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}
