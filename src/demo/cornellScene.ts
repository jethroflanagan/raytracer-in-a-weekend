import { Color } from 'src/Color';
import { EmissionMaterial } from 'src/material/EmissionMaterial';
import { Camera } from 'src/scene/Camera';
import { Scene } from 'src/scene/Scene';
import { ColorTexture } from 'src/texture/ColorTexture';
import { Vector3 } from 'src/Vector';
import { Plane } from 'src/volume/Plane';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { Sphere } from 'src/volume/Sphere';
import { MetalMaterial } from 'src/material/MetalMaterial';
import { DialectricMaterial } from 'src/material/DialectricMaterial';
import { Box } from 'src/volume/Box';

function createCornellBox({ size, extendSize }) {
  const greenMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.12,.45,.15)) });
  const redMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.65,.05,.05)) });
  const whiteMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.73,.73,.73)) });

  const planeLeft = new Plane({ a0: 0, a1: size, b0: extendSize, b1: size, k: size, axis: 'x', flipNormals: true,
    material: greenMaterial,
  });
  const planeRight = new Plane({ a0: 0, a1: size, b0: extendSize, b1: size, k: 0, axis: 'x',
    material: redMaterial,
  });
  const planeTop = new Plane({ a0: 0, a1: size, b0: extendSize, b1: size, k: size, axis: 'y', flipNormals: true,
    material: whiteMaterial,
  });
  const planeBottom = new Plane({ a0: 0, a1: size, b0: extendSize, b1: size, k: 0, axis: 'y',
    material: whiteMaterial,
  });
  const planeBack = new Plane({ a0: 0, a1: size, b0: 0, b1: size, k: size, axis: 'z', flipNormals: true,
    material: whiteMaterial,
  });
  // const planeFront = new Plane({ a0: 0, a1: size, b0: 0, b1: size, k: extendSize, axis: 'z',// flipNormals: true,
  //   material: whiteMaterial,
  // });

  return [
    planeLeft,
    planeRight,
    planeTop,
    planeBottom,
    planeBack,
    // planeFront,
  ];
}

export async function create({ aspectRatio, width, height }) {
  const scene = new Scene();

  const whiteMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.73, .73, .73)) });
  const boxMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.73, .73, .73)) });
  const metalMaterial = new MetalMaterial({ albedo: new ColorTexture(new Color(1,1,1)) });
  const glassMaterial = new DialectricMaterial({ albedo: new ColorTexture(new Color(1,1,1)) });
  const lightMaterial = new EmissionMaterial({ albedo: new ColorTexture(new Color(1,1,1)), brightness: 15 });

  const size = 555;
  const halfSize = size / 2;
  const extendSize = -size * 2;

  const boxSides = createCornellBox({ size, extendSize });

  const boxDimensions = new Vector3(150, 300, 100);
  const box2Dimensions = new Vector3(200, 80, 200);
  const box = new Box({ center: new Vector3(halfSize * .75, boxDimensions.y / 2, halfSize * 1.3), dimensions: boxDimensions,  material: boxMaterial });
  const box2 = new Box({ center: new Vector3(halfSize * .3, box2Dimensions.y / 2, halfSize * 1.1), dimensions: box2Dimensions,  material: boxMaterial });

  const lightSize = 180;
  const light = new Plane({ a0: halfSize - lightSize, a1: halfSize + lightSize, b0: halfSize - lightSize, b1: halfSize + lightSize, k: size - 1, axis: 'y',
    material: lightMaterial,
  });
  const sphereLight = new Sphere({
    center: new Vector3(halfSize * .1, halfSize, 0),
    radius: 40,
    material: new EmissionMaterial({ albedo: new ColorTexture(new Color(1,1,1)), brightness: 15 }),
  });

  const sphereSize = 110;
  const box3Dimensions = new Vector3(250, 60, 250);
  const box3Center = new Vector3(halfSize * 1.5, box3Dimensions.y / 2, halfSize * .1);
  const sphere = new Sphere({
    center: new Vector3(box3Center.x, sphereSize + box3Dimensions.y, box3Center.z),
    radius: sphereSize,
    material: glassMaterial,
  });
  const box3 = new Box({
    center: box3Center,
    dimensions: box3Dimensions,
    material: boxMaterial
  });

  const sphere2Size = 80;
  const sphere2 = new Sphere({
    center: box.center.add(new Vector3(0, box.dimensions.y / 2 + sphere2Size, 0)),
    radius: sphere2Size,
    material: whiteMaterial,
  });

  const cameraOrigin = new Vector3(halfSize, halfSize, -size * 1.4);
  const cameraTarget = new Vector3(halfSize, halfSize, 0);
  const focalDistance = 10;//cameraTarget.subtract(cameraOrigin).length();
  const camera: Camera = new Camera({
    origin: cameraOrigin,
    aspectRatio,
    verticalFOV: 40,
    lookAt: cameraTarget,
    aperture: 0,
    focalDistance,
    shutterOpenTime: 0,
  });

  scene.setActiveCamera(camera);
  boxSides.forEach(side => scene.addChild(side));
  scene.addChild(sphere);
  scene.addChild(sphere2);
  scene.addChild(box);
  scene.addChild(box2);
  scene.addChild(box3);
  scene.addChild(light);
  // scene.addChild(sphereLight);

  return { scene, camera };
}
