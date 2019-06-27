import { Vector3 } from "./Vector";
import { Ray } from "./Ray";
import { toRadians } from "./utils";

export type RenderTarget = {
  width: number,
  height: number,
  depth: number,
}

export class Camera {
  lowerLeftCorner: Vector3 = null;
  horizontal: Vector3 = null;
  vertical: Vector3 = null;
  origin: Vector3;
  verticalFOV: number;
  aspectRatio: number;
  lookAt: Vector3;
  up: Vector3;

  /**
   *
   * @param origin
   * @param verticalFOV   in degrees
   */
  constructor({ origin = new Vector3(0,0,0), verticalFOV = 90, aspectRatio = 1, lookAt = new Vector3(0,0,-1), up = new Vector3(0, 1, 0) }:
    { origin: Vector3, verticalFOV: number, aspectRatio: number, lookAt: Vector3, up?: Vector3 }) {

    const DEPTH = -1;

    this.origin = origin;
    this.lookAt = lookAt;
    this.up = up;
    this.verticalFOV = verticalFOV;
    this.aspectRatio = aspectRatio;

    const theta = toRadians(verticalFOV);
    const halfHeight = Math.tan(theta / 2);
    const halfWidth = aspectRatio * halfHeight;

    const w = origin.subtract(lookAt).unit(); // z or into scene
    const u = up.cross(w).unit();
    const v = w.cross(u);

    // this.lowerLeftCorner = new Vector3(-halfWidth, -halfHeight, DEPTH);
    this.lowerLeftCorner = origin
      .subtract( u.multiply(halfWidth) )
      .subtract( v.multiply(halfHeight) )
      .subtract( w );
    this.horizontal = u.multiply(2 * halfWidth);
    this.vertical = v.multiply(2 * halfHeight);
  }

  getRay(u: number, v: number): Ray {
    return new Ray(this.origin,
      this.lowerLeftCorner
      .add( this.horizontal.multiply(u) )
      .add( this.vertical.multiply(v) )
      .subtract( this.origin )
    );
  }
}
