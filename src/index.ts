import { create as createDemoScene } from 'src/demo/demoScene';
import { create as createTestScene } from 'src/demo/testScene';
import { create as createBookCoverScene } from 'src/demo/bookCoverScene';
import { create as createCornellScene } from 'src/demo/cornellScene';
import { create as createTransformsScene } from 'src/demo/transformsScene';
import { Renderer } from 'src/Renderer';
import { Ray } from './Ray';
import { RenderProgress } from './ui/RenderProgress';
import { seedRandom } from './utils/math';
import { Vector3 } from './Vector';
import PubSub from 'pubsub-js';

export * from './api';
export const RENDER_PROGRESS = 'RENDER_PROGRESS';
export const RENDER_COMPLETE = 'RENDER_COMPLETE';
export const RENDER_START = 'RENDER_START';
export const RENDER_BLOCK_START = 'RENDER_BLOCK_START';
export const RENDER_BLOCK_COMPLETE = 'RENDER_BLOCK_COMPLETE';
export const RENDER_QUALITY_LOW = { quality: 10, resolution: 1, maxRayDepth: 5 };
export const RENDER_QUALITY_HIGH = { quality: 500, resolution: 1, maxRayDepth: 10, blockSize: 25 };
export const RENDER_QUALITY_VERY_HIGH = { antialias: { numSamples: 5, blurRadius: .5, isUniform: false }, quality: 200, resolution: 1, maxRayDepth: 100 };

// TODO: add to scene and move render code into renderer
async function render({ canvas, ui, renderBlock, scene, camera, options = RENDER_QUALITY_LOW }) {
  const width = canvas.width;
  const height = canvas.height;
  const aspectRatio = width / height;

  // const { scene, camera } = await createCornellScene({ aspectRatio, width, height });
  // const { scene, camera } = await createDemoScene({ aspectRatio, width, height });
  // const { scene, camera } = await createTestScene({ aspectRatio, width, height });
  // const { scene, camera } = await createBookCoverScene({ aspectRatio, width, height });
  // const { scene, camera } = await createTransformsScene({ aspectRatio, width, height });
  const renderer = new Renderer({ canvas, camera, scene });

  // const renderProgress = new RenderProgress({ element: ui, block: renderBlock });
  renderer.setOnRenderUpdate({
    onProgress: (type, percent) => sendMessage(RENDER_PROGRESS, { percent }),
    onBlockStart: (x, y, width, height) => sendMessage(RENDER_BLOCK_START,{ x, y, width, height }),
    onStart: () => sendMessage(RENDER_START),
    onComplete: () => sendMessage(RENDER_COMPLETE),
  });
  // renderer.setOnRenderUpdate({
  //   onProgress: (type, percent) => renderProgress.update(type, percent),
  //   onBlockStart: (x, y, width, height) => renderProgress.updateBlockPreview(x, y, width, height),
  //   onStart: () => renderProgress.start(),
  //   onComplete: () => renderProgress.complete(),
  // });

  // const renderOptions = { antialias: { numSamples: 5, blurRadius: .5, isUniform: false }, quality: 200, resolution: 1, maxRayDepth: 100 }
  // const renderOptions = { quality: 500, resolution: 1, maxRayDepth: 10, blockSize: 25 }
  // const renderOptions = { quality: 10, resolution: 1, maxRayDepth: 5 }

  renderSingle({ renderer, renderOptions: options });

  // renderSequence({ canvas, renderer, renderOptions });
}

function sendMessage(id, content = null) {
  PubSub.publish(id, content);
}

function renderSingle({ renderer, renderOptions }) {
  renderer.render({ ...renderOptions, time: 0, timeIncrement: 50 });
}

async function renderSequence({ canvas, renderer, renderOptions }) {
  const numFrames = 10;
  const fps = 24;
  const frameTime = 1000 / fps;
  for (let frame = 0; frame < numFrames; frame++) {
    await renderer.render({ ...renderOptions, time: 0 + frame * frameTime, timeIncrement: frameTime });

    const frameCanvas = document.createElement('canvas');
    const el = document.getElementById('frames');
    el.appendChild(frameCanvas);
    frameCanvas.setAttribute('width', canvas.width);
    frameCanvas.setAttribute('height', canvas.height);
    frameCanvas.getContext('2d').drawImage(canvas, 0, 0);
  }
}

export function setupSeed(seed = 'default-render') {
  seedRandom(seed);
}

export function renderScene({ canvas, ui, renderBlock, camera, scene }) {
  render({ canvas, ui, renderBlock, camera, scene });
}


// (async function run() {
//   setupSeed('test8');
//   const canvas = document.getElementById('render');
//   const width = canvas.width;
//   const height = canvas.height;
//   const aspectRatio = width / height;
//   const { scene, camera } = await createDemoScene({ aspectRatio });

//   render({
//     canvas,
//     ui: document.getElementById('ui'),
//     renderBlock: document.getElementById('render-block'),
//     scene,
//     camera,
//   });
// })();
