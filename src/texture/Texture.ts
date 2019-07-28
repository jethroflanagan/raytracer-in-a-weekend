import { Color } from 'src/Color';

export interface Texture {

  getColor({ u, v }: { u: number, v: number }): Color;
}
