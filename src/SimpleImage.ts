import { Color } from 'src/Color';

export class SimpleImage {
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

  static fromCanvas(canvas, x: number = 0, y: number = 0, width: number = null, height: number = null ) {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    if (!width) {
      width = canvas.width;
    }
    if (!height) {
      height = canvas.height;
    }
    const image = new SimpleImage(width - x, height - y);
    const { data } = ctx.getImageData(x, y, width, height);
    for (let i = x * y * 4, len = data.length; i < len; i += 4) {
      const xPos = Math.floor(i / 4) % width;
      const yPos = Math.floor(i / 4 / width);
      // map rgb [0, 255] => [0, 1]
      const color = new Color(data[i] / 255, data[i+1] / 255, data[i+2] / 255); // ignore alpha
      image.setPixel(xPos, yPos, color);
    }
    return image;
  }

  static load(imagePath): Promise<SimpleImage> {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const simpleImage = SimpleImage.fromCanvas(canvas);
        resolve(simpleImage);
      };
      img.src = imagePath;
    });
  }

}
