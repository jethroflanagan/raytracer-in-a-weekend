import { Color } from './Color';
import { Image } from './Image';
import { Camera } from './Camera';
import { Scene } from './Scene';
import { Vector3 } from './Vector';
import { Volume } from './Volume';
import { Intersection } from './Intersection';
import { Ray } from './Ray';
import { vectorToColor, colorToVector } from './utils';

const T_MIN = .001;
const T_MAX = Infinity;
const MAX_RAY_DEPTH = 100;
// RHS camera (y up, x right, negative z into screen)
export class Renderer {
  private canvas = null;
  private ctx = null;
  private renderBuffer = null;
  private width: number = 0;
  private height: number = 0;
  private camera: Camera;
  private scene: Scene;

  constructor({ canvas, camera, scene } : { canvas: any, camera: Camera, scene: Scene }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.camera = camera;
    this.scene = scene;
    this.renderBuffer = this.ctx.createImageData(this.width, this.height);
  }

  setPixel = (x: number, y: number, color: Color) => {
    const { renderBuffer: imageData, width } = this;
    const { r, g, b, a } = color;
    const index = y * (width * 4) + x * 4;
    imageData.data[index] = ~~(r * 255);
    imageData.data[index+1] = ~~(g * 255);
    imageData.data[index+2] = ~~(b * 255);
    imageData.data[index+3] = ~~(a * 255);
  }

  saveImage() {
    const { width, height } = this;
    const image: Image = new Image(width, height);

    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        const color = image.getPixel(x, y);
        image.setPixel(x, y, color);
      }
    }
    return image;
  }

  // shadeNormal({ intersection, volume }: { intersection: Intersection, volume: Volume }): Color {
  //   const v = intersection.normal.add(1).multiply(.5);
  //   return vectorToColor(v);
  // }

  getColorForRay(ray: Ray, depth: number = 0): Color {
    const { scene } = this;
    const { background } = scene;

    const { intersection, volume } = scene.hit(ray, T_MIN, T_MAX);
    if (intersection != null) {
      let color: Color = null;
      if (depth >= MAX_RAY_DEPTH) {
        return new Color(0, 0, 0, 1);
      }
      // color = this.shadeNormal({ intersection, volume });
      // const origin = intersection.point;
      // const target = origin.add(intersection.normal).add(Vector3.randomDirection());
      // const direction = target.subtract(origin);

      // let colorV: Vector3 = colorToVector(this.getColorForRay(new Ray(origin, direction)));
      // colorV = colorV.multiply(.5)
      //   // .add(colorToVector(color).multiply(.5));
      // color = vectorToColor(colorV);

      if (volume.material) {
        const { attenuation, bounceRay } = volume.material.bounce({ ray, intersection });
        if (bounceRay) {
          color = this.getColorForRay(bounceRay, depth + 1)//.toVector().multiply(attenuation.toVector()).toColor();
          return color.toVector().multiply(attenuation.toVector()).toColor();
        }
        return attenuation;
      }
      return new Color(0, 0, 0, 1);
    }
    return background.getColor(ray);
  }

  antialiasForXY(x, y, { numSamples = 10, blurRadius = 1, isUniform = false } = {}): Color {
    let colorV: Vector3 = new Vector3(0,0,0);

    for (let s = 0; s < numSamples; s++) {
      const angleVal = isUniform ? s / numSamples: Math.random();
      const sampleAngle = angleVal * Math.PI * 2;
      const resultV: Color = this.getColorForXY(
        (x + Math.cos(sampleAngle) * blurRadius),
        (y + Math.sin(sampleAngle) * blurRadius)
      );
      colorV = new Vector3(resultV.r, resultV.g, resultV.b).add(colorV);
    }
    colorV = colorV.divide(numSamples);
    return vectorToColor(colorV);
  }

  correctGamma(color: Color): Color {
    return vectorToColor(new Vector3(Math.sqrt(color.r), Math.sqrt(color.g), Math.sqrt(color.b)));
  }

  getColorForXY(x, y): Color {
    const { width, height, camera } = this;
    const u = x / width;
    const v = y / height;
    const ray = camera.getRay(u, v);
    return this.getColorForRay(ray);
  }

  render = ({ antialias = null } = {}) => {
    const { ctx, renderBuffer, width, height } = this;

    const renderXY = antialias ? (x, y) => this.antialiasForXY(x, y, { ...antialias }) : (x, y) => this.getColorForXY(x, y);

    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        let color: Color = renderXY(x, y);

        color = this.correctGamma(color);
        // TODO: do this conversion, ensure right side up
        this.setPixel(x, height - 1 - y, color);
      }
    }
    ctx.putImageData(renderBuffer, 0, 0);
  }
}
