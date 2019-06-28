export function toRadians (degrees) {
  return degrees * Math.PI / 180;
}

export function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}

// TODO: use in lens (aperture)
// Uniform point distribution
//https://stackoverflow.com/a/50746409
export function getRandomPointInCircle({ radius = 1 }: { radius: number }) {
  const angle = Math.random() * Math.PI * 2;
  // use `angle` instead of random for spiral
  const distance = radius * Math.sqrt(Math.random());
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  return { x, y }
}
