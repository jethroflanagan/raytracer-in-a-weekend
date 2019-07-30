import { Vector3 } from "src/Vector";
import { random, trilinearInterpolation } from "src/utils/math";

const SIZE = 256;
export class PerlinNoise {
  private permutationX;
  private permutationY;
  private permutationZ;
  private randomList;
  private scale;

  constructor({ scale = 1 } : { scale?: number } = {}) {
    this.randomList = this.generate();
    this.permutationX = this.permuteUniqueList();
    this.permutationY = this.permuteUniqueList();
    this.permutationZ = this.permuteUniqueList();
    this.scale = 1 / scale; // invert so larger numbers = larger squares
  }

  getValue(point: Vector3) {
    const floorX = ~~(point.x);
    const floorY = ~~(point.y);
    const floorZ = ~~(point.z);
    const u = point.x - floorX;
    const v = point.y - floorY;
    const w = point.z - floorZ;

    const i = floorX;
    const j = floorY;
    const k = floorZ;

    const block = new Array(2);
    // build block for trilinear interpolation
    for (let di = 0; di < 2; di++) {
      for (let dj = 0; dj < 2; dj++) {
        if (!block[di]) {
          block[di] = new Array(2);
        }
        for (let dk = 0; dk < 2; dk++) {
          if (!block[di][dk]) {
            block[di][dk] = new Array(2);
          }
          block[di][dj][dk] = this.randomList[
            this.permutationX[(i + di) & (SIZE - 1)] ^
            this.permutationY[(j + dj) & (SIZE - 1)] ^
            this.permutationZ[(k + dk) & (SIZE - 1)]
          ];
        }
      }
    }
    return trilinearInterpolation(block, u, v, w);
    // return this.randomList[
    //   this.permutationX[i] ^
    //   this.permutationY[j] ^
    //   this.permutationZ[k]
    // ];
  }

  private generate() {
    const randomList = new Array(SIZE);
    for (let i = 0; i < SIZE; i++) {
      randomList[i] = random();
    }
    return randomList;
  }

  private permute(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const target = ~~(random(0, i + 1));
      const tmp = list[i];
      list[i] = list[target];
      list[target] = tmp;
    }
    return list;
  }

  private permuteUniqueList() {
    const list = new Array(SIZE);
    for (let i = 0; i < SIZE; i++) {
      list[i] = i;
    }
    this.permute(list);
    return list;
  }
}
