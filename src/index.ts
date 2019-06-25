import { Scene } from './Scene';
import { FlatBackground } from './FlatBackground';
import { Vector3 } from './Vector';;
import { Color } from './Color';
import { Renderer } from './Renderer';
import { Image } from './Image';
import { Ray } from './Ray';
import { Sphere } from './Sphere';
import { Camera, RenderTarget } from './Camera';
import { NormalMaterial } from './materials/NormalMaterial';
import { LambertMaterial } from './materials/LambertMaterial';
import { MetalMaterial } from './materials/MetalMaterial';
const canvas = document.getElementById('render');

const width = canvas.width;
const height = canvas.height;

// TODO: add to scene and move render code into renderer
function createScene() {
  const aspectRatio = height / width;

  // const image = new Image(width, height);
  const renderWidth = 300;
  const renderTarget: RenderTarget = <RenderTarget>{
    width: renderWidth,
    height: renderWidth * aspectRatio,
    depth: renderWidth * 1.5,
  };// FOV?
  const origin = new Vector3(0,0,0);
  const camera: Camera = new Camera(origin, renderTarget);

  const background = new FlatBackground();
  const sphere = new Sphere({
    center: new Vector3(-1, 0, -15),
    radius: 1.5,
    material: new MetalMaterial({ albedo: new Color(1,1,1), reflectance: 1, fuzziness: 0.1 }),
  });
  const sphere2 = new Sphere({ center: new Vector3(.5, -1, -10), radius: .5, material: new LambertMaterial(new Color(.9, .34, .54)) });
  const sphere3 = new Sphere({ center: new Vector3(0, -100, -50), radius: 100, material: new NormalMaterial() });
  const sphere4 = new Sphere({ center: new Vector3(5.5, .1, -20), radius: 2, material: new NormalMaterial() });

  const scene = new Scene();
  scene.addBackground(background);
  scene.addChild(sphere, { name: '1' });
  scene.addChild(sphere2, { name: '2' });
  scene.addChild(sphere3, { name: 'ground' });
  scene.addChild(sphere4, { name: '3' });

  const renderer = new Renderer({ canvas, camera, scene });

  // renderer.render({ antialias: { numSamples: 5, blurRadius: 1, isUniform: true } });
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
