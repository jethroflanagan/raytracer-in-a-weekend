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
  const sphere = new Sphere({ center: new Vector3(0, 0, -2), radius: 1.5, material: new MetalMaterial(new Color(1,1,1), 0.9), });
  const sphere2 = new Sphere({ center: new Vector3(.5, -1, -1), radius: .5, material: new LambertMaterial(new Color(.9, .34, .54)) });
  const sphere3 = new Sphere({ center: new Vector3(0, -101.5, -2), radius: 100, material: new NormalMaterial() });

  const scene = new Scene();
  scene.addBackground(background);
  scene.addChild(sphere, { name: '1' });
  scene.addChild(sphere2, { name: '2' });
  scene.addChild(sphere3, { name: 'ground' });

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
