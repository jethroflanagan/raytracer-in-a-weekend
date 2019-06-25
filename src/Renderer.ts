import { Color } from './Color';
import { Image } from './Image';
import { Camera } from './Camera';
import { Scene } from './Scene';
import { Vector3 } from './Vector';
import { Volume } from './Volume';
import { Intersection } from './Intersection';
import { Ray } from './Ray';

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

  shadeNormal({ intersection, volume }: { intersection: Intersection, volume: Volume }): Color {
    const v = intersection.normal.add(1).multiply(.5);
    return <Color>{
      r: v.x,
      g: v.y,
      b: v.z,
      a: 1,
    }
  }

  shade(ray: Ray): Color {
    const { scene } = this;
    const { background } = scene;
    let color: Color = null;

    const { intersection, volume } = scene.hit(ray, 0, Infinity);
    if (intersection != null && intersection.t > 0) {
      color = this.shadeNormal({ intersection, volume });
    }
    else {
      color = background.getColor(ray);
    }
    return color;
  }

  antialiasForXY(x, y, { numSamples = 10, blurSize = 1, isUniform = false } = {}): Color {
    let colorV: Vector3 = new Vector3(0,0,0);

    for (let s = 0; s < numSamples; s++) {
      const angleVal = isUniform ? s / numSamples: Math.random();
      const sampleAngle = angleVal * Math.PI * 2;
      const resultV: Color = this.getColorForXY(
        (x + Math.cos(sampleAngle) * blurSize),
        (y + Math.sin(sampleAngle) * blurSize)
      );
      colorV = new Vector3(resultV.r, resultV.g, resultV.b).add(colorV);
    }
    colorV = colorV.divide(numSamples);
    return <Color>{
      r: colorV.x,
      g: colorV.y,
      b: colorV.z,
      a: 1,
    };
  }

  getColorForXY(x, y): Color {
    const { width, height, camera } = this;
    const u = x / width;
    const v = y / height;
    const ray = camera.getRay(u, v);
    return this.shade(ray);
  }

  render = () => {
    const { ctx, renderBuffer, width, height, camera, scene } = this;
    const { background } = scene;
    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        // let color = this.getColorForXY(x, y);
        let color = this.antialiasForXY(x, y, { isUniform: true });

        // TODO: do this conversion, ensure right side up
        this.setPixel(x, height - 1 - y, color);
      }
    }
    ctx.putImageData(renderBuffer, 0, 0);
  }
}
