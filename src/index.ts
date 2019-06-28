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
import { DialectricMaterial } from './materials/DialectricMaterial';

// TODO: add to scene and move render code into renderer
function render(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const aspectRatio = width / height;

  // const image = new Image(width, height);
  const cameraOrigin = new Vector3(0,10,0);
  const cameraTarget = new Vector3(0, 0, -30);
  const focalDistance = cameraTarget.subtract(cameraOrigin).length();
  const camera: Camera = new Camera({
    origin: cameraOrigin,
    aspectRatio,
    verticalFOV: 30,
    lookAt: cameraTarget,
    // up: new Vector3(1, 0, 1),
    aperture: 2,
    focalDistance,
  });

  const scene = createComplexScene();
  // const scene = createTestScene();
  const renderer = new Renderer({ canvas, camera, scene });

  // renderer.render({
  //   antialias: { numSamples: 10, blurRadius: 1, isUniform: false },
  //   quality: 10,
  // });
  renderer.render({ quality: 1 });
}

function createTestScene() {
  const background = new FlatBackground();
  const sphere = new Sphere({
    center: new Vector3(-3, -.5, -30),
    radius: 3.5,
    material: new MetalMaterial({ albedo: new Color(1,1,1), reflectance: 1, fuzziness: 0 }),
  });
  const sphere7 = new Sphere({
    center: new Vector3(3, -.5, -30),
    radius: 1.5,
    material: new DialectricMaterial({ albedo: new Color(1, 1, 1, 1), reflectance: 0, fuzziness: 0, refractiveIndex: 1.5 }),
  });
  const sphere2 = new Sphere({
    center: new Vector3(.5, -2.2, -20),
    radius: 1,
    material: new LambertMaterial({ albedo: new Color(.9, .34, .54) }),
  });
  const sphere3 = new Sphere({
    center: new Vector3(0, -100, -50),
    radius: 100,
    material: new LambertMaterial({ albedo: new Color(.5, .8,.5) }),
  });
  const sphere4 = new Sphere({
    center: new Vector3(5.5, .1, -20), 
    radius: 2, 
    material: new NormalMaterial(),
  });
  const sphere5 = new Sphere({
    center: new Vector3(4.5, 2, -40),
    radius: 2.5, 
    material: new LambertMaterial({ albedo: new Color(.1, .34, .94) }),
  });
  const sphere6 = new Sphere({
    center: new Vector3(-10.5, 2, -40), 
    radius: 2.5, 
    material: new FlatMaterial({ albedo: new Color(.8, .34, .94)),
  });

  const scene = new Scene();
  scene.addBackground(background);
  scene.addChild(sphere, { name: '1' });
  scene.addChild(sphere2, { name: '2' });
  scene.addChild(sphere3, { name: 'ground' });
  scene.addChild(sphere4, { name: '4' });
  scene.addChild(sphere5, { name: '5' });
  scene.addChild(sphere6, { name: '6' });
  scene.addChild(sphere7, { name: '7' });

  return scene;
}

function createComplexScene() {
  const scene = new Scene();

  const background = new FlatBackground();
  scene.addBackground(background);

  const ground = new Sphere({
    center: new Vector3(0, -1000, 0),
    radius: 1000,
    material: new LambertMaterial({ albedo: new Color(.1, .8, .3) }),
  });
  scene.addChild(ground);

  const scale = 3;
  for (let x = -5; x < 5; x++) {
    for (let y = -5; y < 5; y++) {
      const sphere5 = new Sphere({
        center: new Vector3(Math.random() * 5-2 + x* scale, .3, Math.random() * 5-2 - y* scale-35),
        radius: .3,
        material: new LambertMaterial({ albedo: new Color(Math.random(), Math.random(), Math.random()) }),
      });
      scene.addChild(sphere5);
    }
  }

  const sphere = new Sphere({
    center: new Vector3(-3, 3, -30),
    radius: 3,
    material: new MetalMaterial({ albedo: new Color(1,1,1), reflectance: 1, fuzziness: 0 }),
  });
  scene.addChild(sphere);
  const sphere2 = new Sphere({
    center: new Vector3(2, 3, -25),
    radius: 3,
    material: new DialectricMaterial({ albedo: new Color(1,1,1), reflectance: 1, fuzziness: 0, refractiveIndex: 1.5 }),
  });
  scene.addChild(sphere2);
  const sphere3 = new Sphere({
    center: new Vector3(5, 3, -37),
    radius: 3,
    material: new NormalMaterial(),
  });
  scene.addChild(sphere3);

  return scene;
}

(function run() {
  render(document.getElementById('render'));
})();
