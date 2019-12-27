import { Color } from 'src/Color';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { Camera } from 'src/scene/Camera';
import { FlatBackground } from 'src/scene/FlatBackground';
import { Scene } from 'src/scene/Scene';
import { ColorTexture } from 'src/texture/ColorTexture';
import { Vector3 } from 'src/Vector';
import { Box } from 'src/volume/Box';
import { Translate } from 'src/volume/transform/Translate';
import { Rotate } from 'src/volume/transform/Rotate';
import { flipNormals } from 'src/volume/modifier/FlipNormals';
import { MetalMaterial } from 'src/material/MetalMaterial';
import { Sphere } from 'src/volume/Sphere';
import { EmissionMaterial } from 'src/material/EmissionMaterial';
import { DialectricMaterial } from 'src/material/DialectricMaterial';

export async function create({ aspectRatio, width, height }) {

  const scene = new Scene();
  const background = new FlatBackground();

  const whiteMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.73, .73, .73)) });
  const boxMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.7, .5, .2)) });
  const metalMaterial = new MetalMaterial({ albedo: new ColorTexture(new Color(1,1,1)) });
  const glassMaterial = new DialectricMaterial({ albedo: new ColorTexture(new Color(1,1,1)) });
  const lightMaterial = new EmissionMaterial({ albedo: new ColorTexture(new Color(1,1,1)), brightness: 15 });

  const boxDimensions = new Vector3(20, 80, 50);
  const platformDimensions = new Vector3(100, 10, 100);
  const center = new Vector3();
  const box = new Box({ center: center.add(new Vector3(0, (platformDimensions.y + boxDimensions.y) / 2, 0)), dimensions: boxDimensions,  material: boxMaterial });
  const platform = new Box({ center, dimensions: platformDimensions,  material: whiteMaterial });

  const translatedBox = new Translate(box, new Vector3(20, 0, 0));
  // const rotatedBox = new Rotate(box, new Vector3(20, 0, 0));

  const surroundingSphere = flipNormals(new Sphere({
    center,
    radius: 150,
    material: metalMaterial,
  }));
  const ball = new Sphere({
    center: center.add(new Vector3(-20, 20, 0)),
    radius: 20,
    material: metalMaterial,
  });
  const light = flipNormals(new Sphere({
    center: center.add(new Vector3(0, 150, -50)),
    radius: 40,
    material: lightMaterial,
  }));

  const cameraOrigin = new Vector3(center.x, center.y + 100, center.z - 200);
  const cameraTarget = new Vector3(center.x, center.y + 30, center.z);
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
  // scene.addBackground(background);
  scene.addChild(translatedBox);
  scene.addChild(platform);
  scene.addChild(ball);
  scene.addChild(surroundingSphere);
  scene.addChild(light);

  return { scene, camera };
}
