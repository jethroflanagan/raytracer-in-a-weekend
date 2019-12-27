import { Volume } from "src/volume/Volume";

// TODO: make this a modifier that can be added and removed from a volume
export function flipNormals(volume: Volume) {
  const volumeHit = volume.hit;
  volume.hit = function (...args) {
    const intersection = volumeHit.apply(volume, args);
    if (!intersection) return intersection;
    intersection.normal = intersection.normal.multiply(-1);
    return intersection;
  }
  return volume;
}
