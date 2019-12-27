import { Color } from 'src/Color';
import { DialectricMaterial } from 'src/material/DialectricMaterial';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { MetalMaterial } from 'src/material/MetalMaterial';
import { NormalMaterial } from 'src/material/NormalMaterial';
import { Camera } from 'src/scene/Camera';
import { FlatBackground } from 'src/scene/FlatBackground';
import { Scene } from 'src/scene/Scene';
import { getRandomPointInCircle, placeSphereOnSurfaceFromPosition, lerp, random } from 'src/utils/math';
import { Vector3 } from 'src/Vector';
import { Sphere } from 'src/volume/Sphere';
import { Animator } from 'src/animation/Animator';
import { ColorTexture } from 'src/texture/ColorTexture';
import { CheckerTexture } from 'src/texture/CheckerTexture';
import { ImageTexture } from 'src/texture/ImageTexture';
import { SimpleImage } from 'src/SimpleImage';
import marsImageAsset from 'src/demo/earth-map2.jpg';
import { NoiseTexture } from 'src/texture/NoiseTexture';
import { EmissionMaterial } from 'src/material/EmissionMaterial';

const setupPlaceOnSurface = ({ surfaceCenter, surfaceRadius }) => ({ from, sphereRadius }) => {
  return placeSphereOnSurfaceFromPosition({ from, surfaceCenter, sphereRadius, surfaceRadius });
}

export async function create({ aspectRatio, width, height }) {

  const scene = new Scene();

  const background = new FlatBackground();
  // scene.addBackground(background);

  const groundCenter = new Vector3(0, -1000, 0);
  const groundSize = 1000;
  const ground = new Sphere({
    center: new Vector3(0, -1000, 0),
    radius: groundSize,
    material: new LambertMaterial({ albedo:
      new CheckerTexture({
        even: new ColorTexture(new Color(.1, .8, .3)),
        odd: new ColorTexture(new Color(.2, .4, .8)),
        size: 1,
      }),
    }),
  });
  scene.addChild(ground);

  const placeOnGround = setupPlaceOnSurface({ surfaceCenter: groundCenter, surfaceRadius: groundSize });

  const positionScale = 1;
  const area = 14;
  const areaStart = 4;
  const getMaterial = () => {
    const pick = random();
    if (pick < .35) {
        return new LambertMaterial({ albedo: new ColorTexture(new Color(random(), random(), random())) });
    }
    // if (pick < .7) {
        return new MetalMaterial({ albedo: new ColorTexture(new Color(random(), random(), random())), reflectance: 1, fuzziness: 0 });
    // }
    // return new NormalMaterial();
  }
  const positions: { position: Vector3, radius: number }[] = [];

  const bigSize = 3;
  const bigSphere1 = new Sphere({
    center: placeOnGround({ from: new Vector3(-4, 3, -20), sphereRadius: bigSize }),
    radius: bigSize,
    material: new LambertMaterial({ albedo: new ImageTexture(await SimpleImage.load(marsImageAsset)) }),
  });
  const bigSphere2 = new Sphere({
    center: placeOnGround({ from: new Vector3(2, 3, -22), sphereRadius: bigSize }),
    radius: bigSize,
    material: new MetalMaterial({ albedo: new ColorTexture(new Color(1,.9,1)), reflectance: 1, fuzziness: 0 }),
  });

  const bigSphere3 = new Sphere({
    center: placeOnGround({ from: new Vector3(6, 3, -27), sphereRadius: bigSize }),
    radius: bigSize,
    material: new DialectricMaterial({ albedo: new ColorTexture(new Color(1,1,1)), reflectance: 1, fuzziness: 0 }),
  });
  const bigSphere4 = new Sphere({
    center:  placeOnGround({ from: new Vector3(-1, 5, -17), sphereRadius: bigSize }).add(new Vector3(0, 3, 0)),
    radius: 1.3,
    material: new LambertMaterial({ albedo: new NoiseTexture({ scale: 1, turbulance: 6 }) }),
  });

  const light = new Sphere({
    center: placeOnGround({ from: new Vector3(2, 15, -22), sphereRadius: 1 }).add(new Vector3(0, 15, 0)),
    radius: 3,
    material: new EmissionMaterial({ albedo: new ColorTexture(new Color(1,1,1)), brightness: 25 }),
  });

  scene.addChild(bigSphere1);
  scene.addChild(bigSphere2);
  scene.addChild(bigSphere3);
  scene.addChild(bigSphere4);
  scene.addChild(light);
  positions.push({ position: bigSphere1.center, radius: bigSize });
  positions.push({ position: bigSphere2.center, radius: bigSize });
  positions.push({ position: bigSphere3.center, radius: bigSize });

  const addPosition = ({ position, radius }) => {

    if (!positions.find(p => position.subtract(p.position).length() < radius + p.radius)) {
      positions.push({ position, radius });
      return true;
    }
    return false;
  };

  for (let i = 0; i < 70; i++) {
    const size = .5 + random() * 1;
    let x;
    let z;
    let center;
    // prevent sphere intersections
    do {
      let position = getRandomPointInCircle({ radius: size + area, expand: areaStart });
      x = position.x;
      z = position.y;
      center = new Vector3(x * positionScale, .1, z * positionScale - 28);
      center = placeOnGround({ from: center, sphereRadius: size });
    } while (!addPosition({ position: center, radius: size }));

    const sphere5 = new Sphere({
      center: center,
      radius: size,
      material: getMaterial(),//new MetalMaterial({ albedo: new Color(random(), random(), random()), reflectance: 1, fuzziness: 0 }),//new LambertMaterial({ albedo: new Color(random(), random(), random()) }),
    });
    scene.addChild(sphere5);
  }

  const cameraOrigin = new Vector3(0,14,5);
  const cameraTarget = bigSphere2.center;
  const focalDistance = cameraTarget.subtract(cameraOrigin).length();
  const camera: Camera = new Camera({
    origin: cameraOrigin,
    aspectRatio,
    verticalFOV: 30,
    lookAt: cameraTarget,
    // up: new Vector3(1, 0, 1),
    aperture: .4,
    focalDistance,
    shutterOpenTime: 0, //150,
  });
  scene.setActiveCamera(camera);


  const animator: Animator = new Animator();
  animator.animate({
    item: camera,
    from: {
      verticalFOV: 40,
      originX: 0,
      originY: 10,
      originZ: 0,
    },
    to: {
      verticalFOV: 30,
      originX: 14,
      originY: 12,
      originZ: 0,
    },
    ease: lerp,
    startTime: 100,
    endTime: 1000,
    update: ({ item, properties }) => {
      // item.verticalFOV = properties.verticalFOV;
      item.origin.x = properties.originX;
    },
  });
  scene.addAnimator(animator);

  return { scene, camera };
}
