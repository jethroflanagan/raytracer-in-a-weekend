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
import { randomInUnitSphere } from './utils';
const canvas = document.getElementById('render');

const width = canvas.width;
const height = canvas.height;

// TODO: add to scene and move render code into renderer
function createScene() {
  const aspectRatio = height / width;

  // const image = new Image(width, height);
  const renderWidth = 200;
  const renderTarget: RenderTarget = <RenderTarget>{
    width: renderWidth,
    height: renderWidth * aspectRatio,
    depth: renderWidth * 1.5,
  };// FOV?
  const origin = new Vector3(0,0,0);
  const camera: Camera = new Camera(origin, renderTarget);

  const background = new FlatBackground();
  const sphere = new Sphere({
    center: new Vector3(-3, -.5, -35),
    radius: 3.5,
    material: new MetalMaterial({ albedo: new Color(.5,.5,.5), reflectance: .8, fuzziness: 0.1 }),
  });
  const sphere2 = new Sphere({ center: new Vector3(.5, -1, -10), radius: .5, material: new LambertMaterial(new Color(.9, .34, .54)) });
  const sphere3 = new Sphere({ center: new Vector3(0, -100, -50), radius: 100, material: new LambertMaterial(new Color(.5, .8,.5)) });
  const sphere4 = new Sphere({ center: new Vector3(5.5, .1, -20), radius: 2, material: new NormalMaterial(new Color(.5, .2,.5)) });
  const sphere5 = new Sphere({ center: new Vector3(4.5, 2, -40), radius: 2.5, material: new LambertMaterial(new Color(.1, .34, .94)) });

  const scene = new Scene();
  scene.addBackground(background);
  scene.addChild(sphere, { name: '1' });
  scene.addChild(sphere2, { name: '2' });
  scene.addChild(sphere3, { name: 'ground' });
  scene.addChild(sphere4, { name: '4' });
  scene.addChild(sphere5, { name: '5' });

  const renderer = new Renderer({ canvas, camera, scene });

  // renderer.render({ antialias: { numSamples: 5, blurRadius: 1, isUniform: true } });
  renderer.render();
}



// function lerp(start, end, t) {
//   return (1 - t) * start + t * end;
// }

createScene();
