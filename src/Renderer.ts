import { Color } from './Color';
import { Image } from './Image';
import { Camera } from './Camera';
import { Scene } from './Scene';
import { Vector3 } from './Vector';
import { Volume } from './Volume';
import { Intersection } from './Intersection';

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

  render = () => {
    const { ctx, renderBuffer, width, height, camera, scene } = this;
    const { background } = scene;
    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        let color = null;
        // TODO: do this conversion properly
        const u = x / width;
        const v = y / height;
        const ray = camera.getRay(u, v);
    
        const { intersection, volume } = scene.hit(ray, 0, Infinity);
        if (intersection != null && intersection.t > 0) {
          color = this.shadeNormal({ intersection, volume });
        }
        else {
          color = background.getColor(ray);
        }

        // TODO: do this conversion, ensure right side up
        this.setPixel(x, height - 1 - y, color);
      }
    }
    ctx.putImageData(renderBuffer, 0, 0);
  }
}
