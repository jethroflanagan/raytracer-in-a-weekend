import { FlatBackground } from './FlatBackground';
import { Vector3 } from './Vector';;
import { Color } from './Color';
import { Renderer } from './Renderer';
import { Image } from './Image';
import { Ray } from './Ray';
import { Sphere } from './Sphere';
const canvas = document.getElementById('render');

const renderer = new Renderer(canvas);
const width = canvas.width;
const height = canvas.height;

function createScene() {
  const aspectRatio = width / height;
  const image = new Image(width, height);

  const origin = new Vector3(0,0,0);
  const lowerLeftCorner = new Vector3(-width / 2, -height/2,-100);
  const horizontal = new Vector3(width, 0, 0);
  const vertical = new Vector3(0, height, 0);

  const background = new FlatBackground();
  const sphere = new Sphere(new Vector3(0, 0, -1), .75);

  for (let y: number = 0; y < height; y++) {
    for (let x: number = 0; x < width; x++) {

      let color = null;
      const ray = new Ray(origin,
        lowerLeftCorner
        .add(horizontal.multiply(x / width))
        .add(vertical.multiply(y / height)));

      const t = sphere.getRayIntersections(ray)
      if (t > 0) {
        const N: Vector3 = ray.pointAtParameter(t).subtract(sphere.center).unit();
        let Ncol = N.add(1).multiply(.5);
        color = <Color>{
          r: Ncol.x,
          g: Ncol.y,
          b: Ncol.z,
          a: 1,
        };
      }
      else {
        color = background.getColor(ray);
      }

      image.setPixel(x, height - 1 - y, color);
    }
  }
  renderer.render(image);
}



// function lerp(start, end, t) {
//   return (1 - t) * start + t * end;
// }

createScene();

// const sphere = new Sphere(new Vector3(0, 0, -1), .1);
// const ray = new Ray(
//   new Vector3(0,0,0),
//   new Vector3(2,5,-1)
// );

// console.log(sphere.getRayIntersections(ray));
