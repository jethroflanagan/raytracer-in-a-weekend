import { Color } from 'src/Color';
import { Image } from 'src/Image';
import { Intersection } from 'src/Intersection';
import { Ray } from 'src/Ray';
import { Camera } from 'src/scene/Camera';
import { Scene } from 'src/scene/Scene';
import { Vector3 } from 'src/Vector';
import { Volume } from 'src/volume/Volume';

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
  resolution?: number, // 0.1 -> 5+ (width,height multiplier)
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

  render = async ({ antialias = null, quality = 1, blockSize = 50, resolution = 1 }: RenderOptions = <RenderOptions>{}) => {
    const renderStart = performance.now();
    const { ctx, canvas, width, height } = this;

    if (resolution !== 1) {
      canvas.width = Math.round(width * resolution)
      canvas.height = Math.round(height * resolution)
      canvas.setAttribute('style', `transform: scale(${1/resolution})`);
    }
    else {
      canvas.setAttribute('style', '');
    }

    // render blocks from center
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
      await  this.renderBlock({ x, y, width: blockSize, height: blockSize }, { antialias, quality, resolution });
    }


    // ctx.drawImage( resolutionCanvas, 0, 0, width, height );

    // else {
    //   ctx.drawImage( canvas, 0, 0, Math.round(width / resolution), Math.round(height / resolution) );
    // }
    console.log('render time: ' + (performance.now() - renderStart));
  }

  renderBlock(area: { x, y, width, height }, { antialias, quality, resolution }) {
    // const renderStart = performance.now();
    const { ctx, width, height } = this;
    const blockX = area.x * resolution;
    const blockY = area.y * resolution;
    const blockWidth = area.width * resolution;
    const blockHeight = area.height * resolution;
    const renderBuffer = this.ctx.createImageData(blockWidth, blockHeight);
    const renderXY = antialias ? (x, y) => this.antialiasForXY(x, y, { ...antialias }) : (x, y) => this.getColorForXY(x, y);
    for (let y: number = blockY; y < blockY + blockHeight; y++) {
      for (let x: number = blockX; x < blockX + blockHeight; x++) {

        let color: Color;
        let colorPasses: Vector3 = new Vector3(0, 0, 0);
        for (let q = 0; q < quality; q++) {
          let pass: Color = renderXY(x / resolution, y / resolution);
          colorPasses = colorPasses.add(pass.toVector());
        }
        color = colorPasses.divide(quality).toColor();

        // color = this.correctGamma(color);

        // TODO: do this conversion, ensure right side up
        this.setPixel({ x: (x - blockX), y: (blockY + blockHeight - 1 - y), color, renderBuffer, width: blockWidth });
      }
    }

    const p = new Promise(resolve => {
      // needs to be setTimeout to prevent the putImageData from locking up the processor
      setTimeout(() => {
        ctx.putImageData(renderBuffer, area.x * resolution, (height - area.y - area.height)  * resolution);
        resolve();
      }, 1);
    });
    return p;
    // console.log('block time: ' + (performance.now() - renderStart));
    // return renderBuffer;
  }
}
