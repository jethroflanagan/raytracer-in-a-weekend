import { Color } from 'src/Color';
import { Intersection } from 'src/Intersection';
import { Texture } from './Texture';
import { SimpleImage } from 'src/SimpleImage';

export class ImageTexture implements Texture {

  constructor(private image: SimpleImage) {
  }

  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }) {
    const { point } = intersection;
    const x = Math.floor(u * this.image.width);
    const y = Math.floor(v * this.image.height);
    return this.image.getPixel(x, y);
  }

}
