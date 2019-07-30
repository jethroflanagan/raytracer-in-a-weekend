import { Color } from 'src/Color';
import { Intersection } from 'src/Intersection';
import { Texture } from './Texture';

export class ImageTexture implements Texture {

  constructor() {
  }

  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }) {
    const { point } = intersection;
    return new Color(.5, .5, .5);
  }

}
