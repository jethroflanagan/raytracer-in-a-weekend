import { Vector3 } from './Vector';;
import { Color } from './Color';
import { Renderer } from './Renderer';
import { Image } from './Image';
import { Ray } from './Ray';
const canvas = document.getElementById('render');

const renderer = new Renderer(canvas);
const width = canvas.width;
const height = canvas.height;

function createScene() {
  const image = new Image(width, height);

  const origin = new Vector3(0,1,0);
  const lowerLeftCorner = new Vector3(-2,-1,-1);
  const horizontal = new Vector3(4, 0, 0);
  const vertical = new Vector3(0,2,0);

  for (let y: number = 0; y < height; y++) {
    for (let x: number = 0; x < width; x++) {

      const ray = new Ray(origin,
        lowerLeftCorner
        .add(horizontal.multiply(x / width))
        .add(vertical.multiply(y / height)));
      const color = getPlaneColor(ray);

      image.setPixel(x, height - 1 - y, color);
    }
  }
  renderer.render(image);
}

function getPlaneColor(ray: Ray) {
  const unitDirection = ray.direction.divide(ray.direction.length());
  const t = (unitDirection.y + 1) * .5;
  // console.log(unitDirection.y, t);
  const result = Vector3.lerp(
    new Vector3(1, 1, 1),
    new Vector3(.5, .7, 1),
    t);

  return <Color>{
    r: result.x,
    g: result.y,
    b: result.z,
    a: 1,
  };
}

function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}

createScene();


console.log( getPlaneColor(
  new Ray(new Vector3(0, 0, 0), new Vector3(-2, 1, -1))
));
console.log( getPlaneColor(
  new Ray(new Vector3(0, 0, 0), new Vector3(2, 0, -1))
));
console.log( getPlaneColor(
  new Ray(new Vector3(0, 0, 0), new Vector3(2, -1, -1))
));
