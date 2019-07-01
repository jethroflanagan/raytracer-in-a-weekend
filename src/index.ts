import { create as createTestScene } from 'src/demo/testScene';
import { create as createDemoScene } from 'src/demo/demoScene';
import { create as createBookCoverScene } from 'src/demo/bookCoverScene';
import { Renderer } from 'src/Renderer';
import "src/style.scss";
import { RenderProgress } from './ui/RenderProgress';

// TODO: add to scene and move render code into renderer
function render({ canvas, ui, renderBlock }) {
  const width = canvas.width;
  const height = canvas.height;
  const aspectRatio = width / height;

  // const { scene, camera } = createDemoScene({ aspectRatio, width, height });
  // const { scene, camera } = createTestScene({ aspectRatio, width, height });
  const { scene, camera } = createBookCoverScene({ aspectRatio, width, height });
  const renderer = new Renderer({ canvas, camera, scene });

  const renderProgress = new RenderProgress({ element: ui, block: renderBlock });
  renderer.setOnRenderUpdate({
    onProgress: (type, percent) => renderProgress.update(type, percent),
    onBlockStart: (x, y, width, height) => renderProgress.updateBlockPreview(x, y, width, height),
    onStart: () => renderProgress.start(),
    onComplete: () => renderProgress.complete(),
  });

  // const renderProperties = { antialias: { numSamples: 5, blurRadius: .5, isUniform: false }, quality: 1, resolution: 1 }
  const renderProperties = { quality: 5, resolution: 1 }

  renderSingle({ canvas,  renderer, renderProperties });
  // renderSequence({ canvas, renderer, renderProperties });
}

function renderSingle({ canvas, renderer, renderProperties }) {
    // const renderProgress = new RenderProgress({ element: ui, block: renderBlock });


  // renderer.render({
  //   antialias: { numSamples: 5, blurRadius: .5, isUniform: false },
  //   quality: 3,
  //   resolution: 1,
  //   time: 500, timeIncrement: 20,
  // });

  renderer.render({ ...renderProperties, time: 500, timeIncrement: 50 });
}

async function renderSequence({ canvas, renderer, renderProperties }) {
  const numFrames = 24;
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
  render({
    canvas: document.getElementById('render'),
    ui: document.getElementById('ui'),
    renderBlock: document.getElementById('render-block'),
  });
})();
