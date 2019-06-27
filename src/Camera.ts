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
  focalDistance: number;
  private lensRadius: number;

  // orientation
  w: Vector3;
  u: Vector3;
  v: Vector3;

  /**
   *
   * @param origin
   * @param verticalFOV   in degrees
   */
  constructor({
    origin = new Vector3(0,0,0),
    verticalFOV = 90,
    aspectRatio = 1,
    lookAt = new Vector3(0,0,-1),
    up = new Vector3(0, 1, 0),
    aperture = 0,
    focalDistance = 1,
  }: {
    origin: Vector3,
    verticalFOV: number,
    aspectRatio: number,
    lookAt: Vector3,
    up?: Vector3,
    aperture: number,
    focalDistance: number;
  }) {

    this.origin = origin;
    this.lensRadius = aperture / 2;
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
    this.w = w;
    this.u = u;
    this.v = v;

    // const DEPTH = -1;
    // this.lowerLeftCorner = new Vector3(-halfWidth, -halfHeight, DEPTH);
    this.lowerLeftCorner = origin
      .subtract( u.multiply(halfWidth * focalDistance) )
      .subtract( v.multiply(halfHeight * focalDistance) )
      .subtract( w.multiply(focalDistance) );
    this.horizontal = u.multiply(2 * halfWidth * focalDistance);
    this.vertical = v.multiply(2 * halfHeight * focalDistance);
  }

  getRandomPointOnDisc() {
    return Vector3.randomDirection()
      .multiply(new Vector3(1, 1, 0)); // flatten z
  }

  set aperture(val: number) {
    this.lensRadius = val / 2;
  }
  get aperture() {
    return this.lensRadius * 2;
  }

  getRay(horizontalPercent: number, verticalPercent: number): Ray {
    const { u, v } = this;
    let offset = new Vector3(0,0,0);
    if (this.lensRadius > 0) {
      const pointOnLens = this.getRandomPointOnDisc().multiply(this.lensRadius);
      offset = u.multiply(pointOnLens.x)
        .add( v.multiply(pointOnLens.y) );
    }
    return new Ray(this.origin.add(offset),
      this.lowerLeftCorner
      .add( this.horizontal.multiply(horizontalPercent) )
      .add( this.vertical.multiply(verticalPercent) )
      .subtract( this.origin )
      .subtract( offset )
    );
  }
}
