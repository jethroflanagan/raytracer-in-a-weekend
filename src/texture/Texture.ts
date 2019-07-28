import { Color } from 'src/Color';
import { Intersection } from 'src/Intersection';

export interface Texture {
  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }): Color;
}
