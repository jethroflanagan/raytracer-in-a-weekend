import { Color } from './Color';

export class Image {
  private pixels: Color[][] = null;
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.pixels = [];
    for(let y: number = 0; y < height; y++) {
      this.pixels[y] = [];
      for(let x: number = 0; x < width; x++) {
          this.pixels[y][x] = new Color();
      }
    }
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  setPixel(x, y, color) {
    this.pixels[y][x] = color;
  }

  getPixel(x, y) {
    return this.pixels[y][x];
  }

}
