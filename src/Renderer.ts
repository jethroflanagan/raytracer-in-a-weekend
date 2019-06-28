import { Camera } from './Camera';
import { Color } from './Color';
import { Image } from './Image';
import { Intersection } from './Intersection';
import { Ray } from './Ray';
import { Scene } from './Scene';
import { Vector3 } from './Vector';
import { Volume } from './Volume';

const T_MIN = .001;
const T_MAX = Infinity;
const MAX_RAY_DEPTH = 100;

export type AntialiasOptions = {
  numSamples: number,
  blurRadius: number,
  isUniform: boolean,
};

export type RenderOptions = {
  antialias?: AntialiasOptions,
  quality?: number,
  blockSize?: number,
};

// RHS camera (y up, x right, negative z into screen)
export class Renderer {
  private canvas = null;
  private ctx = null;
  private renderBuffer: ImageData = null;
  private width: number = 0;
  private height: number = 0;
  private camera: Camera;
  private scene: Scene;

  constructor({ canvas, camera, scene }: { canvas: any, camera: Camera, scene: Scene }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.camera = camera;
    this.scene = scene;
    this.renderBuffer = this.ctx.createImageData(this.width, this.height);
  }

  setPixel = ({ x, y, width, color, renderBuffer }: { x: number, y: number, width?: number, color: Color, renderBuffer?: ImageData }) => {
    const { width: globalWidth, renderBuffer: globalRenderBuffer } = this;
    if (width == null) {
      width = globalWidth;
    }
    if (!renderBuffer) {
      renderBuffer = globalRenderBuffer;
    }
    const { r, g, b, a } = color;
    const index = y * (width * 4) + x * 4;
    renderBuffer.data[index] = ~~(r * 255);
    renderBuffer.data[index + 1] = ~~(g * 255);
    renderBuffer.data[index + 2] = ~~(b * 255);
    renderBuffer.data[index + 3] = ~~(a * 255);
    return renderBuffer;
  }

