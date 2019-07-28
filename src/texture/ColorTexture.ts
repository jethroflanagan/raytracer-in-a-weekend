import { Color } from 'src/Color';
import { Texture } from './Texture';
import { Intersection } from 'src/Intersection';

export class ColorTexture implements Texture {

  constructor(private color: Color) {
  }

  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }) {
    return this.color;
  }
}
