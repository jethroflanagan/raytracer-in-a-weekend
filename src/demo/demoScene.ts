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
import { ImageTexture } from 'src/texture/ImageTexture';
import { SimpleImage } from 'src/SimpleImage';
import earthImageAsset from 'src/demo/earth-map.jpg';
import marsImageAsset from 'src/demo/mars-map.jpg';
import { CheckerTexture } from 'src/texture/CheckerTexture';
import { EmissionMaterial } from 'src/material/EmissionMaterial';
import { Plane } from 'src/volume/Plane';

const setupPlaceOnSurface = ({ surfaceCenter, surfaceRadius }) => ({ from, sphereRadius }) => {
  return placeSphereOnSurfaceFromPosition({ from, surfaceCenter, sphereRadius, surfaceRadius });
}

export async function create({ aspectRatio, width, height }) {
  const scene = new Scene();

  const background = new FlatBackground();

  const groundSize = 1000;
  const groundCenter = new Vector3(0, -groundSize - 1.5, 0);
  const ground = new Sphere({
    center: groundCenter,
    radius: groundSize,
    // material: new LambertMaterial({ albedo: new ColorTexture(new Color(.1, .8, .3)) }),
    material: new LambertMaterial({ albedo: new NoiseTexture({ scale: 1, turbulance: 5 }) }),
  });

  const placeOnGround = setupPlaceOnSurface({ surfaceCenter: groundCenter, surfaceRadius: groundSize });

  const sphere = new Sphere({
    center: placeOnGround({ from: new Vector3(-3, 0, -12), sphereRadius: 2.5 }),
    radius: 2.5,
    material: new LambertMaterial({
      albedo: new CheckerTexture({
        even: new ColorTexture(new Color(random(), random(), random())),
        odd: new ColorTexture(new Color(random(), random(), random())),
        size: .5
     }),
    }),
  });
  const sphere2 = new Sphere({
    center: placeOnGround({ from: new Vector3(3, 3, -12), sphereRadius: 1 }),
    radius: 1.0,
    // material: new LambertMaterial({ albedo: new ColorTexture(new Color(random(), random(), random())) }),
    material: new LambertMaterial({ albedo: new ImageTexture(await SimpleImage.load(earthImageAsset)) }),
  });
  const glassSphere = new Sphere({
    center: placeOnGround({ from: new Vector3(1, 0, -10), sphereRadius: 1.5 }),
    radius: 1.5,
    material: new DialectricMaterial({ refractiveIndex: 1.4 }),
  });
  const sphereLight = new Sphere({
    center: placeOnGround({ from: new Vector3(0, 0, -8), sphereRadius: .7 }),
    radius: .7,
    material: new EmissionMaterial({ albedo: new ColorTexture(new Color(1,1,1)), brightness: 5 }),
  });

  const planeLight = new Plane({ x0: 2, x1: 5, y0: -1, y1: 2, k: -15,
    material: new EmissionMaterial({ albedo: new ColorTexture(new Color(1,1,1)), brightness: 5 }),
  });

  // const cameraOrigin = new Vector3(5,1,0);
  const cameraOrigin = new Vector3(5,0,0);
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
  scene.addChild(sphereLight);
  scene.addChild(planeLight);

  return { scene, camera };
}
