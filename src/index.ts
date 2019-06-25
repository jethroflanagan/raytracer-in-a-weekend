import { FlatBackground } from './FlatBackground';
import { Vector3 } from './Vector';;
import { Color } from './Color';
import { Renderer } from './Renderer';
import { Image } from './Image';
import { Ray } from './Ray';
import { Sphere } from './Sphere';
import { Camera, RenderTarget } from './Camera';
const canvas = document.getElementById('render');

const renderer = new Renderer(canvas);
const width = canvas.width;
const height = canvas.height;

// TODO: add to scene and move render code into renderer
function createScene() {
  const aspectRatio = width / height;

  const image = new Image(width, height);

  const renderTarget: RenderTarget = <RenderTarget>{
    width: width / 100,
    height: height / 100,
    depth: 1,
  };
  const origin = new Vector3(0,0,0);
  const camera: Camera = new Camera(origin, renderTarget);

  const background = new FlatBackground();
  const sphere = new Sphere(new Vector3(0, 0, -1), .75);

  for (let y: number = 0; y < height; y++) {
    for (let x: number = 0; x < width; x++) {

      let color = null;
      // TODO: do this conversion properly
      const u = x / width;
      const v = y / height;
      const ray = camera.getRay(u, v);

      const intersection = sphere.hit(ray, 0, Infinity);
      if (intersection != null && intersection.t > 0) {
        const N: Vector3 = ray.pointAtParameter(intersection.t).subtract(sphere.center).unit();
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

      // TODO: do this conversion
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