  saveImage() {
    const { width, height } = this;
    const image: Image = new Image(width, height);

    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        const color = image.getPixel(x, y);
        image.setPixel(x, y, color);
      }
    }
    return image;
  }

  shadeNormal({ intersection, volume }: { intersection: Intersection, volume: Volume }): Color {
    const v = intersection.normal.add(1).multiply(.5);
    return v.toColor();
  }

  getColorForRay(ray: Ray, depth: number = 0): Color {
    const { scene } = this;
    const { background } = scene;

    const { intersection, volume } = scene.hit(ray, T_MIN, T_MAX);
    if (intersection != null) {
      let color: Color = null;
      if (depth >= MAX_RAY_DEPTH) {
        return new Color(0, 0, 0, 1);
      }
      // color = this.shadeNormal({ intersection, volume });return color;
      // const origin = intersection.point;
      // const target = origin.add(intersection.normal).add(Vector3.randomDirection());
      // const direction = target.subtract(origin);

      // let colorV: Vector3 = colorToVector(this.getColorForRay(new Ray(origin, direction)));
      // colorV = colorV.multiply(.5)
      //   // .add(colorToVector(color).multiply(.5));
      // color = vectorToColor(colorV);

      if (volume.material) {
        const { attenuation, bounceRay } = volume.material.bounce({ ray, intersection });
        if (bounceRay) {
          color = this.getColorForRay(bounceRay, depth + 1)//.toVector().multiply(attenuation.toVector()).toColor();
          return color.toVector().multiply(attenuation.toVector()).toColor();
        }
        return attenuation;
      }
      // error
      return new Color(1, 0, 0, 1);
    }
    return background.getColor(ray);
  }

  antialiasForXY(x: number, y: number, { numSamples = 10, blurRadius = 1, isUniform = false }: AntialiasOptions = <AntialiasOptions>{}): Color {
    let colorV: Vector3 = new Vector3(0, 0, 0);

    for (let s = 0; s < numSamples; s++) {
      const angleVal = isUniform ? s / numSamples : Math.random();
      const sampleAngle = angleVal * Math.PI * 2;
      const resultV: Color = this.getColorForXY(
        (x + Math.cos(sampleAngle) * blurRadius),
        (y + Math.sin(sampleAngle) * blurRadius)
      );
      colorV = new Vector3(resultV.r, resultV.g, resultV.b).add(colorV);
    }
    colorV = colorV.divide(numSamples);
    return colorV.toColor();
  }

  correctGamma(color: Color): Color {
    return new Vector3(Math.sqrt(color.r), Math.sqrt(color.g), Math.sqrt(color.b)).toColor();
  }

  getColorForXY(x, y): Color {
    const { width, height, camera } = this;
    const u = x / width;
    const v = y / height;
    const ray = camera.getRay(u, v);
    return this.getColorForRay(ray);
  }

  render = ({ antialias = null, quality = 1, blockSize = 50 }: RenderOptions = <RenderOptions>{}) => {
    const renderStart = performance.now();
    const { ctx, renderBuffer, width, height } = this;

    const renderXY = antialias ? (x, y) => this.antialiasForXY(x, y, { ...antialias }) : (x, y) => this.getColorForXY(x, y);

    // // old
    // for (let y: number = 0; y < height; y++) {
    //   for (let x: number = 0; x < width; x++) {
    //     let color: Color;
    //     let colorPasses: Vector3 = new Vector3(0,0,0);
    //     for (let q = 0; q < quality; q++) {
    //       let pass: Color = renderXY(x, y);
    //       colorPasses = colorPasses.add(pass.toVector());
    //     }
    //     color = colorPasses.divide(quality).toColor();
    //     // color = this.correctGamma(color);
    //     // TODO: do this conversion, ensure right side up
    //     this.setPixel(x, height - 1 - y, color);
    //   }
    // }
    // ctx.putImageData(renderBuffer, 0, 0);

    // // normal
    // for (let y: number = 0; y < height; y += blockSize) {
    //   for (let x: number = 0; x < width; x += blockSize) {
    //     setTimeout(() => {
    //       this.renderBlock({ x, y, width: blockSize, height: blockSize }, { antialias, quality });
    //     }, y * width / blockSize + x);
    //   }
    // }

    const getDist = (x, y) => Math.sqrt( (x - width / 2) ** 2 + (y - height / 2) ** 2 );
    const position = [];
    for (let y: number = 0; y < height; y += blockSize) {
      for (let x: number = 0; x < width; x += blockSize) {
        position.push({ x, y, distance: getDist(x, y) });
      }
    };
    position.sort((a,b) => a.distance - b.distance);
    for (let i: number = 0; i < position.length; i++) {
      const { x, y } = position[i];
      setTimeout(() => {
        this.renderBlock({ x, y, width: blockSize, height: blockSize }, { antialias, quality });
      }, i * 100);
    }

    console.log('render time: ' + (performance.now() - renderStart));
  }

  renderBlock(area: { x, y, width, height }, { antialias = null, quality = 1 }) {
    // const renderStart = performance.now();
    const { ctx, width, height } = this;
    const renderBuffer = this.ctx.createImageData(area.width, area.height);
    const renderXY = antialias ? (x, y) => this.antialiasForXY(x, y, { ...antialias }) : (x, y) => this.getColorForXY(x, y);
    for (let y: number = area.y; y < area.y + area.height; y++) {
      for (let x: number = area.x; x < area.x + area.width; x++) {

        let color: Color;
        let colorPasses: Vector3 = new Vector3(0, 0, 0);
        for (let q = 0; q < quality; q++) {
          let pass: Color = renderXY(x, y);
          colorPasses = colorPasses.add(pass.toVector());
        }
        color = colorPasses.divide(quality).toColor();

        // color = this.correctGamma(color);

        // TODO: do this conversion, ensure right side up
        this.setPixel({ x: x - area.x, y: area.y + area.height - 1 - y, color, renderBuffer, width: area.width });
      }
    }

    ctx.putImageData(renderBuffer, area.x, height - area.y - area.height);
    // console.log('block time: ' + (performance.now() - renderStart));
    // return renderBuffer;
  }
}
