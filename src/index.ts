import { Camera, RenderTarget } from './Camera';
import { Color } from './Color';
import { FlatBackground } from './FlatBackground';
import { LambertMaterial } from './materials/LambertMaterial';
import { MetalMaterial } from './materials/MetalMaterial';
import { NormalMaterial } from './materials/NormalMaterial';
import { Renderer } from './Renderer';
import { Scene } from './Scene';
import { Sphere } from './Sphere';
import { Vector3 } from './Vector';
import "./style.css";
import { FlatMaterial } from './materials/FlatMaterial';

// TODO: add to scene and move render code into renderer
function createScene(canvas) {
  const width = canvas.width;
  const height = canvas.height;
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
    center: new Vector3(-3, -.5, -30),
    radius: 3.5,
    material: new MetalMaterial({ albedo: new Color(1,1,1), reflectance: 1, fuzziness: 0 }),
  });
  const sphereMetal = new Sphere({
    center: new Vector3(3, -.5, -30),
    radius: 1.5,
    material: new MetalMaterial({ albedo: new Color(1,.5,0), reflectance: 1, fuzziness: 1 }),
  });
  const sphere2 = new Sphere({ center: new Vector3(.5, -2.2, -20), radius: 1, material: new LambertMaterial(new Color(.9, .34, .54)) });
  const sphere3 = new Sphere({ center: new Vector3(0, -100, -50), radius: 100, material: new LambertMaterial(new Color(.5, .8,.5)) });
  const sphere4 = new Sphere({ center: new Vector3(5.5, .1, -20), radius: 2, material: new NormalMaterial(new Color(.5, .2,.5)) });
  const sphere5 = new Sphere({ center: new Vector3(4.5, 2, -40), radius: 2.5, material: new LambertMaterial(new Color(.1, .34, .94)) });
  const sphere6 = new Sphere({ center: new Vector3(-10.5, 2, -40), radius: 2.5, material: new FlatMaterial(new Color(.8, .34, .94)) });

  const scene = new Scene();
  scene.addBackground(background);
  scene.addChild(sphere, { name: '1' });
  scene.addChild(sphere2, { name: '2' });
  scene.addChild(sphere3, { name: 'ground' });
  scene.addChild(sphere4, { name: '4' });
  scene.addChild(sphere5, { name: '5' });
  scene.addChild(sphere6, { name: '6' });
  scene.addChild(sphereMetal, { name: '7' });

  const renderer = new Renderer({ canvas, camera, scene });

  // renderer.render({ antialias: { numSamples: 5, blurRadius: 1, isUniform: true } });
  renderer.render();
}



// function lerp(start, end, t) {
//   return (1 - t) * start + t * end;
// }

function render(numSamples=1) {
  console.time('sampleRender')
  createScene(document.getElementById('render'));
  for(let i = 2; i <= numSamples; i++) {
    createScene(document.getElementById('render' + i));
  }
  console.timeEnd('sampleRender')
}

render(1);
