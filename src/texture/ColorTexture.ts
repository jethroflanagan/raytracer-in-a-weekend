import { Color } from 'src/Color';
import { Texture } from './Texture';

export class ColorTexture implements Texture {

  constructor(private color: Color) {
  }

  getColor({ u, v }: { u: number, v: number }) {
    return this.color;
  }
}
