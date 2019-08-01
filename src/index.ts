import { create as createDemoScene } from 'src/demo/demoScene';
import { Renderer } from 'src/Renderer';
import "src/style.scss";
import { Ray } from './Ray';
import { RenderProgress } from './ui/RenderProgress';
import { seedRandom } from './utils/math';
import { Vector3 } from './Vector';
import { Color } from './Color';

// TODO: add to scene and move render code into renderer
async function render({ canvas, ui, renderBlock }) {
  const width = canvas.width;
  const height = canvas.height;
  const aspectRatio = width / height;

  const { scene, camera } = await createDemoScene({ aspectRatio, width, height });
  // const { scene, camera } = createTestScene({ aspectRatio, width, height });
  // const { scene, camera } = createBookCoverScene({ aspectRatio, width, height });
  const renderer = new Renderer({ canvas, camera, scene });

  const renderProgress = new RenderProgress({ element: ui, block: renderBlock });
  renderer.setOnRenderUpdate({
    onProgress: (type, percent) => renderProgress.update(type, percent),
    onBlockStart: (x, y, width, height) => renderProgress.updateBlockPreview(x, y, width, height),
    onStart: () => renderProgress.start(),
    onComplete: () => renderProgress.complete(),
  });

  // const renderProperties = { antialias: { numSamples: 10, blurRadius: .5, isUniform: false }, quality: 20, resolution: 1 }
  const renderProperties = { quality: 10, resolution: 1 }

  renderSingle({ canvas,  renderer, renderProperties });

  // renderSequence({ canvas, renderer, renderProperties });

  // testBvh({ scene, camera, renderer });
}

function testBvh({ scene, camera, renderer }) {
//   x: -3.9865389730572693
// y: -1.0504230941146488
// z: -10.005384410777094
  const ray = new Ray(camera.origin, new Vector3(-3.9865389730572693, -1.0504230941146488, -10.005384410777094), { time: 0 });
  const intersection = scene.hitTest(
    ray,
    // new Ray(camera.origin, new Vector3(1, -0.05042309411464885, -10), { time: 0 }),
    0.001,
    Infinity,
  );

}

function renderSingle({ canvas, renderer, renderProperties }) {
    // const renderProgress = new RenderProgress({ element: ui, block: renderBlock });


  // renderer.render({
  //   antialias: { numSamples: 5, blurRadius: .5, isUniform: false },
  //   quality: 3,
  //   resolution: 1,
  //   time: 500, timeIncrement: 20,
  // });

  renderer.render({ ...renderProperties, time: 0, timeIncrement: 50 });
}

async function renderSequence({ canvas, renderer, renderProperties }) {
  const numFrames = 10;
  const fps = 24;
  const frameTime = 1000 / fps;
  for (let frame = 0; frame < numFrames; frame++) {
    await renderer.render({ ...renderProperties, time: 0 + frame * frameTime, timeIncrement: frameTime });

    const frameCanvas = document.createElement('canvas');
    const el = document.getElementById('frames');
    el.appendChild(frameCanvas);
    frameCanvas.setAttribute('width', canvas.width);
    frameCanvas.setAttribute('height', canvas.height);
    frameCanvas.getContext('2d').drawImage(canvas, 0, 0);
  }
}

(function run() {
  seedRandom('test8');
  render({
    canvas: document.getElementById('render'),
    ui: document.getElementById('ui'),
    renderBlock: document.getElementById('render-block'),
  });
})();
