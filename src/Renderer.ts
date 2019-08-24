import { Color } from 'src/Color';
import { Intersection } from 'src/Intersection';
import { Ray } from 'src/Ray';
import { Camera } from 'src/scene/Camera';
import { Scene } from 'src/scene/Scene';
import { Vector3 } from 'src/Vector';
import { Volume } from 'src/volume/Volume';
import { random } from './utils/math';

const T_MIN = .001;
const T_MAX = Infinity;
const MAX_RAY_DEPTH = 100;
const noop = function () {};

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
  time?: number,
  timeIncrement?: number, // time increments for camera shutter open time
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
  private onProgress: Function;
  private onStart: Function;
  private onBlockStart: Function;
  private onComplete: Function;

  constructor({ canvas, camera, scene }: { canvas: any, camera: Camera, scene: Scene }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.camera = camera;
    this.scene = scene;
    this.renderBuffer = this.ctx.createImageData(this.width, this.height);
    this.setOnRenderUpdate();
  }

  setOnRenderUpdate({ onProgress = noop, onStart = noop, onBlockStart = noop, onComplete = noop }:
    { onProgress?: Function, onStart?: Function, onBlockStart?: Function, onComplete?: Function } = {}
  ) {
    this.onProgress = onProgress;
    this.onStart = onStart;
    this.onBlockStart = onBlockStart;
    this.onComplete = onComplete;
  }

  setPixel = ({ x, y, width, color, renderBuffer }: { x: number, y: number, width?: number, color: Color, renderBuffer?: ImageData }) => {
    const { width: globalWidth, renderBuffer: globalRenderBuffer } = this;
    if (width == null) {
      width = globalWidth;
    }
    if (!renderBuffer) {
      renderBuffer = globalRenderBuffer;
    }
    const { r, g, b } = color;
    const index = y * (width * 4) + x * 4;
    renderBuffer.data[index] = ~~(r * 255);
    renderBuffer.data[index + 1] = ~~(g * 255);
    renderBuffer.data[index + 2] = ~~(b * 255);
    renderBuffer.data[index + 3] = ~~(1 * 255);
    return renderBuffer;
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
        return new Color(0, 0, 0);
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
        const { u, v } = volume.getUV(intersection.point);
        const { attenuation, bounceRay } = volume.material.bounce({ ray, intersection, u, v });
        if (bounceRay) {
          color = this.getColorForRay(bounceRay, depth + 1)//.toVector().multiply(attenuation.toVector()).toColor();
          return color.toVector().multiply(attenuation.toVector()).toColor();
        }
        return attenuation;
      }
      // error
      return new Color(1, 0, 0);
    }
    return background.getColor(ray);
  }

  antialiasForXY(x: number, y: number, time: number, { numSamples = 10, blurRadius = 1, isUniform = false }: AntialiasOptions = <AntialiasOptions>{}): Color {
    let colorV: Vector3 = new Vector3(0, 0, 0);

    for (let s = 0; s < numSamples; s++) {
      const angleVal = isUniform ? s / numSamples : random();
      const sampleAngle = angleVal * Math.PI * 2;
      const resultV: Color = this.getColorForXY(
        (x + Math.cos(sampleAngle) * blurRadius),
        (y + Math.sin(sampleAngle) * blurRadius),
        time,
      );
      colorV = new Vector3(resultV.r, resultV.g, resultV.b).add(colorV);
    }
    colorV = colorV.divide(numSamples);
    return colorV.toColor();
  }

  correctGamma(color: Color): Color {
    return new Vector3(Math.sqrt(color.r), Math.sqrt(color.g), Math.sqrt(color.b)).toColor();
  }

  getColorForXY(x: number, y: number, time: number): Color {
    const { width, height, camera } = this;
    const u = x / width;
    const v = y / height;
    const ray = camera.getRay(u, v, time);
    return this.getColorForRay(ray);
  }

  // TODO: make timeIncrement correctly divide into shutterOpenTime (misses last render)
  render = async ({ antialias = null, quality = 1, blockSize = 50, resolution = 1, time = 0, timeIncrement = 100 }: RenderOptions = <RenderOptions>{}) => {
    const renderStart = performance.now();
    this.onStart();

    const { scene } = this;

    const { ctx, canvas, width, height } = this;

    // TODO: fix this
    // scene.createBoundingVolumeHeirarchies(T_MIN, T_MAX);

    // TODO: do this in the UI
    if (resolution !== 1) {
      canvas.width = Math.round(width * resolution)
      canvas.height = Math.round(height * resolution)
      canvas.parentElement.setAttribute('style', `transform: scale(${1/resolution})`);
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

    // console.log(time, this.scene.camera.shutterOpenTime, timeIncrement);

    // render for time
    // TODO: store buffers for next from and `shift()` as the time moves ahead
    // TODO: (OPTIMIZATION) only re-render buffers that contain an object being animated
    const blendingBlocks = new Array(position.length).fill([], 0, position.length); // used to blend blocks together
    let blendIndex = 0;

    // Need to run loops in this order so easing (scene.updateTime) only occurs once instead of repeating the ease calcs per renderBlock
    const startTime = time;
    const endTime = startTime + this.scene.camera.shutterOpenTime;
    for (let currentTime = startTime; currentTime <= endTime; currentTime += timeIncrement) {
      const sceneTime = currentTime;
      this.scene.updateTime(sceneTime);
      const activeBlendList = blendingBlocks[blendIndex];
      for (let i: number = 0; i < position.length; i++) {
        const { x, y } = position[i];
        const block = await this.renderBlock({ x, y, width: blockSize, height: blockSize }, { antialias, quality, resolution, time: sceneTime });

        if (activeBlendList[i] == null) {
          activeBlendList[i] = [];
        }
        const activeBlend = activeBlendList[i];
        activeBlend.push(block.renderBuffer);

        const blendedBuffer = this.blendBuffers(activeBlend);

        // unscaled
        this.onBlockStart(block.x, block.y, blockSize * resolution, blockSize * resolution);

        ctx.putImageData(blendedBuffer, block.x, block.y);

        // console.log('render progress: ' + (performance.now() - renderStart));
        // console.table([
        //   ['blocks', i / position.length ],
        //   ['motion blur', (currentTime - startTime) / (endTime - startTime) ],
        // ]);
        this.onProgress('block', i / position.length);
      }
      this.onProgress('block', 1);
      this.onProgress('all', (currentTime - startTime) / (endTime - startTime));
    }

    this.onComplete();
    console.log('render time: ' + (performance.now() - renderStart));

    // allow async/await for renderer
    return new Promise(resolve => setTimeout(resolve));
  }

  /**
   * Blends together multiple buffers so motion blur can be performed
   * @param buffers
   */
  blendBuffers(buffers: ImageData[]) {
    const blended = [];
    for (const buffer of buffers) {
      for (let index = 0; index < buffer.data.length; index++) {
        if (blended[index] == null) {
          blended[index] = 0;
        }
        blended[index] += buffer.data[index];
      }
    }
    const data: Uint8ClampedArray = new Uint8ClampedArray(blended.map(v => v / buffers.length));
    return new ImageData(data, buffers[0].width, buffers[0].height);
  }

  renderBlock(area: { x, y, width, height }, { antialias, quality, resolution, time }): Promise<{ renderBuffer: ImageData, x: number, y: number }> {
    // const renderStart = performance.now();
    const { ctx, width, height } = this;
    const blockX = area.x * resolution;
    const blockY = area.y * resolution;
    const blockWidth = area.width * resolution;
    const blockHeight = area.height * resolution;
    const renderBuffer = this.ctx.createImageData(blockWidth, blockHeight);

    const renderXY = antialias
      ? (x, y) => this.antialiasForXY(x, y, time, { ...antialias })
      : (x, y) => this.getColorForXY(x, y, time);

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

    const p: Promise<any> = new Promise(resolve => {
      // needs to be setTimeout to prevent the putImageData from locking up the processor
      setTimeout(() => {
        // ctx.putImageData(renderBuffer, area.x * resolution, (height - area.y - area.height)  * resolution);
        resolve({
          renderBuffer,
          x: area.x * resolution,
          y: (height - area.y - area.height)  * resolution
        });
      }, 1);
    });
    return p;
  }
}
