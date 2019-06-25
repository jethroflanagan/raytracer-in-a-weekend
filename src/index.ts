import { Scene } from './Scene';
import { FlatBackground } from './FlatBackground';
import { Vector3 } from './Vector';;
import { Color } from './Color';
import { Renderer } from './Renderer';
import { Image } from './Image';
import { Ray } from './Ray';
import { Sphere } from './Sphere';
import { Camera, RenderTarget } from './Camera';
const canvas = document.getElementById('render');

const width = canvas.width;
const height = canvas.height;

// TODO: add to scene and move render code into renderer
function createScene() {
  // const aspectRatio = width / height;

  // const image = new Image(width, height);

  const renderTarget: RenderTarget = <RenderTarget>{
    width: width / 100,
    height: height / 100,
    depth: 1,
  };
  const origin = new Vector3(0,0,0);
  const camera: Camera = new Camera(origin, renderTarget);

  const background = new FlatBackground();
  const sphere = new Sphere(new Vector3(0, 0, -2), 1.5);
  const sphere2 = new Sphere(new Vector3(0.5, 0, -1), .5);

  const scene = new Scene();
  scene.addBackground(background);
  scene.addChild(sphere, { name: '1' });
  scene.addChild(sphere2, { name: '2' });

  const renderer = new Renderer({ canvas, camera, scene });

  renderer.render();
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
