import { Color } from 'src/Color';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { Camera } from 'src/scene/Camera';
import { FlatBackground } from 'src/scene/FlatBackground';
import { Scene } from 'src/scene/Scene';
import { ColorTexture } from 'src/texture/ColorTexture';
import { Vector3 } from 'src/Vector';
import { Box } from 'src/volume/Box';
import { Box2 } from 'src/volume/Box2';
import { Translate } from 'src/volume/transform/Translate';
import { Sphere } from 'src/volume/Sphere';
import { MetalMaterial } from 'src/material/MetalMaterial';

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
  const sphere = new Sphere({
    center: new Vector3(-2.5, 0, -4),
    radius: 2.5,
    material: new LambertMaterial({ albedo: new ColorTexture(new Color(0, 1, 1)) }),
  });

  const box = new Box({
    center: new Vector3(0, 0, 0),
    dimensions: new Vector3(5, 2, 3),
    material: new LambertMaterial({
      albedo: new ColorTexture(new Color(.9, .8, .1)),
    }),
  });
  // const box2 = new Box2({
  //   center: new Vector3(-5, .5, -4),
  //   dimensions: new Vector3(5, 1, 3),
  //   material: new LambertMaterial({
  //     albedo: new ColorTexture(new Color(0, 1, .1)),
  //   }),
  // });

  const scene = new Scene();
  scene.addBackground(background);
  scene.setActiveCamera(camera);

  // scene.addChild(ground);
  scene.addChild(
    new Translate(sphere, new Vector3(0, 2.5, 0))
  );
  // scene.addChild(sphere4);
  // scene.addChild(sphere5);
  // scene.addChild(sphere6);
  // scene.addChild(box2);
  // scene.addChild(
  //     // new Rotate(box, 10, 'y'),
  //     // new Translate(box, new Vector3(0, 1, 0))
  //     box,
  // );

  return { scene, camera };
}
