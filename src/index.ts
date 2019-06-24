import { Color } from './Color';
import { Renderer } from './Renderer';
import { Image } from './Image';

const canvas = document.getElementById('render');

const renderer = new Renderer(canvas);
const width = canvas.width;
const height = canvas.height;
const image = new Image(width, height);

for (let y: number = 0; y < height; y++) {
  for (let x: number = 0; x < width; x++) {
    const color = <Color>{
      r: x / width,
      g: y / height,
      b: .2,
      a: 1,
    };
    image.setPixel(x, y, color);
  }
}

renderer.render(image);
