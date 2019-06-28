import { Color } from 'src/Color';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { Camera } from 'src/scene/Camera';
import { FlatBackground } from 'src/scene/FlatBackground';
import { Scene } from 'src/scene/Scene';
import { Vector3 } from 'src/Vector';
import { Sphere } from 'src/volume/Sphere';

export function create({ aspectRatio, width, height }) {
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
