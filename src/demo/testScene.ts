import { Color } from 'src/Color';
import { DialectricMaterial } from 'src/material/DialectricMaterial';
import { FlatMaterial } from 'src/material/FlatMaterial';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { MetalMaterial } from 'src/material/MetalMaterial';
import { NormalMaterial } from 'src/material/NormalMaterial';
import { Camera } from 'src/scene/Camera';
import { FlatBackground } from 'src/scene/FlatBackground';
import { Scene } from 'src/scene/Scene';
import { CheckerTexture } from 'src/texture/CheckerTexture';
import { ColorTexture } from 'src/texture/ColorTexture';
import { Vector3 } from 'src/Vector';
import { Sphere } from 'src/volume/Sphere';

export function create({ aspectRatio, width, height }) {
  const cameraOrigin = new Vector3(10,1,0);
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
    shutterOpenTime: 0,
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
    material: new DialectricMaterial({ albedo: new Color(1, 1, 1), reflectance: 0, fuzziness: 0, refractiveIndex: 1.5 }),
  });
  const sphere2 = new Sphere({
    center: new Vector3(.5, -2.2, -20),
    radius: 1,
    material: new LambertMaterial({ albedo: new ColorTexture(new Color(.9, .34, .54)) }),
  });
  const ground = new Sphere({
    center: new Vector3(0, -100, -50),
    radius: 100,
    material: new LambertMaterial({
      albedo: new CheckerTexture({
        even: new ColorTexture(new Color(.5, .8,.5)),
        odd: new ColorTexture(new Color(.8, .1,.3)),
        size: 2,
      })
    }),
  });
  const sphere4 = new Sphere({
    center: new Vector3(5.5, .1, -20), 
    radius: 2, 
    material: new NormalMaterial(),
  });
  const sphere5 = new Sphere({
    center: new Vector3(4.5, 2, -40),
    radius: 2.5, 
    material: new LambertMaterial({ albedo: new ColorTexture(new Color(.1, .34, .94)) }),
  });
  const sphere6 = new Sphere({
    center: new Vector3(-10.5, 2, -40),
    radius: 2.5, 
    material: new FlatMaterial({ albedo: new Color(.8, .34, .94) }),
  });

  const scene = new Scene();
  scene.addBackground(background);
  scene.setActiveCamera(camera);

  scene.addChild(sphere, { name: '1' });
  scene.addChild(sphere2, { name: '2' });
  scene.addChild(ground, { name: 'ground' });
  scene.addChild(sphere4, { name: '4' });
  scene.addChild(sphere5, { name: '5' });
  scene.addChild(sphere6, { name: '6' });
  scene.addChild(sphere7, { name: '7' });

  return { scene, camera };
}
