import Vector3 from 'vector-3';
import { Color } from './Color';

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

  setPixel = (x: number, y: number, color: Color) => {
    const { imageData, width } = this;
    const { r, g, b, a } = color;
    const index = y * (width * 4) + x * 4;
    imageData.data[index] = ~~(r * 255);
    imageData.data[index+1] = ~~(g * 255);
    imageData.data[index+2] = ~~(b * 255);
    imageData.data[index+3] = ~~(a * 255);
  }

  render = (pixels) => {
    const { ctx, imageData } = this;
    const height = pixels.length;
    const width = pixels[0].length;
    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        const color = pixels[y][x];
        this.setPixel(x, y, color);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
