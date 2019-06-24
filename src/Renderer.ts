import Vector3 from 'vector-3';
import { Color } from './Color';
import { Image } from './Image';
import { Ray } from './Ray';

// RHS camera (y up, x right, negative z into screen)
export class Renderer {
  private ctx = null;
  private imageData = null;
  private width: number = 0;
  private height: number = 0;

  constructor(private canvas) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.imageData = this.ctx.createImageData(this.width, this.height);
  }

  getColor(ray: Ray) {
  }

  setPixel = (x: number, y: number, color: Color) => {
    const { imageData, width } = this;
    const { r, g, b, a } = color;
    const index = y * (width * 4) + x * 4;
    imageData.data[index] = ~~(r * 255);
    imageData.data[index+1] = ~~(g * 255);
    imageData.data[index+2] = ~~(b * 255);
    imageData.data[index+3] = ~~(a * 255);
  }

  render = (image: Image) => {
    const { ctx, imageData } = this;
    const { width, height } = image;
    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        const color = image.getPixel(x, y);
        this.setPixel(x, y, color);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
