import { Animator } from './../animation/Animator';
import { Color } from 'src/Color';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { Camera } from 'src/scene/Camera';
import { FlatBackground } from 'src/scene/FlatBackground';
import { Scene } from 'src/scene/Scene';
import { Vector3 } from 'src/Vector';
import { Sphere } from 'src/volume/Sphere';
import { DialectricMaterial } from 'src/material/DialectricMaterial';
import { placeSphereOnSurfaceFromPosition, random } from 'src/utils/math';
import { NormalMaterial } from 'src/material/NormalMaterial';
import { ColorTexture } from 'src/texture/ColorTexture';
import { NoiseTexture } from 'src/texture/NoiseTexture';

const setupPlaceOnSurface = ({ surfaceCenter, surfaceRadius }) => ({ from, sphereRadius }) => {
  return placeSphereOnSurfaceFromPosition({ from, surfaceCenter, sphereRadius, surfaceRadius });
}

export function create({ aspectRatio, width, height }) {
  const scene = new Scene();


  const background = new FlatBackground();

  const groundSize = 1000;
  const groundCenter = new Vector3(0, -groundSize - 1.5, 0);
  const ground = new Sphere({
    center: groundCenter,
    radius: groundSize,
    // material: new LambertMaterial({ albedo: new ColorTexture(new Color(.1, .8, .3)) }),
    material: new LambertMaterial({ albedo: new NoiseTexture() }),
  });

  const placeOnGround = setupPlaceOnSurface({ surfaceCenter: groundCenter, surfaceRadius: groundSize });

  const sphere = new Sphere({
    center: placeOnGround({ from: new Vector3(-3, 0, -12), sphereRadius: 2.5 }),
    radius: 2.5,
    material: new LambertMaterial({ albedo: new ColorTexture(new Color(random(), random(), random())) }),
  });
  const sphere2 = new Sphere({
    center: placeOnGround({ from: new Vector3(3, 3, -12), sphereRadius: 1 }),
    radius: 1.0,
    // material: new LambertMaterial({ albedo: new ColorTexture(new Color(random(), random(), random())) }),
    material: new LambertMaterial({ albedo: new NoiseTexture() }),
  });
  const glassSphere = new Sphere({
    center: placeOnGround({ from: new Vector3(1, 0, -10), sphereRadius: 1.5 }),
    radius: 1.5,
    material: new DialectricMaterial({ refractiveIndex: 1.4 }),
  });
  const sphereNormal = new Sphere({
    center: placeOnGround({ from: new Vector3(0, 0, -8), sphereRadius: .7 }),
    radius: .7,
    material: new NormalMaterial({ allowShadows: true }),
  });

  const cameraOrigin = new Vector3(5,1,0);
  const cameraTarget = glassSphere.center;
  const focalDistance = cameraTarget.subtract(cameraOrigin).length();
  const camera: Camera = new Camera({
    origin: cameraOrigin,
    aspectRatio,
    verticalFOV: 30,
    lookAt: cameraTarget,
    // up: new Vector3(1, 0, 1),
    aperture: 0,
    focalDistance,
    shutterOpenTime: 0,
  });

  scene.setActiveCamera(camera);
  scene.addBackground(background);
  scene.addChild(ground);
  scene.addChild(sphere);
  scene.addChild(sphere2);
  scene.addChild(glassSphere);
  scene.addChild(sphereNormal);

  return { scene, camera };
}
