import { Volume } from "./Volume";
import { AABB } from "./AABB";

export class BVH_Node implements Volume {

  volume: Volume;
  node: number;
  t1: number;
  t0: number;
  left: Volume;
  right: Volume;
  box: AABB;

  constructor({ volume, node, t0, t1 }: { volume: Volume, node: number, t0: number, t1: number }) {
    this.volume = volume;
    this.node = node;
    this.t0 = t0;
    this.t1 = t1;
  }

  hit() {
  }

  getBoundingBox(t0: number, t1: number) {
    return this.box;
  }


}
