import { Vector3 } from "src/Vector";
import { clamp } from "src/utils/math";

// export function refractVector({ direction, normal, niOverNt }: { direction: Vector3, normal: Vector3, niOverNt: number }):
//   { discriminant: number, direction: Vector3 } {
//   const unitDirection = normal.unit();
//   const dt = unitDirection.dot(direction);
//   const discriminant =  niOverNt ** 2 * (1 - dt ** 2);
//   let outwardVector = null;
//   if (discriminant > 0) {
//     outwardVector = unitDirection.subtract( normal.multiply(dt) ).multiply(niOverNt)
//       .subtract( normal.multiply(Math.sqrt(discriminant)) );
//   }
//   else {
//     outwardVector = direction.add( normal.multiply(direction.dot(normal)) );
//   }

//   return {
//     discriminant,
//     direction: outwardVector,
//   };
// }

// Ported from https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/reflection-refraction-fresnel
export function refractVector({ direction, normal, refractiveIndex }:
  { direction: Vector3, normal: Vector3, refractiveIndex: number }):
  { discriminant: number, direction: Vector3, cosine: number }
{
  let bounceRay = normal;
  let cosine = clamp(-1, 1, direction.dot(normal));
  let etai = 1;
  let etat = refractiveIndex;

  // TODO: inverted from original version. why?
  if (cosine > 0) {
    cosine *= -1;
  }
  else {
    const temp = etai;
    etai = etat;
    etat = temp;
    bounceRay = normal.multiply(-1);
  }
  const eta = etai / etat;
  const k = 1 - eta ** 2 * (1 - cosine ** 2);
  return {
    // TODO: how to use dirciminant?
    discriminant: k < 0 ? new Vector3() : direction.multiply(eta).add( eta * cosine - Math.sqrt(k) ).multiply(bounceRay),
    direction: bounceRay,
    cosine,
  };
}
