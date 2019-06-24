import Vector3 from 'vector-3';
import { Color } from './Color';
import { Renderer } from './Renderer';

const canvas = document.getElementById('render');

const renderer = new Renderer(canvas);
const width = canvas.width;
const height = canvas.height;
const image = [];

for (let y: number = 0; y < height; y++) {
  image.push([]);
  const row = image[y];

  for (let x: number = 0; x < width; x++) {
    const color = <Color>{
      r: x / width,
      g: y / height,
      b: .2,
      a: 1,
    };
    row.push(color);
  }
}

renderer.render(image);
