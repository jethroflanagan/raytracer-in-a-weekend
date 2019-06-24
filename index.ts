import Vector3 from 'vector-3';
import { Color } from './Color';
import { Renderer } from './Renderer';

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

  setPixel(x: number, y: number, color: Color) {
    const { imageData, width } = this;
    const { r, g, b, a } = color;
    const index = y * (width * 4) + x * 4;
    imageData.data[index] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
  }

  render(pixels) {
    const { ctx, imageData } = this;
    const height = 10;//pixels.length;
    const width = 10;//pixels[0].length;
    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        const color = pixels[y][x];
        this.setPixel(x, y, color);
        console.log(color);
      }
    }
  console.log(imageData[0]);
    ctx.putImageData(imageData, 0, 0);
  }
}