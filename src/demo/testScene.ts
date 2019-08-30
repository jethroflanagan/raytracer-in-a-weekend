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
import { Plane } from 'src/volume/Plane';
import { Box } from 'src/volume/Box';
import { Translate } from 'src/volume/transform/Translate';
import { Rotate } from 'src/volume/transform/Rotate';

export function create({ aspectRatio, width, height }) {
  const cameraOrigin = new Vector3(10, 6, -30);
  const cameraTarget = new Vector3(0, 0, 0);
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
  // const sphere = new Sphere({
  //   center: new Vector3(-3, 3.5 / 2, -30),
  //   radius: 3.5,
  //   material: new MetalMaterial({ albedo: new ColorTexture(new Color(1, 1, 1)), reflectance: 1, fuzziness: 0 }),
  // });

  const ground = new Box({
    center: new Vector3(0, -1, -30),
    dimensions: new Vector3(100, 2, 100),
    material: new LambertMaterial({
      albedo: new ColorTexture(new Color(.7, .3, .1)),
    }),
  });
  // const sphere4 = new Sphere({
  //   center: new Vector3(5.5, 2, -20),
  //   radius: 2,
  //   material: new LambertMaterial({
  //     albedo: new CheckerTexture({
  //       even: new ColorTexture(new Color(.5, .8, .5)),
  //       odd: new ColorTexture(new Color(.8, .1, .3)),
  //       size: .3,
  //     })
  //   }),
  // });
  // const sphere5 = new Sphere({
  //   center: new Vector3(4.5, 2.5, -40),
  //   radius: 2.5,
  //   material: new LambertMaterial({ albedo: new ColorTexture(new Color(.1, .34, .94)) }),
  // });
  // const sphere6 = new Sphere({
  //   center: new Vector3(-14.5, 4, -40),
  //   radius: 2.5,
  //   material: new MetalMaterial({ albedo: new ColorTexture(new Color(0, 1, 1)), reflectance: 1, fuzziness: 0 }),
  // });

  const box = new Box({
    center: new Vector3(0, 0, 0),
    dimensions: new Vector3(5, 2, 3),
    material: new LambertMaterial({
      albedo: new ColorTexture(new Color(.9, .8, .1)),
    }),
  });
  const box2 = new Box({
    center: new Vector3(-5, .5, -4),
    dimensions: new Vector3(5, 1, 3),
    material: new LambertMaterial({
      albedo: new ColorTexture(new Color(0, 1, .1)),
    }),
  });

  const scene = new Scene();
  scene.addBackground(background);
  scene.setActiveCamera(camera);

  scene.addChild(ground);
  // scene.addChild(sphere);
  // scene.addChild(sphere4);
  // scene.addChild(sphere5);
  // scene.addChild(sphere6);
  scene.addChild(box2);
  scene.addChild(
      new Rotate(box, 90, 'y'),
  );

  return { scene, camera };
}
