import { Vector3 } from "./Vector";
import { Ray } from "./Ray";

export type RenderTarget = {
  width: number,
  height: number,
  depth: number,
}

export class Camera {
  lowerLeftCorner: Vector3 = null;
  horizontal: Vector3 = null;
  vertical: Vector3 = null;

  constructor(public origin: Vector3, private target: RenderTarget) {
    this.lowerLeftCorner = new Vector3(-target.width / 2, -target.height / 2, -target.depth).subtract(origin);
    this.horizontal = new Vector3(target.width, 0, 0);
    this.vertical = new Vector3(0, target.height, 0);
  }

  getRay(u: number, v: number): Ray {
    return new Ray(this.origin,
      this.lowerLeftCorner
      .add( this.horizontal.multiply(u) )
      .add( this.vertical.multiply(v) )
    );
  }
}
