import { Vector3 } from "src/Vector";
import { random } from "src/utils/math";

export class PerlinNoise {
  private xRange;
  private yRange;
  private zRange;
  private randomList;
  private size;

  constructor(size: number = 1) {
    const SIZE = 256;
    this.randomList = this.generate(SIZE);
    this.xRange = this.permuteUniqueList(SIZE);
    this.yRange = this.permuteUniqueList(SIZE);
    this.zRange = this.permuteUniqueList(SIZE);
    this.size = 1 / size; // invert so larger numbers = larger squares
  }

  getValue(point: Vector3) {
    const size = this.randomList.length;
    // const floorX = ~~(point.x);
    // const floorY = ~~(point.y);
    // const floorZ = ~~(point.z);
    // const u = point.x - floorX;
    // const v = point.y - floorY;
    // const w = point.z - floorZ;

    const i = (4 * point.x * this.size) & (size - 1);
    const j = (4 * point.y * this.size) & (size - 1);
    const k = (4 * point.z * this.size) & (size - 1);
    return this.randomList[
      this.xRange[i] ^
      this.yRange[j] ^
      this.zRange[k]
    ];
  }

  private generate(size) {
    const randomList = [];
    for (let i = 0; i < size; i++) {
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

  private permuteUniqueList(size) {
    const list = [];
    for (let i = 0; i < size; i++) {
      list[i] = i;
    }
    this.permute(list);
    return list;
  }
}
