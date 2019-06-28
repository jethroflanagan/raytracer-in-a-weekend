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
import { Ray } from './Ray';

// TODO: add to scene and move render code into renderer
function render(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const aspectRatio = width / height;


  // const { scene, camera } = createDemoScene({ aspectRatio, width, height });
  // const { scene, camera } = createTestScene({ aspectRatio, width, height });
  const { scene, camera } = createComplexScene({ aspectRatio, width, height });
  const renderer = new Renderer({ canvas, camera, scene });

  renderer.render({
    antialias: { numSamples: 5, blurRadius: .5, isUniform: true },
    quality: 20,
  });
  // renderer.render({ quality: 1 });
}

function createDemoScene({ aspectRatio, width, height }) {
  const scene = new Scene();
  const cameraOrigin = new Vector3(0,0,0);
  const cameraTarget = new Vector3(0, 0, -30);
  const focalDistance = cameraTarget.subtract(cameraOrigin).length();
  const camera: Camera = new Camera({
    origin: cameraOrigin,
    aspectRatio,
    verticalFOV: 30,
    lookAt: cameraTarget,
    // up: new Vector3(1, 0, 1),
    aperture: 0,
    focalDistance,
  });

  const background = new FlatBackground();
  const sphere = new Sphere({
    center: new Vector3(0, 0, -3),
    radius: .5,
    material: new LambertMaterial({ albedo: new Color(1, .5, 0) }),
  });
  // const sphere = new Sphere({
  //   center: new Vector3(0, 0, -3),
  //   radius: .5,
  //   material: new NormalMaterial(),
  // });


  const groundSize = 1000;
  const ground = new Sphere({
    center: new Vector3(0, -groundSize - .5, 0),
    radius: groundSize,
    material: new LambertMaterial({ albedo: new Color(.1, .8, .3) }),
  });
  scene.addChild(ground);

  scene.addBackground(background);
  scene.addChild(sphere);

  return { scene, camera };
}


function createTestScene({ aspectRatio, width, height }) {
  const cameraOrigin = new Vector3(10,10,0);
  const cameraTarget = new Vector3(0, 0, -30);
  const focalDistance = cameraTarget.subtract(cameraOrigin).length();
  const camera: Camera = new Camera({
    origin: cameraOrigin,
    aspectRatio,
    verticalFOV: 30,
    lookAt: cameraTarget,
    // up: new Vector3(1, 0, 1),
    aperture: 0,//1,
    focalDistance,
  });

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

  return { scene, camera };
}

function createComplexScene({ aspectRatio, width, height }) {
  const cameraOrigin = new Vector3(0,10,0);
  const cameraTarget = new Vector3(0, 0, -30);
  const focalDistance = cameraTarget.subtract(cameraOrigin).length();
  const camera: Camera = new Camera({
    origin: cameraOrigin,
    aspectRatio,
    verticalFOV: 30,
    lookAt: cameraTarget,
    // up: new Vector3(1, 0, 1),
    aperture: .2,
    focalDistance,
  });

  const scene = new Scene();

  const background = new FlatBackground();
  scene.addBackground(background);

  const groundCenter = new Vector3(0, -1000, 0);
  const groundSize = 1000;
  const ground = new Sphere({
    center: new Vector3(0, -1000, 0),
    radius: groundSize,
    material: new LambertMaterial({ albedo: new Color(.1, .8, .3) }),
  });
  scene.addChild(ground);

  const positionScale = 1;
  const area = 14;
  const areaStart = 4;
  const getMaterial = () => {
    const pick = Math.random();
    if (pick < .8) {
        return new LambertMaterial({ albedo: new Color(Math.random(), Math.random(), Math.random()) });
    }
    if (pick < .95) {
        return new MetalMaterial({ albedo: new Color(Math.random(), Math.random(), Math.random()), reflectance: 1, fuzziness: 0 });
    }
    return new NormalMaterial();
        // return new LambertMaterial({ albedo: new Color(Math.random(), Math.random(), Math.random()) });
  }
  const positions = [];
  const genPoint = ({ size }) => {
    const angle = Math.random() * Math.PI * 2;
    // const distance = areaStart + size + Math.random() * area;
    const distance = area * Math.sqrt(Math.random()) + areaStart + size;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    return {x, z}
  }
  for (let i = 0; i < 70; i++) {
    const size = .5 + Math.random() * 1;
    // const angle = Math.random() * Math.PI * 2;
    // // const distance = areaStart + size + Math.random() * area;
    // const distance = area * Math.sqrt(Math.random()) + areaStart;
    // const x = Math.cos(angle) * distance;
    // const z = Math.sin(angle) * distance;
    const { x , z } = genPoint({ size })
    // positions.push(
// const scene = createComplexScene();
    let center = new Vector3(x * positionScale, .1, z * positionScale - 28);
    const diff = center.subtract(groundCenter).length() - groundSize  - size;
    let { direction } = new Ray(center, groundCenter);
    direction = direction.unit().multiply(diff);
    center = center.add(direction);
    const sphere5 = new Sphere({
      center: center,
      radius: size,
      material: getMaterial(),//new MetalMaterial({ albedo: new Color(Math.random(), Math.random(), Math.random()), reflectance: 1, fuzziness: 0 }),//new LambertMaterial({ albedo: new Color(Math.random(), Math.random(), Math.random()) }),
    });
    scene.addChild(sphere5);
  }

  const sphere = new Sphere({
    center: new Vector3(-3, 3, -30),
    radius: 3,
    material: new MetalMaterial({ albedo: new Color(1,1,1), reflectance: 1, fuzziness: 0 }),
  });
  scene.addChild(sphere);
  const sphere2 = new Sphere({
    center: new Vector3(2, 3, -22),
    radius: 3,
    material: new MetalMaterial({ albedo: new Color(1,.9,1), reflectance: 1, fuzziness: 0 }),
  });
  scene.addChild(sphere2);
  const sphere3 = new Sphere({
    center: new Vector3(5, 3, -37),
    radius: 3,
    material: new NormalMaterial(),
  });
  scene.addChild(sphere3);

  return { scene, camera };
}

(function run() {
  render(document.getElementById('render'));
})();
